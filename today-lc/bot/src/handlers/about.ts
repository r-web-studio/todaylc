import { BotContext } from '../types';

export async function handleAbout(ctx: BotContext) {
  const t = ctx.t;

  const text = [
    `ℹ️ <b>${t('about.title')}</b>`,
    '',
    t('about.description'),
    '',
    `⭐ ${t('about.stats.experience')}`,
    `⭐ ${t('about.stats.students')}`,
    `⭐ ${t('about.stats.test_participants')}`,
    `⭐ ${t('about.stats.success_rate')}`,
    `⭐ ${t('about.stats.branches')}`,
    '',
    `<b>${t('about.sovrin_title')}</b>`,
    '',
    t('about.sovrin_description'),
  ].join('\n');

  await ctx.reply(text, { parse_mode: 'HTML' });
}
