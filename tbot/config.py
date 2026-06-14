import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
API_URL: str = os.getenv("API_URL", "")
ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")


def validate_config() -> None:
    if not BOT_TOKEN:
        raise ValueError("BOT_TOKEN is not set in environment variables")
