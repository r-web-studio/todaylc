from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message

from config import ADMIN_PASSWORD
from storage import get_enrollments

router = Router()


def _format_enrollment(r: dict, idx: int) -> str:
    return (
        f"{idx}. <b>{r['name']}</b>\n"
        f"   📞 {r['phone']}\n"
        f"   📚 {r['course_label']}\n"
        f"   🕐 {r['created_at']}"
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
