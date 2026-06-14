from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
)

from config import ADMIN_PASSWORD
from storage import get_enrollments, get_enrollment_by_id, delete_enrollment_by_id

router = Router()


def _format_enrollment(r: dict, idx: int) -> str:
    return (
        f"{idx}. <b>{r['name']}</b>\n"
        f"   📞 {r['phone']}\n"
        f"   📚 {r['course_label']}\n"
        f"   🕐 {r['created_at']}\n"
        f"   ID: <code>{r['id']}</code>"
    )


def _format_full_enrollment(r: dict) -> str:
    return (
        f"<b>To'liq ma'lumot</b>\n\n"
        f"🆔 ID: <code>{r['id']}</code>\n"
        f"👤 Ism: {r['name']}\n"
        f"📞 Telefon: {r['phone']}\n"
        f"📚 Kurs: {r['course_label']}\n"
        f"🕐 Yaratilgan: {r['created_at']}"
    )


@router.message(Command("admin"))
async def cmd_admin(message: Message):
    parts = message.text.strip().split(maxsplit=1)
    if len(parts) < 2 or parts[1] != ADMIN_PASSWORD:
        await message.answer("❌ Noto'g'ri parol.")
        return

    enrollments = get_enrollments(50)
    if not enrollments:
        await message.answer("Hech qanday ro'yxatdan o'tish yo'q.")
        return

    chunks = []
    chunk = []
    for i, e in enumerate(enrollments, 1):
        line = _format_enrollment(e, i)
        chunk.append(line)
        if len(chunk) == 10:
            chunks.append("\n\n".join(chunk))
            chunk = []
    if chunk:
        chunks.append("\n\n".join(chunk))

    for c in chunks:
        await message.answer(c, parse_mode="HTML")


@router.message(Command("view"))
async def cmd_view(message: Message):
    parts = message.text.strip().split(maxsplit=2)
    if len(parts) < 2 or parts[1] != ADMIN_PASSWORD:
        await message.answer("❌ Noto'g'ri parol.")
        return
    if len(parts) < 3:
        await message.answer("Iltimos, ko'rish uchun ID kiriting: /view parol ID")
        return

    try:
        enrollment_id = int(parts[2])
    except ValueError:
        await message.answer("❌ ID noto'g'ri formatda.")
        return

    enrollment = get_enrollment_by_id(enrollment_id)
    if not enrollment:
        await message.answer("❌ Bu ID bilan ro'yxatdan o'tish topilmadi.")
        return

    await message.answer(_format_full_enrollment(enrollment), parse_mode="HTML")


@router.message(Command("delete"))
async def cmd_delete(message: Message):
    parts = message.text.strip().split(maxsplit=2)
    if len(parts) < 2 or parts[1] != ADMIN_PASSWORD:
        await message.answer("❌ Noto'g'ri parol.")
        return
    if len(parts) < 3:
        await message.answer("Iltimos, o'chirish uchun ID kiriting: /delete parol ID")
        return

    try:
        enrollment_id = int(parts[2])
    except ValueError:
        await message.answer("❌ ID noto'g'ri formatda.")
        return

    enrollment = get_enrollment_by_id(enrollment_id)
    if not enrollment:
        await message.answer("❌ Bu ID bilan ro'yxatdan o'tish topilmadi.")
        return

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Ha, o'chirish", callback_data=f"del_confirm:{enrollment_id}")],
        [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="del_cancel")],
    ])

    await message.answer(
        f"<b>O'chirishni tasdiqlang</b>\n\n"
        f"👤 {enrollment['name']}\n"
        f"📞 {enrollment['phone']}\n"
        f"📚 {enrollment['course_label']}\n\n"
        f"Bu ro'yxatdan o'tishni o'chirishni xohlaysizmi?",
        parse_mode="HTML",
        reply_markup=keyboard,
    )


@router.callback_query(F.data.startswith("del_confirm:"))
async def cb_delete_confirm(callback: CallbackQuery):
    enrollment_id = int(callback.data.split(":", 1)[1])
    deleted = delete_enrollment_by_id(enrollment_id)
    if deleted:
        await callback.message.edit_text("✅ Ro'yxatdan o'tish muvaffaqiyatli o'chirildi.")
    else:
        await callback.message.edit_text("❌ Xatolik yuz berdi yoki ro'yxatdan o'tish topilmadi.")
    await callback.answer()


@router.callback_query(F.data == "del_cancel")
async def cb_delete_cancel(callback: CallbackQuery):
    await callback.message.edit_text("❌ O'chirish bekor qilindi.")
    await callback.answer()
