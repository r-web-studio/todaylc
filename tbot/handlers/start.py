from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext

from l10n import get_text, LANGUAGES, TRANSLATIONS

router = Router()


def language_keyboard() -> InlineKeyboardMarkup:
    buttons = []
    for code, name in LANGUAGES.items():
        buttons.append([InlineKeyboardButton(text=name, callback_data=f"set_lang:{code}")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def _main_menu_kb(lang: str) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(text=get_text(lang, "courses_btn"), callback_data="courses")],
        [InlineKeyboardButton(text=get_text(lang, "prices_btn"), callback_data="prices")],
        [InlineKeyboardButton(text=get_text(lang, "info_btn"), callback_data="info")],
        [InlineKeyboardButton(text=get_text(lang, "enroll_btn"), callback_data="enroll")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)


@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    data = await state.get_data()
    lang = data.get("language", "uz")
    if lang not in TRANSLATIONS:
        lang = "uz"
    await message.answer(
        get_text(lang, "select_language"),
        reply_markup=language_keyboard(),
    )


@router.callback_query(F.data.startswith("set_lang:"))
async def set_language(callback: CallbackQuery, state: FSMContext):
    lang = callback.data.split(":", 1)[1]
    if lang not in TRANSLATIONS:
        lang = "uz"
    await state.update_data(language=lang)
    await callback.message.delete()
    await callback.message.answer(
        f"{get_text(lang, 'welcome')}\n\n{get_text(lang, 'main_menu')}",
        reply_markup=_main_menu_kb(lang),
    )
    await callback.answer(get_text(lang, "language_set"))


@router.message(F.text == "/menu")
async def cmd_menu(message: Message, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    await message.answer(
        get_text(lang, "main_menu"),
        reply_markup=_main_menu_kb(lang),
    )
