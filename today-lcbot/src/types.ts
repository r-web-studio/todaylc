import { Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import { Language } from './locales';

export type Prisma = PrismaClient;

export interface BotSession {
  step?: 'awaiting_name' | 'awaiting_phone' | 'awaiting_course' | 'awaiting_branch';
  enrollmentData?: {
    name?: string;
    phone?: string;
    course?: string;
    courseKey?: string;
    branch?: string;
  };
  aiHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface BotContext extends Context {
  session: BotSession;
  user?: {
    id: number;
    telegramId: bigint;
    username: string | null;
    name: string | null;
    phone: string | null;
    language: string;
  };
  lang: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export interface CourseInfo {
  id: string;
  title: string;
  icon: string;
  description: string;
  longDescription: string;
  highlights: string[];
  price: string;
  duration: string;
}
