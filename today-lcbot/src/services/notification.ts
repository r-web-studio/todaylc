import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types';
import { config } from '../config';
import { t, Language } from '../locales';

interface ApplicationData {
  id: number;
  name: string;
  phone: string;
  course: string;
  branch: string;
  language: string;
}

interface AiTransferData {
  userId: number;
  username?: string;
  message: string;
  language: string;
}

export async function notifyAdmins(data: ApplicationData, ctx: BotContext): Promise<void> {
  const adminIds = config.admin.ids;
  if (adminIds.length === 0) return;

  const now = new Date().toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
  });

  const lang = data.language as Language;

  const text = [
    `📥 ${t('notification.new_application', lang)}`,
    '',
    `${t('notification.name', lang)}: ${data.name}`,
    `${t('notification.phone', lang)}: ${data.phone}`,
    `${t('notification.course', lang)}: ${data.course}`,
    `${t('notification.branch', lang)}: ${data.branch}`,
    `${t('notification.time', lang)}: ${now}`,
    `${t('notification.language', lang)}: ${data.language.toUpperCase()}`,
  ].join('\n');

  const keyboard = new InlineKeyboard()
    .text(`✅ ${t('admin.contacted', lang)}`, `admin_contacted_${data.id}`)
    .text(`🎓 ${t('admin.enrolled', lang)}`, `admin_enrolled_${data.id}`)
    .text(`❌ ${t('admin.rejected', lang)}`, `admin_rejected_${data.id}`);

  for (const adminId of adminIds) {
    try {
      await ctx.api.sendMessage(adminId, text, { reply_markup: keyboard });
    } catch (error) {
      console.error(`Failed to notify admin ${adminId}:`, error);
    }
  }
}

export async function notifyAdminsAiTransfer(data: AiTransferData, ctx: BotContext): Promise<void> {
  const adminIds = config.admin.ids;
  if (adminIds.length === 0) return;

  const lang = data.language as Language;

  const text = [
    `🔄 ${t('admin.ai_transfer', lang)}`,
    '',
    `${t('admin.ai_user_message', lang, { message: data.message })}`,
    data.username ? `👤 @${data.username}` : '',
    `🌍 ${lang.toUpperCase()}`,
  ].filter(Boolean).join('\n');

  for (const adminId of adminIds) {
    try {
      await ctx.api.sendMessage(adminId, text);
    } catch (error) {
      console.error(`Failed to notify admin ${adminId}:`, error);
    }
  }
}
