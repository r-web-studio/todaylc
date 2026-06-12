import { BotContext } from '../types';
import prisma from '../database/prisma';
import { getAiKeyboard } from '../keyboards';
import { config } from '../config';
import { notifyAdminsAiTransfer } from '../services/notification';

interface IntentMatch {
  confidence: number;
  responseKey: string;
  responseVars?: Record<string, string>;
}

const INTENT_PATTERNS: Record<string, { keywords: string[]; responses: Record<string, string> }> = {
  greeting: {
    keywords: ['salom', 'assalom', 'hello', 'hi', 'hey', 'привет', 'здравствуй', 'alo'],
    responses: {
      uz: "Assalomu alaykum! Men Today Ta'lim Markazining AI yordamchisiman. Sizga qanday yordam bera olaman?",
      ru: 'Здравствуйте! Я AI помощник Today Ta\'lim Markazi. Чем я могу вам помочь?',
      en: 'Hello! I am the AI assistant of Today Ta\'lim Markazi. How can I help you?',
    },
  },
  ielts: {
    keywords: ['ielts', 'aylts', 'айлтс', 'band', '7.0', 'imtihon'],
    responses: {
      uz: "IELTS — xalqaro ingliz tili imtihoni. Bizning markazimizda IELTS ga tayyorgarlik kurslari mavjud:\n\n📚 Kurs davomiyligi: 3-6 oy\n💰 Narxi: 550 000 UZS/oy\n\nKursda listening, reading, writing va speaking ko'nikmalari bo'yicha intensiv mashg'ulotlar o'tkaziladi. Tajribali ustozlar bilan haftada 4 marta dars.\n\nRo'yxatdan o'tish uchun 📝 Ro'yxatdan o'tish bo'limidan foydalaning.",
      ru: "IELTS — международный экзамен по английскому языку. В нашем центре есть курсы подготовки к IELTS:\n\n📚 Длительность: 3-6 месяцев\n💰 Цена: 550 000 UZS/мес\n\nИнтенсивные занятия по всем 4 навыкам: listening, reading, writing, speaking. Занятия 4 раза в неделю.\n\nДля записи используйте раздел 📝 Записаться.",
      en: "IELTS — International English Language Testing System. We offer IELTS preparation courses:\n\n📚 Duration: 3-6 months\n💰 Price: 550 000 UZS/month\n\nIntensive training in all 4 skills: listening, reading, writing, speaking. Classes 4 times a week.\n\nTo enroll, use the 📝 Enroll section.",
    },
  },
  cefr: {
    keywords: ['cefr', 'sefr', 'sef', 'sertifikat', 'daraja', 'a1', 'a2', 'b1', 'b2', 'c1'],
    responses: {
      uz: "CEFR — umumyevropa til darajalari tizimi. Biz CEFR standarti bo'yicha ingliz tili kurslarini taklif qilamiz:\n\n📚 Davomiyligi: 4-8 oy\n💰 Narxi: 350 000 UZS/oy\n\nA1 dan C1 darajasigacha bosqichma-bosqich ta'lim. Xalqaro sertifikat olish imkoniyati.\n\nRo'yxatdan o'tish uchun 📝 Ro'yxatdan o'tish bo'limidan foydalaning.",
      ru: "CEFR — общеевропейская система уровней владения языком. Мы предлагаем курсы английского по стандарту CEFR:\n\n📚 Длительность: 4-8 месяцев\n💰 Цена: 350 000 UZS/мес\n\nПоэтапное обучение от A1 до C1. Возможность получения международного сертификата.\n\nДля записи используйте раздел 📝 Записаться.",
      en: "CEFR — Common European Framework of Reference for Languages. We offer English courses following the CEFR standard:\n\n📚 Duration: 4-8 months\n💰 Price: 350 000 UZS/month\n\nStep-by-step learning from A1 to C1 level. International certification opportunity.\n\nTo enroll, use the 📝 Enroll section.",
    },
  },
  courses_question: {
    keywords: ['qanday kurs', 'kanday kurs', 'какие курсы', 'what courses', 'qanday fan', 'kurslar haqida', 'fanlar'],
    responses: {
      uz: "Bizda quyidagi kurslar mavjud:\n\n🌍 IELTS — Xalqaro ingliz tili imtihoniga tayyorgarlik\n📋 CEFR — Ingliz tili darajasini oshirish\n🇬🇧 Ingliz tili — Boshlang'ichdan yuqori darajagacha\n🇷🇺 Rus tili — Rus tilini o'rganish\n📖 Tarix — DTM va olimpiada tayyorgarlik\n⚖️ Huquq — Huquqiy bilimlar\n➕ Matematika — Mantiq va hisob\n⚗️ Fizika — Nazariya va masala yechish\n🧬 Biologiya — DTM tayyorgarlik\n🧪 Kimyo — Amaliy va nazariy kurs\n📖 Ona tili va adabiyoti\n\nBatafsil ma'lumot uchun 📚 Kurslar bo'limiga o'ting.",
      ru: "У нас есть следующие курсы:\n\n🌍 IELTS\n📋 CEFR\n🇬🇧 Английский язык\n🇷🇺 Русский язык\n📖 История\n⚖️ Право\n➕ Математика\n⚗️ Физика\n🧬 Биология\n🧪 Химия\n📖 Родной язык и литература\n\nПодробнее в разделе 📚 Курсы.",
      en: "We offer the following courses:\n\n🌍 IELTS\n📋 CEFR\n🇬🇧 English\n🇷🇺 Russian\n📖 History\n⚖️ Law\n➕ Mathematics\n⚗️ Physics\n🧬 Biology\n🧪 Chemistry\n📖 Mother Language and Literature\n\nFor details, go to 📚 Courses section.",
    },
  },
  price: {
    keywords: ['narxi', 'narh', 'price', 'цена', 'сколько', 'qancha', 'baho', 'sum', 'uzs', 'пули'],
    responses: {
      uz: "Kurslarimiz narxlari:\n\n🌍 IELTS: 550 000 UZS/oy\n📋 CEFR: 350 000 UZS/oy\n🇬🇧 Ingliz tili: 350 000 UZS/oy\n🇷🇺 Rus tili: 350 000 UZS/oy\n📖 Tarix: 350 000 UZS/oy\n⚖️ Huquq: 350 000 UZS/oy\n➕ Matematika: 350 000 UZS/oy\n⚗️ Fizika: 350 000 UZS/oy\n🧬 Biologiya: 350 000 UZS/oy\n🧪 Kimyo: 350 000 UZS/oy\n📖 Ona tili va adabiyoti: 350 000 UZS/oy\n\nBatafsil ma'lumot uchun 📚 Kurslar bo'limiga o'ting.",
      ru: "Цены на курсы:\n\n🌍 IELTS: 550 000 UZS/мес\n📋 CEFR: 350 000 UZS/мес\n🇬🇧 Английский: 350 000 UZS/мес\n🇷🇺 Русский: 350 000 UZS/мес\n📖 История: 350 000 UZS/мес\n⚖️ Право: 350 000 UZS/мес\n➕ Математика: 350 000 UZS/мес\n⚗️ Физика: 350 000 UZS/мес\n🧬 Биология: 350 000 UZS/мес\n🧪 Химия: 350 000 UZS/мес\n📖 Родной язык: 350 000 UZS/мес\n\nПодробнее в разделе 📚 Курсы.",
      en: "Course prices:\n\n🌍 IELTS: 550 000 UZS/month\n📋 CEFR: 350 000 UZS/month\n🇬🇧 English: 350 000 UZS/month\n🇷🇺 Russian: 350 000 UZS/month\n📖 History: 350 000 UZS/month\n⚖️ Law: 350 000 UZS/month\n➕ Mathematics: 350 000 UZS/month\n⚗️ Physics: 350 000 UZS/month\n🧬 Biology: 350 000 UZS/month\n🧪 Chemistry: 350 000 UZS/month\n📖 Mother Language: 350 000 UZS/month\n\nFor details, go to 📚 Courses section.",
    },
  },
  branches_question: {
    keywords: ['filial', 'manzil', 'филиал', 'адрес', 'branch', 'address', 'qayerda', 'где', 'urganch', 'shovot', 'ургенч', 'shovot'],
    responses: {
      uz: "Bizning filiallarimiz:\n\n🏫 Urganch filiali\n📞 +998 95 223-00-65\n📍 Urganch shahri\n\n🏫 Shovot filiali\n📞 +998 97 299-00-65\n📍 Shovot tumani\n\nBatafsil ma'lumot uchun 🏫 Filiallar bo'limiga o'ting.",
      ru: "Наши филиалы:\n\n🏫 Ургенчский филиал\n📞 +998 95 223-00-65\n📍 Город Ургенч\n\n🏫 Шовотский филиал\n📞 +998 97 299-00-65\n📍 Шовотский район\n\nПодробнее в разделе 🏫 Филиалы.",
      en: "Our branches:\n\n🏫 Urganch Branch\n📞 +998 95 223-00-65\n📍 Urganch city\n\n🏫 Shovot Branch\n📞 +998 97 299-00-65\n📍 Shovot district\n\nFor details, go to 🏫 Branches section.",
    },
  },
  contact_question: {
    keywords: ['aloqa', 'contact', 'связь', 'telefon', 'телефон', 'phone', 'номер', 'raqam', 'murojat'],
    responses: {
      uz: "Biz bilan bog'lanish:\n\n📞 Telefon: +998 95 223-00-65\n💬 Telegram: @today_talim_markazi\n📸 Instagram: @today_talim_markazi\n🌐 Veb-sayt: testtoday.uz\n\nBatafsil 📞 Kontakt bo'limida.",
      ru: "Свяжитесь с нами:\n\n📞 Телефон: +998 95 223-00-65\n💬 Telegram: @today_talim_markazi\n📸 Instagram: @today_talim_markazi\n🌐 Сайт: testtoday.uz\n\nПодробнее в разделе 📞 Контакты.",
      en: "Contact us:\n\n📞 Phone: +998 95 223-00-65\n💬 Telegram: @today_talim_markazi\n📸 Instagram: @today_talim_markazi\n🌐 Website: testtoday.uz\n\nFor details, go to 📞 Contact section.",
    },
  },
  study_advice: {
    keywords: ['maslahat', 'совет', 'advice', 'tavsiya', 'qanday', 'как', 'how to', 'o\'rganish', 'study', 'учиться', 'tayyorla'],
    responses: {
      uz: "O'qish bo'yicha maslahatlar:\n\n📌 Muntazam ravishda kuniga kamida 1 soat o'qishga vaqt ajrating\n📌 Ingliz tilida kino va seriallar tomosha qiling\n📌 Kuniga 10-15 ta yangi so'z o'rganing\n📌 DTM testlarini muntazam yechib turing\n📌 O'qigan materiallaringizni takrorlang\n\nBizning markazimizda tajribali ustozlar bilan individual va guruh darslari mavjud. Ro'yxatdan o'tish uchun 📝 Ro'yxatdan o'tish bo'limidan foydalaning.",
      ru: "Советы по учебе:\n\n📌 Уделяйте учебе минимум 1 час в день\n📌 Смотрите фильмы и сериалы на английском\n📌 Учите 10-15 новых слов каждый день\n📌 Регулярно решайте тесты DTM\n📌 Повторяйте пройденный материал\n\nВ нашем центре есть индивидуальные и групповые занятия. Для записи используйте раздел 📝 Записаться.",
      en: "Study advice:\n\n📌 Study at least 1 hour every day\n📌 Watch movies and series in English\n📌 Learn 10-15 new words daily\n📌 Practice DTM tests regularly\n📌 Review what you've learned\n\nWe offer individual and group classes. To enroll, use the 📝 Enroll section.",
    },
  },
  today_sovrini: {
    keywords: ['sovrin', 'sovrini', 'today sovrin', 'приз', 'prize', 'test', 'bepul test', 'free test', 'бесплатный'],
    responses: {
      uz: "🏆 TODAY Sovrini — 5-mavsum!\n\n25 ta savoldan iborat test:\n• 5 ta mantiqiy savol\n• 10 ta matematika\n• 10 ta ingliz tili\n\nBepul ishtirok eting va qimmatbaho sovrinlarni yutib oling!\n\nBatafsil: testtoday.uz",
      ru: "🏆 TODAY Sovrini — Сезон 5!\n\nТест из 25 вопросов:\n• 5 логических задач\n• 10 математика\n• 10 английский язык\n\nУчаствуйте бесплатно и выигрывайте ценные призы!\n\nПодробнее: testtoday.uz",
      en: "🏆 TODAY Sovrini — Season 5!\n\n25-question test:\n• 5 logical reasoning\n• 10 mathematics\n• 10 English\n\nParticipate for free and win valuable prizes!\n\nDetails: testtoday.uz",
    },
  },
  enrollment_question: {
    keywords: ['yozil', 'записат', 'enroll', 'regis', 'qanday yozil', 'kak zapis', 'ro\'yxatdan o\'t', 'ariza', 'прием'],
    responses: {
      uz: "Ro'yxatdan o'tish uchun:\n\n1. 📝 Ro'yxatdan o'tish bo'limiga o'ting\n2. Ismingizni kiriting\n3. Telefon raqamingizni kiriting\n4. Kursni tanlang\n5. Filialni tanlang\n\nYoki to'g'ridan-to'g'ri 📝 Ro'yxatdan o'tish tugmasini bosing.",
      ru: "Для записи:\n\n1. Перейдите в раздел 📝 Записаться\n2. Введите имя\n3. Введите номер телефона\n4. Выберите курс\n5. Выберите филиал\n\nИли нажмите кнопку 📝 Записаться.",
      en: "To enroll:\n\n1. Go to 📝 Enroll section\n2. Enter your name\n3. Enter your phone number\n4. Select a course\n5. Select a branch\n\nOr click the 📝 Enroll button.",
    },
  },
};

const CONFIDENCE_THRESHOLD = 0.4;

function detectIntent(message: string, lang: string): IntentMatch | null {
  const lowerMsg = message.toLowerCase();

  let bestMatch: IntentMatch | null = null;

  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    const matchedKeywords = pattern.keywords.filter((kw) => lowerMsg.includes(kw));
    if (matchedKeywords.length > 0) {
      const confidence = matchedKeywords.length / pattern.keywords.length;
      const normalizedConfidence = Math.min(confidence * 2, 0.95);
      const langKey = lang as keyof typeof pattern.responses;
      const responseKey = pattern.responses[langKey];

      if (normalizedConfidence > (bestMatch?.confidence || 0)) {
        bestMatch = {
          confidence: normalizedConfidence,
          responseKey: responseKey || pattern.responses.en,
        };
      }
    }
  }

  return bestMatch;
}

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

export async function handleAiTransfer(ctx: BotContext) {
  const t = ctx.t;

  await ctx.reply(t('ai.transfer_to_human'), {
    reply_markup: getAiKeyboard(ctx),
  });

  const lastMessages = ctx.session.aiHistory?.slice(-4) || [];
  const messageText = lastMessages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n---\n');

  await notifyAdminsAiTransfer({
    userId: ctx.user!.id,
    username: ctx.from?.username,
    message: messageText || t('ai.placeholder'),
    language: ctx.lang,
  }, ctx);

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
}

export async function handleAiMessage(ctx: BotContext, message: string) {
  const t = ctx.t;
  const lang = ctx.lang;

  if (!ctx.session.aiHistory) {
    ctx.session.aiHistory = [];
  }

  const thinkingMsg = await ctx.reply(t('ai.thinking'));

  try {
    const intent = detectIntent(message, lang);

    if (!intent || intent.confidence < CONFIDENCE_THRESHOLD) {
      ctx.session.aiHistory.push({ role: 'user', content: message });

      const fallbackResponse = t('ai.fallback');
      ctx.session.aiHistory.push({ role: 'assistant', content: fallbackResponse });

      await ctx.api.deleteMessage(thinkingMsg.chat.id, thinkingMsg.message_id).catch(() => {});
      await ctx.reply(fallbackResponse, {
        reply_markup: getAiKeyboard(ctx),
      });

      await notifyAdminsAiTransfer({
        userId: ctx.user!.id,
        username: ctx.from?.username,
        message,
        language: ctx.lang,
      }, ctx);

      await prisma.message.create({
        data: {
          userId: ctx.user!.id,
          question: message,
          answer: fallbackResponse,
        },
      });

      return;
    }

    const answer = intent.responseKey;

    ctx.session.aiHistory.push({ role: 'user', content: message });
    ctx.session.aiHistory.push({ role: 'assistant', content: answer });

    await ctx.api.deleteMessage(thinkingMsg.chat.id, thinkingMsg.message_id).catch(() => {});
    await ctx.reply(answer, {
      reply_markup: getAiKeyboard(ctx),
    });

    await prisma.message.create({
      data: {
        userId: ctx.user!.id,
        question: message,
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
