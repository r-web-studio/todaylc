import { BotContext } from '../types';
import { getContactKeyboard } from '../keyboards';

export async function handleContact(ctx: BotContext) {
  const t = ctx.t;

  const text = [
    `📞 <b>${t('contact.title')}</b>`,
    '',
    t('contact.description'),
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getContactKeyboard(ctx),
  });
}
