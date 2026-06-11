import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT id, name, phone, course, branch, created_at
      FROM enrollments
      ORDER BY created_at DESC
      LIMIT 500
    `;

    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Server xatoligi", success: false },
      { status: 500 }
    );
  }
}
