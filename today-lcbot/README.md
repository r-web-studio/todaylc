# Today Ta'lim Markazi — Telegram Bot

Production-grade Telegram bot for **Today Ta'lim Markazi** acting as:

- **Enrollment system** — collect applications via Telegram, notify admins
- **AI Assistant** — answer FAQs, recommend courses, explain IELTS/CEFR, give study advice
- **CRM platform** — manage applications with status tracking, analytics, admin commands

## Features

- Multi-language: 🇺🇿 Uzbek · 🇷🇺 Russian · 🇬🇧 English
- Deep-link enrollment from website (`t.me/todaylcbot?start=ielts`)
- Course catalog with descriptions, duration, prices
- Branch information (Urganch & Shovot)
- AI Assistant with confidence scoring & human operator fallback
- Admin notifications with inline action buttons (Contacted / Enrolled / Rejected)
- Admin statistics grouped by course, branch, status
- PostgreSQL persistence via Prisma

## Stack

- **Runtime:** Node.js 20+
- **Framework:** grammY (Telegram Bot Framework)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **AI:** Keyword-matching with confidence scoring + OpenAI-compatible API (optional)

## Getting Started

```bash
cp .env.example .env
# Edit .env with your bot token and database URL
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Deployment (Render)

1. Push to GitHub
2. In Render Dashboard → New Web Service → connect repo
3. Set root directory to `bot`
4. Add environment variables from `.env.example`
5. Deploy — Render will build and start automatically

## Bot Commands

| Command                  | Description            |
| ------------------------ | ---------------------- |
| `/start [course_id]`     | Start / deep-link      |
| `/applications`          | All applications       |
| `/applications new`      | New applications       |
| `/applications contacted`| Contacted applications |
| `/applications enrolled` | Enrolled students      |
| `/applications rejected` | Rejected applications  |
| `/stats`                 | Analytics              |

## Deep Link Mapping (Website → Bot)

| Website ID      | Bot Course Key     |
| --------------- | ------------------ |
| `ielts`         | ielts              |
| `cefr`          | cefr               |
| `ingliz-tili`   | english            |
| `rus-tili`      | russian            |
| `tarix`         | history            |
| `huquq`         | law                |
| `matematika`    | mathematics        |
| `fizika`        | physics            |
| `biologiya`     | biology            |
| `kimyo`         | chemistry          |
| `ona-tili`      | mother_language    |

## Database

Reuses the PostgreSQL database from the backend (Prompt 1). The bot adds its own tables (`telegram_users`, `applications`, `messages`) alongside the existing backend tables.

## License

Proprietary — Today Ta'lim Markazi
