import asyncio
import re
import logging

import aiohttp
from aiogram import Router, F
from aiogram.filters import StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import (
    Message,
    CallbackQuery,
    ReplyKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardRemove,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)

from config import API_URL
from l10n import get_text, get_course_categories
from states import EnrollState
from storage import save_enrollment
from handlers.start import _main_menu_kb

logger = logging.getLogger(__name__)

router = Router()


def _category_keyboard(lang: str) -> InlineKeyboardMarkup:
    categories = get_course_categories(lang)
    buttons = []
    for cat in categories:
        buttons.append(
            [InlineKeyboardButton(text=cat["name"], callback_data=f"sel_cat:{cat['key']}")]
        )
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def _course_keyboard(lang: str, category_key: str) -> InlineKeyboardMarkup:
    categories = get_course_categories(lang)
    courses = []
    for cat in categories:
        if cat["key"] == category_key:
            courses = cat["courses"]
            break
    buttons = []
    for course_key, course_name in courses:
        short_name = course_name.split(" – ")[0] if " – " in course_name else course_name
        buttons.append(
            [InlineKeyboardButton(text=short_name, callback_data=f"sel_course:{course_key}")]
        )
    buttons.append(
        [InlineKeyboardButton(text=get_text(lang, "back_categories_btn"), callback_data="back_to_cats")]
    )
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def _confirm_keyboard(lang: str) -> InlineKeyboardMarkup:
    buttons = [
        [
            InlineKeyboardButton(text=get_text(lang, "confirm_yes_btn"), callback_data="confirm_yes"),
            InlineKeyboardButton(text=get_text(lang, "confirm_no_btn"), callback_data="confirm_no"),
        ]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)


@router.callback_query(F.data == "enroll")
async def enroll_start(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    await callback.message.edit_text(
        f"{get_text(lang, 'enroll_start')}\n\n{get_text(lang, 'ask_name')}"
    )
    await state.set_state(EnrollState.name)
    await callback.answer()


@router.message(StateFilter(EnrollState.name))
async def process_name(message: Message, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    if not message.text:
        await message.answer(get_text(lang, "invalid_name"))
        return

    name = message.text.strip()
    if len(name) < 2 or not re.search(r"[a-zA-Zа-яА-ЯўғқҳЎҒҚҲ]", name):
        await message.answer(get_text(lang, "invalid_name"))
        return

    await state.update_data(name=name)

    contact_kb = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=get_text(lang, "share_contact_btn"), request_contact=True)]
        ],
        resize_keyboard=True,
        one_time_keyboard=True,
    )
    await message.answer(get_text(lang, "ask_phone"), reply_markup=contact_kb)
    await state.set_state(EnrollState.phone)


@router.message(StateFilter(EnrollState.phone), F.contact)
async def process_phone_contact(message: Message, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    phone = message.contact.phone_number
    if not phone.startswith("+"):
        phone = "+" + phone

    await state.update_data(phone=phone)
    await message.answer("▫️", reply_markup=ReplyKeyboardRemove())
    await message.answer(
        get_text(lang, "select_category"),
        reply_markup=_category_keyboard(lang),
    )
    await state.set_state(EnrollState.category)


@router.message(StateFilter(EnrollState.phone), F.text)
async def process_phone_text(message: Message, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    if not message.text:
        await message.answer(get_text(lang, "invalid_phone"))
        return

    phone = message.text.strip()
    phone_clean = re.sub(r"[\s\-\(\)]", "", phone)
    if not re.match(r"^\+?\d{7,15}$", phone_clean):
        await message.answer(get_text(lang, "invalid_phone"))
        return

    await state.update_data(phone=phone_clean)
    await message.answer("▫️", reply_markup=ReplyKeyboardRemove())
    await message.answer(
        get_text(lang, "select_category"),
        reply_markup=_category_keyboard(lang),
    )
    await state.set_state(EnrollState.category)


@router.callback_query(StateFilter(EnrollState.category), F.data.startswith("sel_cat:"))
async def process_category(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    category_key = callback.data.split(":", 1)[1]

    await state.update_data(category=category_key)

    categories = get_course_categories(lang)
    category_name = category_key
    for cat in categories:
        if cat["key"] == category_key:
            category_name = cat["name"]
            break

    await callback.message.edit_text(
        f"{get_text(lang, 'select_course')}\n\n<b>{category_name}</b>",
        parse_mode="HTML",
        reply_markup=_course_keyboard(lang, category_key),
    )
    await state.set_state(EnrollState.course)
    await callback.answer()


@router.callback_query(StateFilter(EnrollState.category), F.data == "back_to_cats")
async def back_to_categories_from_course(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    await callback.message.edit_text(
        get_text(lang, "select_category"),
        reply_markup=_category_keyboard(lang),
    )
    await state.set_state(EnrollState.category)
    await callback.answer()


@router.callback_query(StateFilter(EnrollState.course), F.data.startswith("sel_course:"))
async def process_course(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    course_key = callback.data.split(":", 1)[1]

    categories = get_course_categories(lang)
    course_label = course_key
    for cat in categories:
        for ck, cn in cat["courses"]:
            if ck == course_key:
                course_label = cn
                short_label = cn.split(" – ")[0] if " – " in cn else cn
                break

    await state.update_data(course=course_key, course_label=short_label)
    user_data = await state.get_data()

    summary = (
        f"<b>{get_text(lang, 'confirm_title')}</b>\n\n"
        f"<b>{get_text(lang, 'confirm_name')}:</b> {user_data['name']}\n"
        f"<b>{get_text(lang, 'confirm_phone')}:</b> {user_data['phone']}\n"
        f"<b>{get_text(lang, 'confirm_course')}:</b> {user_data['course_label']}\n\n"
        f"{get_text(lang, 'confirm_question')}"
    )

    await callback.message.edit_text(summary, parse_mode="HTML", reply_markup=_confirm_keyboard(lang))
    await state.set_state(EnrollState.confirm)
    await callback.answer()


@router.callback_query(StateFilter(EnrollState.confirm), F.data == "confirm_yes")
async def confirm_yes(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")
    name = data.get("name", "")
    phone = data.get("phone", "")
    course = data.get("course", "")
    course_label = data.get("course_label", "")

    save_enrollment(name, phone, course, course_label)

    asyncio.ensure_future(_send_to_api(name, phone, course, lang))

    await callback.message.edit_text(
        f"{get_text(lang, 'success_emoji')} {get_text(lang, 'success')}"
    )
    await state.clear()
    await callback.message.answer(
        get_text(lang, "main_menu"),
        reply_markup=_main_menu_kb(lang),
    )
    await callback.answer()


async def _send_to_api(name: str, phone: str, course: str, lang: str):
    payload = {"name": name, "phone": phone, "course": course}
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(API_URL, json=payload, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    logger.warning("API returned status %s: %s", resp.status, await resp.text())
    except aiohttp.ClientError as e:
        logger.error("API request failed: %s", e)
    except Exception as e:
        logger.error("Unexpected error during API call: %s", e)


@router.callback_query(StateFilter(EnrollState.confirm), F.data == "confirm_no")
async def confirm_no(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    lang = data.get("language", "uz")

    await state.clear()
    await callback.message.edit_text(get_text(lang, "cancel_message"))
    await callback.message.answer(
        get_text(lang, "main_menu"),
        reply_markup=_main_menu_kb(lang),
    )
    await callback.answer()
