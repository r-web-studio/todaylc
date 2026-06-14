import os
import logging
import asyncio

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Update
from pydantic import BaseModel

from config import BOT_TOKEN, validate_config
from handlers.start import router as start_router
from handlers.info import router as info_router
from handlers.enroll import router as enroll_router
from handlers.admin import router as admin_router
from storage import save_enrollment

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

WEBHOOK_PATH = "/webhook"
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "my-secret-key")
BASE_URL = os.getenv("RENDER_EXTERNAL_URL")

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())

polling_task = None
app = FastAPI()


class EnrollPayload(BaseModel):
    name: str
    phone: str
    course: str


@app.api_route("/", methods=["GET", "POST", "HEAD"], response_class=HTMLResponse)
async def index():
    return """
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Today Ta'lim Markazi</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; line-height: 1.6; }
    h1 { color: #2563eb; }
    a { color: #2563eb; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Today Ta'lim Markazi</h1>
  <p>Urganch shahri, Baynalminal ko'chasi 22-uy</p>
  <p>📞 +998952230065</p>
  <p>🕐 Dushanba – Shanba, 09:00 – 20:00</p>
  <a class="btn" href="https://t.me/todaylcbot" target="_blank">Telegram botga o'tish</a>
  <hr>
  <p><em>Kursga yozilish uchun Telegram botimizdan foydalaning.</em></p>
</body>
</html>
"""


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/enroll")
async def enroll(payload: EnrollPayload):
    save_enrollment(payload.name, payload.phone, payload.course, payload.course)
    return {"status": "ok"}


@app.post(WEBHOOK_PATH)
async def webhook(request: Request):
    secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
    if secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret token")
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup():
    global polling_task
    validate_config()
    dp.include_routers(start_router, info_router, enroll_router, admin_router)
    if not BASE_URL:
        logger.warning("RENDER_EXTERNAL_URL not set — falling back to long polling")
        polling_task = asyncio.create_task(dp.start_polling(bot))
        return
    webhook_url = f"{BASE_URL.rstrip('/')}{WEBHOOK_PATH}"
    await bot.set_webhook(webhook_url, secret_token=WEBHOOK_SECRET)
    logger.info("Webhook set to %s", webhook_url)


@app.on_event("shutdown")
async def on_shutdown():
    global polling_task
    if polling_task:
        polling_task.cancel()
    await bot.session.close()



