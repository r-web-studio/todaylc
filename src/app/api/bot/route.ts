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
    [{ text: "Kurslar", callback_data: "menu_courses" }],
    [{ text: "Narxlar", callback_data: "menu_prices" }],
    [{ text: "Ma'lumot", callback_data: "menu_info" }],
    [{ text: "Kursga yozilish", callback_data: "menu_enroll" }],
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
      "👋 Assalomu alaykum! Today Ta'lim Markazi botiga xush kelibsiz!",
      { reply_markup: { inline_keyboard: buildLanguageKeyboard() } }
    );
    return;
  }
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    await sendMessage(chatId, "❌ Bunday kurs topilmadi.");
    return;
  }
  sessions.set(chatId, { chat_id: chatId, step: "awaiting_name", course_title: course.title });
  await sendMessage(chatId,
    `✅ <b>${course.icon} ${course.title}</b>\n\n💰 ${course.price}\n\nIsmingizni kiriting:`
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
        await sendMessage(chatId, "✅ Til tanlandi!", {
          reply_markup: { inline_keyboard: buildMainMenuKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_courses") {
        const cats = [
          { name: "🇬🇧 Ingliz tili", courses: ["IELTS", "CEFR", "Ingliz tili"] },
          { name: "🗣 Speaking", courses: ["Speaking"] },
          { name: "🌍 Boshqa til kurslari", courses: ["Rus tili"] },
          { name: "📚 Maktab fanlari", courses: ["Matematika", "Fizika", "Biologiya", "Kimyo", "Tarix", "Huquq", "Ona tili"] },
        ];
        let text = "<b>Mavjud kurslar:</b>\n\n";
        cats.forEach((cat) => {
          text += `<b>${cat.name}</b>\n`;
          cat.courses.forEach((c) => { text += `  • ${c}\n`; });
          text += "\n";
        });
        await sendMessage(chatId, text, {
          reply_markup: { inline_keyboard: buildCourseKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_prices") {
        let text = "<b>Kurs narxlari:</b>\n\n";
        courses.forEach((c) => {
          text += `${c.icon} <b>${c.title}</b> — ${c.price}\n`;
        });
        await sendMessage(chatId, text, {
          reply_markup: { inline_keyboard: [[{ text: "Orqaga", callback_data: "menu_back" }]] },
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
          { reply_markup: { inline_keyboard: [[{ text: "Orqaga", callback_data: "menu_back" }]] } }
        );
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_enroll") {
        await sendMessage(chatId, "Kurslardan birini tanlang:", {
          reply_markup: { inline_keyboard: buildCourseKeyboard() },
        });
        return NextResponse.json({ ok: true });
      }

      if (data === "menu_back") {
        await sendMessage(chatId, "Asosiy menyu:", {
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
      await sendMessage(chatId, "Kurslardan birini tanlang:", {
        reply_markup: { inline_keyboard: buildCourseKeyboard() },
      });
      return NextResponse.json({ ok: true });
    }

    const session = sessions.get(chatId);

    if (session && session.step === "awaiting_name") {
      if (text.trim().length < 2) {
        await sendMessage(chatId, "❌ Iltimos, ismingizni kamida 2 harf bilan kiriting:");
        return NextResponse.json({ ok: true });
      }
      session.step = "awaiting_phone";
      session.name = text.trim();
      sessions.set(chatId, session);
      await sendMessage(chatId, "📞 Telefon raqamingizni kiriting:\nMasalan: +998901234567");
      return NextResponse.json({ ok: true });
    }

    if (session && session.step === "awaiting_phone") {
      if (!/^[\+\d\s\-\(\)]{7,20}$/.test(text.trim())) {
        await sendMessage(chatId, "❌ Telefon raqamni to'g'ri kiriting:\nMasalan: +998901234567");
        return NextResponse.json({ ok: true });
      }

      const courseTitle = session.course_title || "Kurs";
      let course = await prisma.course.findFirst({
        where: { OR: [{ title: courseTitle }, { titleUz: courseTitle }] },
      });
      if (!course) {
        course = await prisma.course.create({
          data: {
            title: courseTitle,
            titleUz: courseTitle,
            description: `${courseTitle} kursi`,
            duration: "Noma'lum",
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
        "✅ <b>Arizangiz qabul qilindi!</b>\n\nTez orada siz bilan bog'lanamiz.\n\n📞 Today Ta'lim Markazi"
      );
      return NextResponse.json({ ok: true });
    }

    await sendMessage(chatId,
      "Assalomu alaykum! Ro'yxatdan o'tish uchun /start tugmasini bosing.",
      { reply_markup: { inline_keyboard: buildMainMenuKeyboard() } }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bot webhook error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
