import 'dotenv/config';
import { Bot } from 'grammy';
import { config } from './config';

async function setWebhook() {
  const bot = new Bot(config.bot.token);

  if (!config.bot.webhookUrl) {
    console.error('WEBHOOK_URL is not set in .env');
    process.exit(1);
  }

  const webhookUrl = `${config.bot.webhookUrl.replace(/\/+$/, '')}/webhook`;

  try {
    const info = await bot.api.getWebhookInfo();
    console.log('Current webhook info:', JSON.stringify(info, null, 2));

    await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
    });

    const updatedInfo = await bot.api.getWebhookInfo();
    console.log('Webhook set successfully!');
    console.log('New webhook URL:', updatedInfo.url);

    if (config.admin.ids.length > 0) {
      const adminChatId = config.admin.ids[0];
      await bot.api.sendMessage(
        adminChatId,
        `✅ Webhook configured successfully!\n\nURL: ${webhookUrl}\nPending updates: cleared`,
      ).catch(() => {});
    }
  } catch (error) {
    console.error('Failed to set webhook:', error);
    process.exit(1);
  }
}

setWebhook();
