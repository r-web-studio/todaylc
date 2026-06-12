from aiogram import Router, F
from aiogram.types import CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext

from l10n import get_text, format_courses_text, format_prices_text
from handlers.start import _main_menu_kb

router = Router()


@router.callback_query(F.data == "courses")
async def show_courses(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    courses_text = format_courses_text(lang)

    back_kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=get_text(lang, "back_btn"), callback_data="back_to_menu")]
        ]
    )

    await callback.message.edit_text(courses_text, parse_mode="HTML", reply_markup=back_kb)
    await callback.answer()


@router.callback_query(F.data == "prices")
async def show_prices(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    prices_text = format_prices_text(lang)

    back_kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=get_text(lang, "back_btn"), callback_data="back_to_menu")]
        ]
    )

    await callback.message.edit_text(prices_text, parse_mode="HTML", reply_markup=back_kb)
    await callback.answer()


@router.callback_query(F.data == "info")
async def show_info(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    info_text = (
        f"<b>{get_text(lang, 'info_title')}</b>\n\n"
        f"{get_text(lang, 'info_address')}\n"
        f"{get_text(lang, 'info_phone')}\n"
        f"{get_text(lang, 'info_hours')}\n"
        f"{get_text(lang, 'info_website')}\n"
        f"{get_text(lang, 'info_social')}"
    )

    back_kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=get_text(lang, "back_btn"), callback_data="back_to_menu")]
        ]
    )

    await callback.message.edit_text(info_text, parse_mode="HTML", reply_markup=back_kb)
    await callback.answer()


@router.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    await callback.message.edit_text(
        get_text(lang, "main_menu"),
        reply_markup=_main_menu_kb(lang),
    )
    await callback.answer()
