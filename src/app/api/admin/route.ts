import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function verifyPassword(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

function isValidPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Server xatoligi", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = verifyPassword(request);
    if (!token || !isValidPassword(token)) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
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
    console.error("Admin GET error:", error);
    return NextResponse.json(
      { error: "Server xatoligi", success: false },
      { status: 500 }
    );
  }
}
