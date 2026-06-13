const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { setWebhook } = require('./src/lib/bot.cjs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, async () => {
    console.log(`> Ready on http://${hostname}:${port}`);

    // Initialize Telegram Bot Webhook after server is live
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        const webhookUrl = process.env.WEBHOOK_URL || `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/api/bot`;
        const result = await setWebhook(webhookUrl);
        if (result.ok) {
          console.log(`> Telegram webhook set to: ${webhookUrl}`);
        } else {
          console.error('> Failed to set Telegram webhook:', result.description);
        }
      } catch (err) {
        console.error('> Error setting Telegram webhook:', err);
      }
    } else {
      console.warn('> TELEGRAM_BOT_TOKEN not set, skipping webhook setup');
    }
  });
});