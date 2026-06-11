import { Context } from 'grammy';
import { User as DbUser } from '@prisma/client';
import { Language } from './locales';

export interface BotSession {
  step?: 'awaiting_name' | 'awaiting_phone' | 'awaiting_course' | 'awaiting_branch';
  enrollmentData?: {
    name?: string;
    phone?: string;
    course?: string;
    branch?: string;
  };
  aiHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface BotContext extends Context {
  session: BotSession;
  user?: DbUser;
  lang: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
}
