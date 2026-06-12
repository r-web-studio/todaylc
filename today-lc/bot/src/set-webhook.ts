import 'dotenv/config';
import { config } from './config';

async function setWebhook() {
  const { Bot } = await import('grammy');
  const bot = new Bot(config.bot.token);

  const webhookUrl = config.bot.webhookUrl;
  if (!webhookUrl) {
    console.error('WEBHOOK_URL is not set');
    process.exit(1);
  }

  try {
    const result = await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
    });
    console.log('Webhook set:', result);
    const info = await bot.api.getWebhookInfo();
    console.log('Webhook info:', info);
  } catch (error) {
    console.error('Failed to set webhook:', error);
    process.exit(1);
  }
}

setWebhook();
