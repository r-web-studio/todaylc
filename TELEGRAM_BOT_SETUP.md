# Telegram Bot Setup Guide

## 1. Create the bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Choose a name (e.g. `Today LC Bot`)
4. Choose a username (e.g. `today_lc_bot` — used in the website)
5. Copy the API token

## 2. Set bot commands

Send `/setcommands` to `@BotFather`, then select your bot, then paste:

```
start - Bosh sahifa
courses - Barcha kurslar
contact - Aloqa
about - Biz haqimizda
```

## 3. Bot responses

### `/start`
```
👋 Assalomu alaykum! Today Ta'lim Markazi botiga xush kelibsiz!

Quyidagi kurslardan birini tanlang yoki /courses buyrug'ini yuboring:
```

Then show an inline keyboard with all courses:
```
🌍 IELTS
📋 CEFR
🇬🇧 Ingliz tili
🇷🇺 Rus tili
📖 Tarix
⚖️ Huquq
➕ Matematika
⚗️ Fizika
🧬 Biologiya
🧪 Kimyo
📖 Ona tili va adabiyoti
```

### `/start ielts` (deep link from website)
When user clicks a course button on the website, they arrive with `/start ielts`. The bot should reply:

```
🌍 IELTS kursi

💰 Narxi: 550 000 UZS/oy
📚 Xalqaro ingliz tili imtihoniga tayyorlov

Tajribali ustozlar bilan har tomonlama tayyorgarlik:
listening, reading, writing va speaking ko'nikmalari.

✅ Haftada 4 marta dars
✅ Individual yondashuv
✅ Real imtihon simulyatsiyasi
✅ 7.0+ ball kafolati

📞 Ro'yxatdan o'tish uchun: @today_LC
```

### Deep link mapping
```
start=ielts       → IELTS   (550 000 UZS/oy)
start=cefr        → CEFR    (350 000 UZS/oy)
start=ingliz-tili → Ingliz tili (350 000 UZS/oy)
start=rus-tili    → Rus tili (350 000 UZS/oy)
start=tarix       → Tarix   (350 000 UZS/oy)
start=huquq       → Huquq   (350 000 UZS/oy)
start=matematika  → Matematika (350 000 UZS/oy)
start=fizika      → Fizika  (350 000 UZS/oy)
start=biologiya   → Biologiya (350 000 UZS/oy)
start=kimyo       → Kimyo   (350 000 UZS/oy)
start=ona-tili    → Ona tili va adabiyoti (350 000 UZS/oy)
```

## 4. Host the bot (Node.js example)

Create a new folder `bot/` and run:

```bash
npm init -y
npm install node-telegram-bot-api dotenv
```

Create `bot/index.js`:

```javascript
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const courses = {
  ielts:       { icon: '🌍', title: 'IELTS', price: '550 000 UZS/oy', desc: '...', highlights: ['...'] },
  cefr:        { icon: '📋', title: 'CEFR', price: '350 000 UZS/oy', desc: '...', highlights: ['...'] },
  // ... add all courses matching src/data/courses.ts
};

bot.onText(/\/start(.+)?/, (msg, match) => {
  const chatId = msg.chat.id;
  const courseId = match[1]?.trim();

  if (courseId && courses[courseId]) {
    const c = courses[courseId];
    let reply = `${c.icon} ${c.title}\n\n💰 ${c.price}\n${c.desc}\n\n`;
    c.highlights.forEach(h => reply += `✅ ${h}\n`);
    reply += `\n📞 Ro'yxatdan o'tish: @today_LC`;
    bot.sendMessage(chatId, reply);
  } else {
    bot.sendMessage(chatId, '👋 Xush kelibsiz!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌍 IELTS', callback_data: 'course_ielts' }],
          // ... all courses
        ]
      }
    });
  }
});

bot.on('callback_query', (q) => {
  const courseId = q.data.replace('course_', '');
  // same reply as above
});
```

## 5. Deploy the bot

Deploy to Render as a **Cron Job** (simple Node process):
- Build: `npm install`
- Start: `node bot/index.js`
- Add env var: `BOT_TOKEN=your_token_here`
