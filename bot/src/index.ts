import 'dotenv/config';
import { Bot, session, webhookCallback } from 'grammy';
import express from 'express';
import { BotContext, BotSession } from './types';
import { languageMiddleware } from './middleware/language';
import { handleStart, handleLanguageSelection } from './commands/start';
import { handleMenuSelection, handleCourses, handleCourseDetail, handleCoursesBack } from './handlers/menu';
import { handleEnrollStart, handleEnrollName, handleEnrollPhone, handleEnrollCourse, handleEnrollBranch } from './handlers/enrollment';
import { handleBranches, handleBranchInfo } from './handlers/branches';
import { handleContact } from './handlers/contact';
import { handleSocial } from './handlers/social';
import { handleAbout } from './handlers/about';
import { handleChangeLanguage } from './handlers/change-language';
import { handleAiAssistant, handleAiMessage, handleAiClear } from './ai/assistant';
import { config } from './config';

const bot = new Bot<BotContext>(config.bot.token);

bot.use(session({ initial: (): BotSession => ({}) }));
bot.use(languageMiddleware());

bot.command('start', async (ctx) => {
  await handleStart(ctx);
});

bot.callbackQuery(/^lang_(.+)$/, async (ctx) => {
  const langCode = ctx.match![1];
  await handleLanguageSelection(ctx, langCode);
});

bot.callbackQuery(/^course_(.+)$/, async (ctx) => {
  const courseKey = ctx.match![1];
  await handleCourseDetail(ctx, courseKey);
});

bot.callbackQuery(/^courses_back$/, async (ctx) => {
  await handleCourses(ctx);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^enroll_course_(.+)$/, async (ctx) => {
  const courseKey = ctx.match![1];
  ctx.session.step = 'awaiting_course';
  await handleEnrollCourse(ctx, courseKey);
});

bot.callbackQuery(/^enroll_branch_(.+)$/, async (ctx) => {
  const branch = ctx.match![1];
  await handleEnrollBranch(ctx, branch);
});

bot.callbackQuery(/^branch_info_(.+)$/, async (ctx) => {
  const branch = ctx.match![1];
  await handleBranchInfo(ctx, branch);
});

bot.callbackQuery(/^branch_(.+)$/, async (ctx) => {
  const branch = ctx.match![1];
  await handleBranchInfo(ctx, branch);
});

bot.callbackQuery(/^branches_back$/, async (ctx) => {
  await handleBranches(ctx);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('ai_clear', async (ctx) => {
  await handleAiClear(ctx);
});

bot.hears(/^📚 Courses$|^📚 Курсы$|^📚 Kurslar$/, async (ctx) => {
  await handleCourses(ctx);
});

bot.hears(/^🤖 AI Assistant$|^🤖 AI Помощник$|^🤖 AI Yordamchi$/, async (ctx) => {
  await handleAiAssistant(ctx);
});

bot.hears(/^📝 Enroll$|^📝 Записаться$|^📝 Ro'yxatdan o'tish$/, async (ctx) => {
  await handleEnrollStart(ctx);
});

bot.hears(/^🏫 Branches$|^🏫 Филиалы$|^🏫 Filiallar$/, async (ctx) => {
  await handleBranches(ctx);
});

bot.hears(/^📞 Contact$|^📞 Контакты$|^📞 Kontakt$/, async (ctx) => {
  await handleContact(ctx);
});

bot.hears(/^🌐 Social Media$|^🌐 Соцсети$|^🌐 Ijtimoiy Tarmoqlar$/, async (ctx) => {
  await handleSocial(ctx);
});

bot.hears(/^ℹ️ About Us$|^ℹ️ О Нас$|^ℹ️ Biz Haqimizda$/, async (ctx) => {
  await handleAbout(ctx);
});

bot.hears(/^⚙️ Change Language$|^⚙️ Сменить Язык$|^⚙️ Tilni O'zgartirish$/, async (ctx) => {
  await handleChangeLanguage(ctx);
});

bot.on('message:text', async (ctx) => {
  const step = ctx.session.step;

  if (step === 'awaiting_name') {
    await handleEnrollName(ctx, ctx.message.text);
  } else if (step === 'awaiting_phone') {
    await handleEnrollPhone(ctx, ctx.message.text);
  } else if (ctx.session.aiHistory !== undefined) {
    await handleAiMessage(ctx, ctx.message.text);
  } else {
    await ctx.reply(ctx.t('errors.unknown'));
  }
});

if (config.env === 'production' && config.bot.webhookUrl) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/webhook', webhookCallback(bot, 'express', {
    timeoutMilliseconds: 25000,
  }));

  app.listen(config.bot.port, '0.0.0.0', async () => {
    console.log(`Bot running in webhook mode on 0.0.0.0:${config.bot.port}`);
    try {
      await bot.api.setWebhook(`${config.bot.webhookUrl}/webhook`, {
        drop_pending_updates: true,
      });
      console.log(`Webhook set to ${config.bot.webhookUrl}/webhook`);
    } catch (err) {
      console.error('Failed to set webhook:', err);
    }
  });
} else {
  const port = config.bot.port || 3000;
  const app = express();
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', mode: 'polling', timestamp: new Date().toISOString() });
  });
  app.listen(port, '0.0.0.0', () => {
    console.log(`Health server running on 0.0.0.0:${port} (polling mode)`);
  });
  bot.start({
    onStart: () => {
      console.log('Bot running in polling mode');
    },
    drop_pending_updates: true,
  });
}

export default bot;
