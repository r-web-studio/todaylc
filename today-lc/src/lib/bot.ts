const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(chatId: number, text: string, extra?: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
  return res.json();
}

export function parseStartPayload(text: string): string | null {
  const match = text.match(/^\/start(?:\s+(.+))?$/);
  if (!match) return null;
  return match[1]?.trim() || null;
}

export function isNumericPhone(input: string): boolean {
  return /^[\+\d\s\-\(\)]{7,20}$/.test(input.trim());
}

export function isValidName(input: string): boolean {
  return input.trim().length >= 2;
}

export async function setWebhook(url: string) {
  const res = await fetch(`${API_BASE}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, drop_pending_updates: true }),
  });
  return res.json();
}

export async function getWebhookInfo() {
  const res = await fetch(`${API_BASE}/getWebhookInfo`);
  return res.json();
}
