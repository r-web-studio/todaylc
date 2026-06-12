import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types';
import prisma from '../database/prisma';
import { config } from '../config';
import { t, Language } from '../locales';

function isAdmin(ctx: BotContext): boolean {
  return config.admin.ids.includes(ctx.from?.id ?? 0);
}

function formatApplication(app: {
  id: number; name: string; phone: string; course: string; branch: string; status: string; createdAt: Date;
}, lang: Language): string {
  return [
    `🆔 #${app.id}`,
    `${t('notification.name', lang)}: ${app.name}`,
    `${t('notification.phone', lang)}: ${app.phone}`,
    `${t('notification.course', lang)}: ${app.course}`,
    `${t('notification.branch', lang)}: ${app.branch}`,
    `${t('notification.time', lang)}: ${app.createdAt.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`,
    `📌 ${t('admin.status', lang)}: ${getStatusEmoji(app.status)} ${t(`admin.status_${app.status.toLowerCase()}`, lang)}`,
  ].join('\n');
}

function getStatusEmoji(status: string): string {
  const map: Record<string, string> = { NEW: '🆕', CONTACTED: '📞', ENROLLED: '🎓', REJECTED: '❌' };
  return map[status] || '❓';
}

export async function handleAdminApplications(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;

  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (apps.length === 0) {
      await ctx.reply(t('admin.no_applications', lang));
      return;
    }

    for (const app of apps) {
      const keyboard = new InlineKeyboard()
        .text(`✅ ${t('admin.contacted', lang)}`, `admin_contacted_${app.id}`)
        .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${app.id}`)
        .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${app.id}`);

      await ctx.reply(formatApplication(app, lang), { reply_markup: keyboard });
    }
  } catch (error) {
    console.error('handleAdminApplications error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminNew(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;

  try {
    const apps = await prisma.application.findMany({
      where: { status: 'NEW' },
      orderBy: { createdAt: 'desc' },
    });

    if (apps.length === 0) {
      await ctx.reply(t('admin.no_new', lang));
      return;
    }

    for (const app of apps) {
      const keyboard = new InlineKeyboard()
        .text(`✅ ${t('admin.contacted', lang)}`, `admin_contacted_${app.id}`)
        .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${app.id}`)
        .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${app.id}`);

      await ctx.reply(formatApplication(app, lang), { reply_markup: keyboard });
    }
  } catch (error) {
    console.error('handleAdminNew error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminContacted(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;

  try {
    const apps = await prisma.application.findMany({
      where: { status: 'CONTACTED' },
      orderBy: { createdAt: 'desc' },
    });

    if (apps.length === 0) {
      await ctx.reply(t('admin.no_contacted', lang));
      return;
    }

    for (const app of apps) {
      const keyboard = new InlineKeyboard()
        .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${app.id}`)
        .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${app.id}`);

      await ctx.reply(formatApplication(app, lang), { reply_markup: keyboard });
    }
  } catch (error) {
    console.error('handleAdminContacted error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminEnrolled(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;

  try {
    const apps = await prisma.application.findMany({
      where: { status: 'ENROLLED' },
      orderBy: { createdAt: 'desc' },
    });

    if (apps.length === 0) {
      await ctx.reply(t('admin.no_enrolled', lang));
      return;
    }

    for (const app of apps) {
      await ctx.reply(formatApplication(app, lang));
    }
  } catch (error) {
    console.error('handleAdminEnrolled error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminRejected(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;

  try {
    const apps = await prisma.application.findMany({
      where: { status: 'REJECTED' },
      orderBy: { createdAt: 'desc' },
    });

    if (apps.length === 0) {
      await ctx.reply(t('admin.no_rejected', lang));
      return;
    }

    for (const app of apps) {
      await ctx.reply(formatApplication(app, lang));
    }
  } catch (error) {
    console.error('handleAdminRejected error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminStats(ctx: BotContext) {
  if (!isAdmin(ctx)) return;
  const lang = ctx.lang;
  const tAdmin = (key: string) => t(key, lang);

  try {
    const [total, newCount, contactedCount, enrolledCount, rejectedCount, courses] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'NEW' } }),
      prisma.application.count({ where: { status: 'CONTACTED' } }),
      prisma.application.count({ where: { status: 'ENROLLED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      prisma.application.groupBy({ by: ['course'], _count: true }),
    ]);

    const courseStats = courses
      .map((c) => `  • ${c.course}: ${c._count}`)
      .join('\n');

    const text = [
      `📊 ${tAdmin('admin.statistics')}`,
      '',
      `📝 ${tAdmin('admin.total_applications')}: ${total}`,
      `🆕 ${tAdmin('admin.new_applications')}: ${newCount}`,
      `📞 ${tAdmin('admin.contacted_applications')}: ${contactedCount}`,
      `🎓 ${tAdmin('admin.enrolled_students')}: ${enrolledCount}`,
      `❌ ${tAdmin('admin.rejected_applications')}: ${rejectedCount}`,
      '',
      `📚 ${tAdmin('admin.by_course')}:`,
      courseStats,
    ].join('\n');

    await ctx.reply(text);
  } catch (error) {
    console.error('handleAdminStats error:', error);
    await ctx.reply(t('errors.unknown', lang));
  }
}

export async function handleAdminStatusUpdate(ctx: BotContext, applicationId: number, newStatus: string) {
  if (!isAdmin(ctx)) {
    await ctx.answerCallbackQuery({ text: 'Access denied' });
    return;
  }

  const lang = ctx.lang;

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus as 'NEW' | 'CONTACTED' | 'ENROLLED' | 'REJECTED' },
    });

    const statusEmoji = getStatusEmoji(newStatus);
    const statusText = t(`admin.status_${newStatus.toLowerCase()}`, lang);

    if (ctx.callbackQuery?.message) {
      const originalText = (ctx.callbackQuery.message as any).text || '';
      const updatedText = originalText.includes('📌')
        ? originalText.replace(/📌.*/, `📌 ${t('admin.status', lang)}: ${statusEmoji} ${statusText}`)
        : `${originalText}\n\n📌 ${t('admin.status', lang)}: ${statusEmoji} ${statusText}`;

      await ctx.api.editMessageText(
        ctx.chat!.id,
        ctx.callbackQuery.message.message_id,
        updatedText,
        { reply_markup: new InlineKeyboard().text(`${statusEmoji} ${statusText}`, 'noop') },
      );
    }

    await ctx.answerCallbackQuery({ text: `✅ ${t('admin.status_updated', lang)}: ${statusText}` });
  } catch (error) {
    console.error('Failed to update application status:', error);
    await ctx.answerCallbackQuery({ text: '❌ Error updating status' });
  }
}
