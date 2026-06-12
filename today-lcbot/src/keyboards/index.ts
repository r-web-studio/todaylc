import { Keyboard, InlineKeyboard } from 'grammy';
import { BotContext } from '../types';
import { COURSE_KEYS } from '../courses';
import { t, Language } from '../locales';

export function getLanguageKeyboard() {
  return new InlineKeyboard()
    .text("🇺🇿 O'zbekcha", 'lang_uz')
    .text('🇷🇺 Русский', 'lang_ru')
    .text('🇬🇧 English', 'lang_en');
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
  const inlineKeyboard = new InlineKeyboard();
  for (let i = 0; i < COURSE_KEYS.length; i += 2) {
    const row: ReturnType<typeof InlineKeyboard.text>[] = [];
    row.push(InlineKeyboard.text(t(`courses.${COURSE_KEYS[i]}`), `course_${COURSE_KEYS[i]}`));
    if (COURSE_KEYS[i + 1]) {
      row.push(InlineKeyboard.text(t(`courses.${COURSE_KEYS[i + 1]}`), `course_${COURSE_KEYS[i + 1]}`));
    }
    inlineKeyboard.row(...row);
  }
  return inlineKeyboard;
}

export function getEnrollCourseKeyboard(ctx: BotContext) {
  const t = ctx.t;
  const inlineKeyboard = new InlineKeyboard();
  for (let i = 0; i < COURSE_KEYS.length; i += 2) {
    const row: ReturnType<typeof InlineKeyboard.text>[] = [];
    row.push(InlineKeyboard.text(t(`courses.${COURSE_KEYS[i]}`), `enroll_course_${COURSE_KEYS[i]}`));
    if (COURSE_KEYS[i + 1]) {
      row.push(InlineKeyboard.text(t(`courses.${COURSE_KEYS[i + 1]}`), `enroll_course_${COURSE_KEYS[i + 1]}`));
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
    .text(t('ai.clear_button'), 'ai_clear')
    .row()
    .text(t('ai.transfer_button'), 'ai_transfer');
}

export function getApplicationStatusKeyboard(applicationId: number, lang: Language) {
  return new InlineKeyboard()
    .text(`✅ ${t('admin.contacted', lang)}`, `admin_contacted_${applicationId}`)
    .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${applicationId}`)
    .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${applicationId}`);
}

export function getDeepLinkKeyboard(ctx: BotContext, courseKey: string) {
  const t = ctx.t;
  return new InlineKeyboard()
    .text(t('courses.enroll_button'), `enroll_course_${courseKey}`)
    .text(t('menu.courses'), 'courses_list');
}
