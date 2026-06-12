import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function verifyPassword(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

function isValidPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
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
    return NextResponse.json({ error: "Server xatoligi", success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = verifyPassword(request);
    if (!token || !isValidPassword(token)) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
      take: 500,
    });

    const data = enrollments.map((e) => ({
      id: e.id,
      name: e.studentName,
      phone: e.studentPhone,
      course: e.course?.titleUz || e.course?.title || "",
      branch: e.branch === "URGANCH" ? "Urganch" : "Shovot",
      created_at: e.enrolledAt.toISOString(),
    }));

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ error: "Server xatoligi", success: false }, { status: 500 });
  }
}
