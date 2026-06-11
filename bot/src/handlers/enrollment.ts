import { BotContext } from '../types';
import { getEnrollCourseKeyboard, getBranchKeyboard } from '../keyboards';
import prisma from '../database/prisma';
import { notifyAdmins } from '../services/notification';

export async function handleEnrollStart(ctx: BotContext) {
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
}

export async function handleEnrollBranch(ctx: BotContext, branch: string) {
  const t = ctx.t;
  const data = ctx.session.enrollmentData;
  if (!data?.name || !data?.phone || !data?.course) return;

  try {
    await prisma.application.create({
      data: {
        userId: ctx.user!.id,
        name: data.name,
        phone: data.phone,
        course: data.course,
        branch: branch === 'URGANCH' ? t('enroll.branch_urganch') : t('enroll.branch_shovot'),
        status: 'PENDING',
      },
    });

    await prisma.user.update({
      where: { id: ctx.user!.id },
      data: { name: data.name, phone: data.phone },
    });

    await ctx.reply(t('enroll.success'), {
      reply_markup: {
        keyboard: (await import('../keyboards')).getMainMenuKeyboard(ctx).keyboard,
        resize_keyboard: true,
      },
    });

    await notifyAdmins({
      name: data.name,
      phone: data.phone,
      course: data.course,
      branch: branch === 'URGANCH' ? t('enroll.branch_urganch') : t('enroll.branch_shovot'),
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
