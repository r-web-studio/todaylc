import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";
import { sendMessage, parseStartPayload, isValidName, isNumericPhone } from "@/lib/bot";
import { initDB, getBotSession, upsertBotSession, deleteBotSession, createEnrollment } from "@/lib/db";

function buildCourseKeyboard() {
  return courses.map((c) => [{
    text: `${c.icon} ${c.title}`,
    callback_data: `course_${c.id}`,
  }]);
}

async function handleStart(chatId: number, courseId: string | null) {
  if (!courseId) {
    await sendMessage(chatId,
      "👋 Assalomu alaykum! Today Ta'lim Markazi botiga xush kelibsiz!\n\nKurslardan birini tanlang:",
      { reply_markup: { inline_keyboard: buildCourseKeyboard() } }
    );
    return;
  }

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    await sendMessage(chatId, "❌ Bunday kurs topilmadi.");
    return;
  }

  await upsertBotSession(chatId, { step: "awaiting_name", course: course.title });
  await sendMessage(chatId,
    `✅ <b>${course.icon} ${course.title}</b>\n\n💰 ${course.price}\n\nIsmingizni kiriting:`
  );
}

export async function POST(request: NextRequest) {
  try {
    await initDB();

    const update = await request.json();

    // --- Handle callback_query ---
    if (update.callback_query) {
      const q = update.callback_query;
      const chatId = q.message.chat.id;
      const courseId = q.data.replace("course_", "");
      const course = courses.find((c) => c.id === courseId);

      if (course) {
        await upsertBotSession(chatId, { step: "awaiting_name", course: course.title });
        await sendMessage(chatId,
          `✅ <b>${course.icon} ${course.title}</b>\n\n💰 ${course.price}\n\nIsmingizni kiriting:`
        );
      }

      // Answer callback query
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (token) {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: q.id }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    // --- Handle regular messages ---
    const msg = update.message;
    if (!msg || !msg.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const session = await getBotSession(chatId);

    // /start command
    const payload = parseStartPayload(text);
    if (payload !== null) {
      await handleStart(chatId, payload);
      return NextResponse.json({ ok: true });
    }

    // /courses command
    if (text === "/courses") {
      await sendMessage(chatId, "Kurslardan birini tanlang:", {
        reply_markup: { inline_keyboard: buildCourseKeyboard() },
      });
      return NextResponse.json({ ok: true });
    }

    // Conversation: awaiting name
    if (session && session.step === "awaiting_name") {
      if (!isValidName(text)) {
        await sendMessage(chatId, "❌ Iltimos, ismingizni kamida 2 harf bilan kiriting:");
        return NextResponse.json({ ok: true });
      }
      await upsertBotSession(chatId, { step: "awaiting_phone", course: session.course, name: text.trim() });
      await sendMessage(chatId, "📞 Telefon raqamingizni kiriting:\nMasalan: +998901234567");
      return NextResponse.json({ ok: true });
    }

    // Conversation: awaiting phone
    if (session && session.step === "awaiting_phone") {
      if (!isNumericPhone(text)) {
        await sendMessage(chatId, "❌ Telefon raqamni to'g'ri kiriting:\nMasalan: +998901234567");
        return NextResponse.json({ ok: true });
      }
      await createEnrollment({
        name: session.name!,
        phone: text.trim(),
        course: session.course,
        branch: "Urganch",
      });

      await deleteBotSession(chatId);
      await sendMessage(chatId,
        "✅ <b>Arizangiz qabul qilindi!</b>\n\nTez orada siz bilan bog'lanamiz.\n\n📞 Today Ta'lim Markazi"
      );
      return NextResponse.json({ ok: true });
    }

    // Fallback
    await sendMessage(chatId,
      "Assalomu alaykum! Ro'yxatdan o'tish uchun /start tugmasini bosing."
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bot webhook error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
