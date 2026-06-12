import { BotContext } from '../types';
import { getLanguageKeyboard, getMainMenuKeyboard, getDeepLinkKeyboard } from '../keyboards';
import { setUserLanguage } from '../middleware/language';
import { t as tFunc, Language } from '../locales';
import { DEEP_LINK_MAP, getCourseInfo } from '../courses';

export async function handleStart(ctx: BotContext) {
  const isNewUser = !ctx.user?.name;
  const startPayload = ctx.match?.[1]?.trim();

  if (startPayload && startPayload in DEEP_LINK_MAP) {
    await handleDeepLink(ctx, startPayload);
    return;
  }

  if (!ctx.user?.language || isNewUser) {
    await ctx.reply(
      `🌍 ${tFunc('language_prompt', 'uz')} / ${tFunc('language_prompt', 'ru')} / ${tFunc('language_prompt', 'en')}`,
      { reply_markup: getLanguageKeyboard() }
    );
    return;
  }

  await ctx.reply(ctx.t('welcome_message'), {
    parse_mode: 'HTML',
    reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
  });
}

async function handleDeepLink(ctx: BotContext, payload: string) {
  const courseKey = DEEP_LINK_MAP[payload];
  if (!courseKey) {
    await ctx.reply(ctx.t('errors.not_found'));
    return;
  }

  const isNewUser = !ctx.user?.name;

  if (isNewUser || !ctx.user?.name) {
    await ctx.reply(
      `🌍 ${tFunc('language_prompt', 'uz')} / ${tFunc('language_prompt', 'ru')} / ${tFunc('language_prompt', 'en')}`,
      {
        reply_markup: getLanguageKeyboard(),
      }
    );
    return;
  }

  const course = getCourseInfo(courseKey, ctx.lang, ctx.t);
  const highlightsList = course.highlights.map((h: string) => `✅ ${h}`).join('\n');

  const text = ctx.t('deep_link_course', {
    course: `${course.icon} ${course.title}`,
    description: course.description,
    price: course.price,
    duration: course.duration,
    highlights: highlightsList,
  });

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getDeepLinkKeyboard(ctx, courseKey),
  });
}

export async function handleLanguageSelection(ctx: BotContext, langCode: string) {
  const telegramId = ctx.from!.id;
  await setUserLanguage(telegramId, langCode);

  const langMap: Record<string, Language> = { uz: 'uz', ru: 'ru', en: 'en' };
  ctx.lang = langMap[langCode] || 'uz';
  ctx.t = (key: string, vars?: Record<string, string | number>) => tFunc(key, ctx.lang, vars);

  await ctx.reply(ctx.t('welcome_message'), {
    parse_mode: 'HTML',
    reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}
