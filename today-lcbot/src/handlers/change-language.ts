import { BotContext } from '../types';
import { getLanguageKeyboard } from '../keyboards';

export async function handleChangeLanguage(ctx: BotContext) {
  await ctx.reply(ctx.t('language_prompt'), {
    reply_markup: getLanguageKeyboard(),
  });
}
