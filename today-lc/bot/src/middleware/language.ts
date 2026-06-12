import { Context, Middleware, NextFunction } from 'grammy';
import prisma from '../database/prisma';
import { BotContext } from '../types';
import { Language, t, getAvailableLanguages } from '../locales';

export function languageMiddleware(): Middleware<BotContext> {
  return async (ctx: BotContext, next: NextFunction) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await next();
      return;
    }

    try {
      let dbUser = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            telegramId: BigInt(telegramId),
            username: ctx.from?.username || null,
            language: 'UZ',
          },
        });
      } else {
        const username = ctx.from?.username;
        if (username && username !== dbUser.username) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { username },
          });
        }
      }

      const lang = dbUser.language.toLowerCase() as Language;
      ctx.user = dbUser;
      ctx.lang = lang;
      ctx.t = (key: string, vars?: Record<string, string | number>) => t(key, lang, vars);
    } catch (error) {
      console.error('Language middleware error:', error);
      ctx.t = (key: string, vars?: Record<string, string | number>) => t(key, 'uz', vars);
      ctx.lang = 'uz';
    }

    await next();
  };
}

export async function setUserLanguage(telegramId: number, langCode: string): Promise<void> {
  const lang = langCode.toUpperCase() as 'UZ' | 'RU' | 'EN';
  await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { language: lang },
  });
}
