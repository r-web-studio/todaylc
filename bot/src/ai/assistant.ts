import { BotContext } from '../types';
import { getAiProvider } from './provider';
import prisma from '../database/prisma';
import { getAiKeyboard } from '../keyboards';

const SYSTEM_PROMPTS: Record<string, string> = {
  uz: `Siz Today Ta'lim Markazining AI yordamchisiz. Sizning vazifangiz:

1. Today Ta'lim Markazi haqidagi savollarga javob berish
2. Kurslar bo'yicha tavsiyalar berish (IELTS, CEFR, Ingliz tili, Rus tili, Tarix, Huquq, Matematika, Fizika, Biologiya, Kimyo, Ona tili va adabiyoti)
3. IELTS va CEFR haqida tushuntirish
4. O'qish bo'yicha maslahatlar berish
5. Filiallar haqida ma'lumot berish (Urganch va Shovot)
6. Tez-tez beriladigan savollarga javob berish

Har doim O'zbek tilida javob bering. Agar savolga javob bera olmasangiz, aytib qo'ying: "Bizning operator ushbu savolga yordam beradi."`,

  ru: `Вы AI помощник Today Ta'lim Markazi. Ваши задачи:

1. Отвечать на вопросы о Today Ta'lim Markazi
2. Рекомендовать подходящие курсы (IELTS, CEFR, Английский, Русский, История, Право, Математика, Физика, Биология, Химия, Родной язык и литература)
3. Объяснять IELTS и CEFR
4. Давать советы по учебе
5. Предоставлять информацию о филиалах (Ургенч и Шовот)
6. Отвечать на часто задаваемые вопросы

Всегда отвечайте на Русском языке. Если вы не можете ответить на вопрос, скажите: "Наш оператор поможет вам с этим вопросом."`,

  en: `You are the AI assistant of Today Ta'lim Markazi. Your tasks:

1. Answer questions about Today Ta'lim Markazi
2. Recommend suitable courses (IELTS, CEFR, English, Russian, History, Law, Mathematics, Physics, Biology, Chemistry, Mother Language and Literature)
3. Explain IELTS and CEFR
4. Provide study advice
5. Explain branch information (Urganch and Shovot)
6. Answer frequently asked questions

Always answer in English. If you cannot answer a question, say: "Our operator will help you with this question."`,
};

export async function handleAiAssistant(ctx: BotContext) {
  const t = ctx.t;
  ctx.session.aiHistory = [];
  await ctx.reply(t('ai.greeting'), {
    reply_markup: getAiKeyboard(ctx),
  });
}

export async function handleAiClear(ctx: BotContext) {
  const t = ctx.t;
  ctx.session.aiHistory = [];
  await ctx.reply(t('ai.clear'), {
    reply_markup: getAiKeyboard(ctx),
  });

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}

export async function handleAiMessage(ctx: BotContext, question: string) {
  const t = ctx.t;
  const lang = ctx.lang;

  if (!ctx.session.aiHistory) {
    ctx.session.aiHistory = [];
  }

  const thinkingMsg = await ctx.reply(t('ai.thinking'));

  try {
    const provider = getAiProvider();
    const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.en;
    const answer = await provider.chat(question, ctx.session.aiHistory, systemPrompt);

    if (!answer) {
      await ctx.api.deleteMessage(thinkingMsg.chat.id, thinkingMsg.message_id).catch(() => {});
      await ctx.reply(t('ai.fallback'), {
        reply_markup: getAiKeyboard(ctx),
      });
      return;
    }

    ctx.session.aiHistory.push({ role: 'user', content: question });
    ctx.session.aiHistory.push({ role: 'assistant', content: answer });

    await ctx.api.deleteMessage(thinkingMsg.chat.id, thinkingMsg.message_id).catch(() => {});

    await ctx.reply(answer, {
      reply_markup: getAiKeyboard(ctx),
    });

    await prisma.message.create({
      data: {
        userId: ctx.user!.id,
        question,
        answer,
      },
    });
  } catch (error) {
    console.error('AI error:', error);
    await ctx.api.deleteMessage(thinkingMsg.chat.id, thinkingMsg.message_id).catch(() => {});
    await ctx.reply(t('ai.error'), {
      reply_markup: getAiKeyboard(ctx),
    });
  }
}
