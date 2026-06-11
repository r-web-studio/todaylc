import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types';
import { getCoursesKeyboard, getCourseDetailKeyboard } from '../keyboards';

const courseKeys = [
  'ielts', 'cefr', 'english', 'russian',
  'history', 'law', 'mathematics', 'physics',
  'biology', 'chemistry', 'mother_language',
] as const;

export async function handleCourses(ctx: BotContext) {
  const t = ctx.t;
  await ctx.reply(t('courses.select'), {
    reply_markup: getCoursesKeyboard(ctx),
  });
}

export async function handleCourseDetail(ctx: BotContext, courseKey: string) {
  const t = ctx.t;
  const name = t(`courses.${courseKey}`);
  const description = t(`courses.descriptions.${courseKey}`);
  const duration = t(`courses.durations.${courseKey}`);
  const audience = t(`courses.audiences.${courseKey}`);

  const text = [
    `📚 <b>${name}</b>`,
    '',
    `<b>${t('courses.detail.description')}:</b> ${description}`,
    `<b>${t('courses.detail.duration')}:</b> ${duration}`,
    `<b>${t('courses.detail.audience')}:</b> ${audience}`,
    `<b>${t('courses.detail.teacher')}:</b> ${t('courses.placeholder_teacher')}`,
    `<b>${t('courses.detail.price')}:</b> ${t('courses.placeholder_price')}`,
    `<b>${t('courses.detail.branches')}:</b> ${t('enroll.branch_urganch')}, ${t('enroll.branch_shovot')}`,
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getCourseDetailKeyboard(ctx, courseKey),
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}

export async function handleCoursesBack(ctx: BotContext) {
  await handleCourses(ctx);
}
