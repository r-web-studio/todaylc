import { BotContext } from '../types';
import { getEnrollCourseKeyboard, getBranchKeyboard, getMainMenuKeyboard } from '../keyboards';
import prisma from '../database/prisma';
import { notifyAdmins } from '../services/notification';

export async function handleEnrollStart(ctx: BotContext, preSelectedCourse?: string) {
  if (preSelectedCourse) {
    ctx.session.enrollmentData = { courseKey: preSelectedCourse };
    const t = ctx.t;
    const courseName = t(`courses.${preSelectedCourse}`);
    ctx.session.enrollmentData.course = courseName;
    ctx.session.step = 'awaiting_name';
    await ctx.reply(ctx.t('enroll.ask_name'));
    return;
  }

  ctx.session.step = 'awaiting_name';
  ctx.session.enrollmentData = {};
  await ctx.reply(ctx.t('enroll.ask_name'));
}

export async function handleEnrollName(ctx: BotContext, name: string) {
  if (name.length < 2) {
    await ctx.reply(ctx.t('enroll.invalid_name'));
    return;
  }

  ctx.session.enrollmentData = { ...ctx.session.enrollmentData, name: name.trim() };
  ctx.session.step = 'awaiting_phone';
  await ctx.reply(ctx.t('enroll.ask_phone'));
}

export async function handleEnrollPhone(ctx: BotContext, phone: string) {
  const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/;
  if (!phoneRegex.test(phone.trim())) {
    await ctx.reply(ctx.t('enroll.invalid_phone'));
    return;
  }

  ctx.session.enrollmentData = { ...ctx.session.enrollmentData, phone: phone.trim() };
  ctx.session.step = 'awaiting_course';

  if (ctx.session.enrollmentData?.course) {
    ctx.session.step = 'awaiting_branch';
    await ctx.reply(ctx.t('enroll.ask_branch'), {
      reply_markup: getBranchKeyboard(ctx),
    });
    return;
  }

  await ctx.reply(ctx.t('enroll.ask_course'), {
    reply_markup: getEnrollCourseKeyboard(ctx),
  });
}

export async function handleEnrollCourse(ctx: BotContext, courseKey: string) {
  const t = ctx.t;
  const courseName = t(`courses.${courseKey}`);
  ctx.session.enrollmentData = { ...ctx.session.enrollmentData, course: courseName };
  ctx.session.step = 'awaiting_branch';
  await ctx.reply(t('enroll.ask_branch'), {
    reply_markup: getBranchKeyboard(ctx),
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}

export async function handleEnrollBranch(ctx: BotContext, branch: string) {
  const t = ctx.t;
  const data = ctx.session.enrollmentData;
  if (!data?.name || !data?.phone || !data?.course) return;

  const branchDisplay = branch === 'URGANCH' ? t('enroll.branch_urganch') : t('enroll.branch_shovot');

  try {
    const application = await prisma.application.create({
      data: {
        userId: ctx.user!.id,
        name: data.name,
        phone: data.phone,
        course: data.course,
        branch: branchDisplay,
      },
    });

    await prisma.telegramUser.update({
      where: { id: ctx.user!.id },
      data: { name: data.name, phone: data.phone },
    });

    await ctx.reply(t('enroll.success'), {
      reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
    });

    await notifyAdmins({
      id: application.id,
      name: data.name,
      phone: data.phone,
      course: data.course,
      branch: branchDisplay,
      language: ctx.lang,
    }, ctx);

    ctx.session.step = undefined;
    ctx.session.enrollmentData = undefined;
  } catch (error) {
    console.error('Enrollment error:', error);
    await ctx.reply(t('errors.unknown'));
  }

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}

export async function handleEnrollCancel(ctx: BotContext) {
  ctx.session.step = undefined;
  ctx.session.enrollmentData = undefined;
  await ctx.reply(ctx.t('enroll.cancel_confirm'), {
    reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}
