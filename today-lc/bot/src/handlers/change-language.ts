import { BotContext } from '../types';
import { getLanguageKeyboard } from '../keyboards';

export async function handleChangeLanguage(ctx: BotContext) {
  const t = ctx.t;
  await ctx.reply(t('language_prompt'), {
    reply_markup: getLanguageKeyboard(),
  });
}
