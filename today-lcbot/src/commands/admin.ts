import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types';
import prisma from '../database/prisma';
import { config } from '../config';
import { t, Language } from '../locales';
import { getApplicationStatusKeyboard } from '../keyboards';

function isAdmin(ctx: BotContext): boolean {
  return config.admin.ids.includes(ctx.from?.id ?? 0);
}

function assertAdmin(ctx: BotContext): void {
  if (!isAdmin(ctx)) {
    throw new Error('FORBIDDEN');
  }
}

function getStatusEmoji(status: string): string {
  const map: Record<string, string> = { NEW: '🆕', CONTACTED: '📞', ENROLLED: '🎓', REJECTED: '❌' };
  return map[status] || '❓';
}

function formatApplication(app: {
  id: number; name: string; phone: string; course: string; branch: string; status: string; createdAt: Date;
}, lang: Language): string {
  const now = new Date(app.createdAt);
  const timeStr = now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
  return [
    `🆔 #${app.id}`,
    `${t('notification.name', lang)}: ${app.name}`,
    `${t('notification.phone', lang)}: ${app.phone}`,
    `${t('notification.course', lang)}: ${app.course}`,
    `${t('notification.branch', lang)}: ${app.branch}`,
    `${t('notification.time', lang)}: ${timeStr}`,
    `📌 ${t('admin.status', lang)}: ${getStatusEmoji(app.status)} ${t(`admin.status_${app.status.toLowerCase()}`, lang)}`,
  ].join('\n');
}

export async function handleAdminApplications(ctx: BotContext) {
  try {
    assertAdmin(ctx);
  } catch {
    return;
  }
  const lang = ctx.lang;

  const apps = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  if (apps.length === 0) {
    await ctx.reply(t('admin.no_applications', lang));
    return;
  }

  await ctx.reply(t('admin.applications_list', lang, { status: t('admin.status_new', lang) }));

  for (const app of apps) {
    await ctx.reply(formatApplication(app, lang), {
      reply_markup: getApplicationStatusKeyboard(app.id, lang),
    });
  }
}

async function listApplicationsByStatus(ctx: BotContext, status: string) {
  try {
    assertAdmin(ctx);
  } catch {
    return;
  }
  const lang = ctx.lang;

  const apps = await prisma.application.findMany({
    where: { status: status as any },
    orderBy: { createdAt: 'desc' },
  });

  const statusKey = `admin.no_${status.toLowerCase()}`;
  const statusLabel = t(`admin.status_${status.toLowerCase()}`, lang);

  if (apps.length === 0) {
    await ctx.reply(t(statusKey, lang));
    return;
  }

  await ctx.reply(t('admin.applications_list', lang, { status: statusLabel }));

  for (const app of apps) {
    const keyboard = status === 'NEW'
      ? getApplicationStatusKeyboard(app.id, lang)
      : status === 'CONTACTED'
        ? new InlineKeyboard()
            .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${app.id}`)
            .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${app.id}`)
        : undefined;

    await ctx.reply(formatApplication(app, lang), {
      reply_markup: keyboard,
    });
  }
}

export async function handleAdminNew(ctx: BotContext) {
  await listApplicationsByStatus(ctx, 'NEW');
}

export async function handleAdminContacted(ctx: BotContext) {
  await listApplicationsByStatus(ctx, 'CONTACTED');
}

export async function handleAdminEnrolled(ctx: BotContext) {
  await listApplicationsByStatus(ctx, 'ENROLLED');
}

export async function handleAdminRejected(ctx: BotContext) {
  await listApplicationsByStatus(ctx, 'REJECTED');
}

export async function handleAdminStats(ctx: BotContext) {
  try {
    assertAdmin(ctx);
  } catch {
    return;
  }
  const lang = ctx.lang;
  const tAdmin = (key: string) => t(key, lang);

  const total = await prisma.application.count();
  const newCount = await prisma.application.count({ where: { status: 'NEW' } });
  const contactedCount = await prisma.application.count({ where: { status: 'CONTACTED' } });
  const enrolledCount = await prisma.application.count({ where: { status: 'ENROLLED' } });
  const rejectedCount = await prisma.application.count({ where: { status: 'REJECTED' } });

  const byCourse = await prisma.application.groupBy({
    by: ['course'],
    _count: true,
    orderBy: { _count: { id: 'desc' } },
  });

  const byBranch = await prisma.application.groupBy({
    by: ['branch'],
    _count: true,
  });

  const courseStats = byCourse
    .map((c) => `  • ${c.course}: ${c._count}`)
    .join('\n');

  const branchStats = byBranch
    .map((b) => `  • ${b.branch}: ${b._count}`)
    .join('\n');

  const text = [
    `📊 <b>${tAdmin('admin.statistics')}</b>`,
    '',
    `📝 ${tAdmin('admin.total_applications')}: <b>${total}</b>`,
    `🆕 ${tAdmin('admin.new_applications')}: <b>${newCount}</b>`,
    `📞 ${tAdmin('admin.contacted_applications')}: <b>${contactedCount}</b>`,
    `🎓 ${tAdmin('admin.enrolled_students')}: <b>${enrolledCount}</b>`,
    `❌ ${tAdmin('admin.rejected_applications')}: <b>${rejectedCount}</b>`,
    '',
    `📚 <b>${tAdmin('admin.by_course')}:</b>`,
    courseStats || '  —',
    '',
    `🏫 <b>${tAdmin('admin.by_branch')}:</b>`,
    branchStats || '  —',
  ].join('\n');

  await ctx.reply(text, { parse_mode: 'HTML' });
}

export async function handleAdminStatusUpdate(ctx: BotContext, applicationId: number, newStatus: string) {
  try {
    assertAdmin(ctx);
  } catch {
    await ctx.answerCallbackQuery({ text: 'Access denied' });
    return;
  }

  const lang = ctx.lang;

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus as any },
    });

    const statusEmoji = getStatusEmoji(newStatus);
    const statusText = t(`admin.status_${newStatus.toLowerCase()}`, lang);

    if (ctx.callbackQuery?.message) {
      const originalText = 'text' in ctx.callbackQuery.message
        ? (ctx.callbackQuery.message as any).text || ''
        : '';

      const updatedText = originalText.includes('📌')
        ? originalText.replace(/📌.*/, `📌 ${t('admin.status', lang)}: ${statusEmoji} ${statusText}`)
        : `${originalText}\n\n📌 ${t('admin.status', lang)}: ${statusEmoji} ${statusText}`;

      await ctx.api.editMessageText(
        ctx.chat!.id,
        ctx.callbackQuery.message.message_id,
        updatedText,
        {
          reply_markup: new InlineKeyboard().text(`${statusEmoji} ${statusText}`, 'noop'),
        },
      );
    }

    await ctx.answerCallbackQuery({ text: `✅ ${t('admin.status_updated', lang)}: ${statusText}` });
  } catch (error) {
    console.error('Failed to update application status:', error);
    await ctx.answerCallbackQuery({ text: '❌ Error updating status' });
  }
}
