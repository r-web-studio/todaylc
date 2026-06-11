import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types';

export async function handleBranches(ctx: BotContext) {
  const t = ctx.t;
  const keyboard = new InlineKeyboard()
    .text(`🏛 ${t('branches.urganch.name')}`, 'branch_info_urganch')
    .text(`🏛 ${t('branches.shovot.name')}`, 'branch_info_shovot');

  await ctx.reply(t('branches.select'), { reply_markup: keyboard });
}

export async function handleBranchInfo(ctx: BotContext, branch: string) {
  const t = ctx.t;
  const prefix = branch === 'urganch' ? 'branches.urganch' : 'branches.shovot';

  const keyboard = new InlineKeyboard()
    .url(t('branches.urganch.map' as any), `https://maps.google.com/?q=${branch === 'urganch' ? 'Urganch' : 'Shovot'}`)
    .row()
    .text(t('menu.back'), 'branches_back');

  const text = [
    `🏫 <b>${t(`${prefix}.name`)}</b>`,
    '',
    t(`${prefix}.phone`),
    t(`${prefix}.address`),
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}
