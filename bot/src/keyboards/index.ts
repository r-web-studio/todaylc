import { Keyboard, InlineKeyboard } from 'grammy';
import { BotContext } from '../types';

export function getLanguageKeyboard() {
  const keyboard = new InlineKeyboard()
    .text("🇺🇿 O'zbekcha", 'lang_uz')
    .text('🇷🇺 Русский', 'lang_ru')
    .text('🇬🇧 English', 'lang_en');
  return keyboard;
}

export function getMainMenuKeyboard(ctx: BotContext) {
  const t = ctx.t;
  return new Keyboard()
    .text(t('menu.courses')).text(t('menu.ai_assistant')).row()
    .text(t('menu.enroll')).text(t('menu.branches')).row()
    .text(t('menu.contact')).text(t('menu.social')).row()
    .text(t('menu.about')).text(t('menu.change_language')).resized();
}

export function getCoursesKeyboard(ctx: BotContext) {
  const t = ctx.t;
  const courseKeys = [
    'ielts', 'cefr', 'english', 'russian',
    'history', 'law', 'mathematics', 'physics',
    'biology', 'chemistry', 'mother_language',
  ] as const;

  const inlineKeyboard = new InlineKeyboard();
  for (let i = 0; i < courseKeys.length; i += 2) {
    const row = [];
    row.push(InlineKeyboard.text(t(`courses.${courseKeys[i]}`), `course_${courseKeys[i]}`));
    if (courseKeys[i + 1]) {
      row.push(InlineKeyboard.text(t(`courses.${courseKeys[i + 1]}`), `course_${courseKeys[i + 1]}`));
    }
    inlineKeyboard.row(...row);
  }
  return inlineKeyboard;
}

export function getEnrollCourseKeyboard(ctx: BotContext) {
  const t = ctx.t;
  const courseKeys = [
    'ielts', 'cefr', 'english', 'russian',
    'history', 'law', 'mathematics', 'physics',
    'biology', 'chemistry', 'mother_language',
  ] as const;

  const inlineKeyboard = new InlineKeyboard();
  for (let i = 0; i < courseKeys.length; i += 2) {
    const row = [];
    row.push(InlineKeyboard.text(t(`courses.${courseKeys[i]}`), `enroll_course_${courseKeys[i]}`));
    if (courseKeys[i + 1]) {
      row.push(InlineKeyboard.text(t(`courses.${courseKeys[i + 1]}`), `enroll_course_${courseKeys[i + 1]}`));
    }
    inlineKeyboard.row(...row);
  }
  return inlineKeyboard;
}

export function getBranchKeyboard(ctx: BotContext) {
  const t = ctx.t;
  return new InlineKeyboard()
    .text(`🏛 ${t('enroll.branch_urganch')}`, 'enroll_branch_URGANCH')
    .text(`🏛 ${t('enroll.branch_shovot')}`, 'enroll_branch_SHOVOT');
}

export function getBranchInfoKeyboard(ctx: BotContext) {
  const t = ctx.t;
  return new InlineKeyboard()
    .text(t('branches.urganch.name'), 'branch_urganch')
    .text(t('branches.shovot.name'), 'branch_shovot');
}

export function getCourseDetailKeyboard(ctx: BotContext, courseKey: string) {
  const t = ctx.t;
  return new InlineKeyboard()
    .text(t('courses.enroll_button'), `enroll_course_${courseKey}`)
    .text(t('menu.back'), 'courses_back');
}

export function getContactKeyboard(ctx: BotContext) {
  const t = ctx.t;
  return new InlineKeyboard()
    .url(t('contact.phone'), 'tel:+998952230065')
    .url(t('contact.telegram'), 'https://t.me/today_talim_markazi')
    .row()
    .url(t('contact.instagram'), 'https://instagram.com/today_talim_markazi')
    .url(t('contact.website'), 'https://testtoday.uz')
    .row()
    .url(t('contact.location'), 'https://maps.google.com/?q=Urganch');
}

export function getSocialKeyboard() {
  return new InlineKeyboard()
    .url('📢 Telegram', 'https://t.me/today_talim_markazi')
    .url('📸 Instagram', 'https://instagram.com/today_talim_markazi')
    .row()
    .url('🌐 testtoday.uz', 'https://testtoday.uz');
}

export function getAiKeyboard(ctx: BotContext) {
  const t = ctx.t;
  return new InlineKeyboard()
    .text(t('ai.clear_button'), 'ai_clear');
}
