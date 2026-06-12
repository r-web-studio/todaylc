import { BotContext } from '../types';
import { getLanguageKeyboard, getMainMenuKeyboard } from '../keyboards';
import { setUserLanguage } from '../middleware/language';
import { t as tFunc, Language } from '../locales';

export async function handleStart(ctx: BotContext) {
  const isNewUser = !ctx.user?.name;

  if (!ctx.user?.language || isNewUser) {
    await ctx.reply(
      `🌍 ${tFunc('language_prompt', 'uz')} / ${tFunc('language_prompt', 'ru')} / ${tFunc('language_prompt', 'en')}`,
      { reply_markup: getLanguageKeyboard() }
    );
    return;
  }

  await ctx.reply(ctx.t('language_selected'), {
    reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
  });
}

export async function handleLanguageSelection(ctx: BotContext, langCode: string) {
  const telegramId = ctx.from!.id;
  await setUserLanguage(telegramId, langCode);

  const langMap: Record<string, Language> = { uz: 'uz', ru: 'ru', en: 'en' };
  ctx.lang = langMap[langCode] || 'uz';
  ctx.t = (key: string, vars?: Record<string, string | number>) => tFunc(key, ctx.lang, vars);

  await ctx.reply(ctx.t('language_selected'), {
    reply_markup: { keyboard: getMainMenuKeyboard(ctx).keyboard, resize_keyboard: true },
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}
