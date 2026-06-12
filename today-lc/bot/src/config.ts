import dotenv from 'dotenv';
dotenv.config();

export const config = {
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.WEBHOOK_URL || '',
    port: parseInt(process.env.PORT || '8443', 10),
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  admin: {
    ids: (process.env.ADMIN_IDS || '').split(',').filter(Boolean).map(Number),
  },
  ai: {
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
  },
  env: process.env.NODE_ENV || 'development',
};

if (!config.bot.token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

if (!config.database.url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}
