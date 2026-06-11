import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, course, branch } = body;

    if (!name || !phone || !course || !branch) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Ismingizni kiriting (kamida 2 harf)" },
        { status: 400 }
      );
    }

    if (!/^[\+\d\s\-\(\)]{7,20}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "Telefon raqamni to'g'ri kiriting" },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

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

    const result = await sql`
      INSERT INTO enrollments (name, phone, course, branch)
      VALUES (${name.trim()}, ${phone.trim()}, ${course}, ${branch})
      RETURNING id, created_at
    `;

    return NextResponse.json(
      {
        message: "Arizangiz qabul qilindi!",
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Xatolik yuz berdi. Iltimos qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT id, name, phone, course, branch, created_at
      FROM enrollments
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json(
      { error: "Ma'lumotlarni olishda xatolik" },
      { status: 500 }
    );
  }
}
