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

export default sql;
