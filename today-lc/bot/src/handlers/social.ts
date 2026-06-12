import { BotContext } from '../types';
import { getSocialKeyboard } from '../keyboards';

export async function handleSocial(ctx: BotContext) {
  const t = ctx.t;

  const text = [
    `🌐 <b>${t('social.title')}</b>`,
    '',
    t('social.description'),
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getSocialKeyboard(),
  });
}
