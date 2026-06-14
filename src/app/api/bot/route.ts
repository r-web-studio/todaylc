import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";
import { sendMessage } from "@/lib/bot";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function answerCallback(callbackQueryId: string) {
  await fetch(`${API_BASE}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}

interface BotSession {
  chat_id: number;
  step: string;
  course?: string;
  course_title?: string;
  name?: string;
  phone?: string;
}

const sessions = new Map<number, BotSession>();

function buildCourseKeyboard() {
  return courses.map((c) => [{
    text: `${c.icon} ${c.title}`,
    callback_data: `course_${c.id}`,
  }]);
}

function buildMainMenuKeyboard() {
  return [
    [{ text: "Курсы", callback_data: "menu_courses" }],
    [{ text: "Цены", callback_data: "menu_prices" }],
    [{ text: "Информация", callback_data: "menu_info" }],
    [{ text: "Записаться", callback_data: "menu_enroll" }],
  ];
}

function buildLanguageKeyboard() {
  return [
    [{ text: "O'zbek", callback_data: "lang_uz" }],
    [{ text: "Русский", callback_data: "lang_ru" }],
    [{ text: "English", callback_data: "lang_en" }],
  ];
}

async function handleStart(chatId: number, courseId: string | null) {
  if (!courseId) {
    await sendMessage(chatId,
      "👋 Ассаламу алейкум! Добро пожаловать в бот Today Ta'lim Markazi!",
      { reply_markup: { inline_keyboard: buildLanguageKeyboard() } }
    );
    return;
  }
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    await sendMessage(chatId, "❌ Такой курс не найден.");
    return;
  }
  sessions.set(chatId, { chat_id: chatId, step: "awaiting_name", course_title: course.title });
  await sendMessage(chatId,
    `✅ <b>${course.icon} ${course.title}</b>\n\n💰 ${course.price}\n\nВведите ваше имя:`
  );
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    if (update.callback_query) {
      const q = update.callback_query;
      const chatId = q.message.chat.id;
      const data: string = q.data;

      await answerCallback(q.id);

      if (data.startsWith("lang_")) {
        const lang = data.replace("lang_", "");
        sessions.set(chatId, { chat_id: chatId, step: "main_menu" });
        await sendMessage(chatId, "✅ Язык выбран!", {
          reply_markup: { inline_keyboard: buildMainMenuKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_courses") {
        const cats = [
          {
            name: "🇬🇧 Английский язык (General)",
            courses: [
              "Grammar (foundation) – 2 мес – 400 000 сум",
              "Beginner – 1 мес – 400 000 сум",
              "Elementary – 2 мес – 400 000 сум",
              "Pre-intermediate – 2 мес – 450 000 сум",
              "Grammar B1-B2 – 3 мес – 400 000 сум",
              "Pre CEFR/IELTS – 2 мес – 500 000 сум",
              "IELTS – 5 мес – 550 000 сум",
              "CEFR – 4 мес – 550 000 сум",
            ],
            note: "Индивидуальные и вечерние курсы: оплата в 2 раза (2x) выше указанных цен.",
          },
          {
            name: "🗣 Разговорные курсы",
            courses: [
              "Speaking (в группе) – 500 000 сум",
              "Speaking (индивидуально) – 1 000 000 сум",
            ],
          },
          {
            name: "🌍 Другие языковые курсы",
            courses: [
              "Турецкий язык – 3 мес – 500 000 сум",
              "Корейский язык – 3-6 мес – 500 000 сум",
              "Немецкий язык – 3-6 мес – 500 000 сум",
              "Русский язык (разговорный) – 3 мес – 400 000 сум",
            ],
          },
          {
            name: "📚 Школьные предметы",
            courses: [
              "Родной язык – обычный – 6 мес – 450 000 сум",
              "Математика – обычный – 6 мес – 450 000 сум",
              "Биология – обычный – 6 мес – 450 000 сум",
              "Химия – обычный – 6 мес – 450 000 сум",
              "История – обычный – 6 мес – 450 000 сум",
              "Право – обычный – 6 мес – 450 000 сум",
              "Русский язык – обычный – 6 мес – 450 000 сум",
              "Национальный сертификат – 3-5 мес – 500 000 сум",
            ],
          },
          {
            name: "👶 Детские группы (2-3-4 классы)",
            courses: [
              "Английский язык – 9 мес – 350 000 сум",
              "Математика – 6 мес – 350 000 сум",
              "Русский язык – 6 мес – 350 000 сум",
              "Корейский язык – 6 мес – 350 000 сум",
              "Президентская школа Математика (PM) – 5 мес – 450 000 сум",
            ],
          },
        ];
        let text = "<b>Доступные курсы:</b>\n\n";
        cats.forEach((cat) => {
          text += `<b>${cat.name}</b>\n`;
          cat.courses.forEach((c) => { text += `  • ${c}\n`; });
          if ("note" in cat && cat.note) text += `  <i>${cat.note}</i>\n`;
          text += "\n";
        });
        await sendMessage(chatId, text, {
          reply_markup: { inline_keyboard: buildCourseKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_prices") {
        const cats = [
          {
            name: "🇬🇧 Английский язык (General)",
            courses: [
              "Grammar (foundation) – 2 мес – 400 000 сум",
              "Beginner – 1 мес – 400 000 сум",
              "Elementary – 2 мес – 400 000 сум",
              "Pre-intermediate – 2 мес – 450 000 сум",
              "Grammar B1-B2 – 3 мес – 400 000 сум",
              "Pre CEFR/IELTS – 2 мес – 500 000 сум",
              "IELTS – 5 мес – 550 000 сум",
              "CEFR – 4 мес – 550 000 сум",
            ],
            note: "Индивидуальные и вечерние курсы: оплата в 2 раза (2x) выше указанных цен.",
          },
          {
            name: "🗣 Разговорные курсы",
            courses: [
              "Speaking (в группе) – 500 000 сум",
              "Speaking (индивидуально) – 1 000 000 сум",
            ],
          },
          {
            name: "🌍 Другие языковые курсы",
            courses: [
              "Турецкий язык – 3 мес – 500 000 сум",
              "Корейский язык – 3-6 мес – 500 000 сум",
              "Немецкий язык – 3-6 мес – 500 000 сум",
              "Русский язык (разговорный) – 3 мес – 400 000 сум",
            ],
          },
          {
            name: "📚 Школьные предметы",
            courses: [
              "Родной язык – обычный – 6 мес – 450 000 сум",
              "Математика – обычный – 6 мес – 450 000 сум",
              "Биология – обычный – 6 мес – 450 000 сум",
              "Химия – обычный – 6 мес – 450 000 сум",
              "История – обычный – 6 мес – 450 000 сум",
              "Право – обычный – 6 мес – 450 000 сум",
              "Русский язык – обычный – 6 мес – 450 000 сум",
              "Национальный сертификат – 3-5 мес – 500 000 сум",
            ],
          },
          {
            name: "👶 Детские группы (2-3-4 классы)",
            courses: [
              "Английский язык – 9 мес – 350 000 сум",
              "Математика – 6 мес – 350 000 сум",
              "Русский язык – 6 мес – 350 000 сум",
              "Корейский язык – 6 мес – 350 000 сум",
              "Президентская школа Математика (PM) – 5 мес – 450 000 сум",
            ],
          },
        ];
        let text = "<b>Доступные курсы:</b>\n\n";
        cats.forEach((cat) => {
          text += `<b>${cat.name}</b>\n`;
          cat.courses.forEach((c) => { text += `  • ${c}\n`; });
          if ("note" in cat && cat.note) text += `  <i>${cat.note}</i>\n`;
          text += "\n";
        });
        await sendMessage(chatId, text, {
          reply_markup: { inline_keyboard: [[{ text: "Назад", callback_data: "menu_back" }]] },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_info") {
        await sendMessage(chatId,
          "<b>Today Ta'lim Markazi</b>\n\n" +
          "📍 Urganch shahri, Baynalminal ko'chasi 22-uy\n" +
          "📞 +998952230065\n" +
          "🕐 Dushanba – Shanba, 09:00 – 20:00\n\n" +
          "🌐 https://todaylc.onrender.com/\n" +
          "📱 Instagram: @today_talim_markazi\n" +
          "📱 Telegram: @today_LC",
          { reply_markup: { inline_keyboard: [[{ text: "Назад", callback_data: "menu_back" }]] } }
        );
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_enroll") {
        await sendMessage(chatId, "Выберите курс:", {
          reply_markup: { inline_keyboard: buildCourseKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_back") {
        await sendMessage(chatId, "Главное меню:", {
          reply_markup: { inline_keyboard: buildMainMenuKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("course_")) {
        const courseId = data.replace("course_", "");
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          sessions.set(chatId, { chat_id: chatId, step: "awaiting_name", course_title: course.title });
          await sendMessage(chatId,
            `✅ <b>${course.icon} ${course.title}</b>\n\n💰 ${course.price}\n\n${course.description}\n\nIsmingizni kiriting:`
          );
        }
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    }

    const msg = update.message;
    if (!msg || !msg.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === "/start") {
      await handleStart(chatId, null);
      return NextResponse.json({ ok: true });
    }

    if (text === "/courses") {
      await sendMessage(chatId, "Выберите курс:", {
        reply_markup: { inline_keyboard: buildCourseKeyboard() },
      });
      return NextResponse.json({ ok: true });
    }

    const session = sessions.get(chatId);

    if (session && session.step === "awaiting_name") {
      if (text.trim().length < 2) {
        await sendMessage(chatId, "❌ Пожалуйста, введите имя минимум из 2 букв:");
        return NextResponse.json({ ok: true });
      }
      session.step = "awaiting_phone";
      session.name = text.trim();
      sessions.set(chatId, session);
      await sendMessage(chatId, "📞 Введите ваш номер телефона:\nНапример: +998901234567");
      return NextResponse.json({ ok: true });
    }

    if (session && session.step === "awaiting_phone") {
      if (!/^[\+\d\s\-\(\)]{7,20}$/.test(text.trim())) {
        await sendMessage(chatId, "❌ Введите правильный номер телефона:\nНапример: +998901234567");
        return NextResponse.json({ ok: true });
      }

      const courseTitle = session.course_title || "Курс";
      let course = await prisma.course.findFirst({
        where: { OR: [{ title: courseTitle }, { titleUz: courseTitle }] },
      });
      if (!course) {
        course = await prisma.course.create({
          data: {
            title: courseTitle,
            titleUz: courseTitle,
            description: `Курс ${courseTitle}`,
            duration: "Неизвестно",
            price: 0,
            branch: "BOTH",
          },
        });
      }

      await prisma.enrollment.create({
        data: {
          studentName: session.name!,
          studentPhone: text.trim(),
          courseId: course.id,
          branch: "URGANCH",
        },
      });

      sessions.delete(chatId);
      await sendMessage(chatId,
        "✅ <b>Ваша заявка принята!</b>\n\nМы свяжемся с вами в ближайшее время.\n\n📞 Today Ta'lim Markazi"
      );
      return NextResponse.json({ ok: true });
    }

    await sendMessage(chatId,
      "Ассаламу алейкум! Нажмите /start для регистрации.",
      { reply_markup: { inline_keyboard: buildMainMenuKeyboard() } }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bot webhook error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
