import { Middleware, NextFunction } from 'grammy';
import { BotContext } from '../types';
import prisma from '../database/prisma';
import { Language, t, getAvailableLanguages } from '../locales';

export function languageMiddleware(): Middleware<BotContext> {
  return async (ctx: BotContext, next: NextFunction) => {
    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await next();
      return;
    }

    let dbUser = await prisma.telegramUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (!dbUser) {
      dbUser = await prisma.telegramUser.create({
        data: {
          telegramId: BigInt(telegramId),
          username: ctx.from?.username || null,
          language: 'UZ',
        },
      });
    } else {
      const username = ctx.from?.username;
      if (username && username !== dbUser.username) {
        dbUser = await prisma.telegramUser.update({
          where: { id: dbUser.id },
          data: { username },
        });
      }
    }

    const lang = dbUser.language.toLowerCase() as Language;
    ctx.user = {
      id: dbUser.id,
      telegramId: dbUser.telegramId,
      username: dbUser.username,
      name: dbUser.name,
      phone: dbUser.phone,
      language: dbUser.language,
    };
    ctx.lang = lang;
    ctx.t = (key: string, vars?: Record<string, string | number>) => t(key, lang, vars);

    await next();
  };
}

export async function setUserLanguage(telegramId: number, langCode: string): Promise<void> {
  const lang = langCode.toUpperCase() as 'UZ' | 'RU' | 'EN';
  await prisma.telegramUser.update({
    where: { telegramId: BigInt(telegramId) },
    data: { language: lang },
  });
}
