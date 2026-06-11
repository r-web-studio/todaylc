import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS enrollments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      course VARCHAR(100) NOT NULL,
      branch VARCHAR(100) NOT NULL DEFAULT 'Urganch',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS bot_sessions (
      chat_id BIGINT PRIMARY KEY,
      step VARCHAR(50) NOT NULL,
      course VARCHAR(100) NOT NULL,
      name VARCHAR(100),
      phone VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function createEnrollment(data: {
  name: string;
  phone: string;
  course: string;
  branch: string;
}) {
  const result = await sql`
    INSERT INTO enrollments (name, phone, course, branch)
    VALUES (${data.name}, ${data.phone}, ${data.course}, ${data.branch})
    RETURNING id, created_at
  `;
  return result[0];
}

export async function getEnrollments() {
  return await sql`
    SELECT * FROM enrollments ORDER BY created_at DESC
  `;
}

export async function getBotSession(chatId: number) {
  const rows = await sql`
    SELECT * FROM bot_sessions WHERE chat_id = ${chatId}
  `;
  return rows.length > 0 ? rows[0] : null;
}

export async function upsertBotSession(chatId: number, data: {
  step: string;
  course: string;
  name?: string;
  phone?: string;
}) {
  await sql`
    INSERT INTO bot_sessions (chat_id, step, course, name, phone, updated_at)
    VALUES (${chatId}, ${data.step}, ${data.course}, ${data.name ?? null}, ${data.phone ?? null}, NOW())
    ON CONFLICT (chat_id)
    DO UPDATE SET
      step = ${data.step},
      course = ${data.course},
      name = ${data.name ?? null},
      phone = ${data.phone ?? null},
      updated_at = NOW()
  `;
}

export async function deleteBotSession(chatId: number) {
  await sql`DELETE FROM bot_sessions WHERE chat_id = ${chatId}`;
}

export default sql;
