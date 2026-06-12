import 'dotenv/config';

export const config = {
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.WEBHOOK_URL || '',
    port: parseInt(process.env.PORT || '8443', 10),
  },
  admin: {
    ids: (process.env.ADMIN_IDS || '').split(',').filter(Boolean).map(Number),
  },
  env: process.env.NODE_ENV || 'development',
};

if (!config.bot.token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}
