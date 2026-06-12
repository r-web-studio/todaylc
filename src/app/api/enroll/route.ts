import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, course: courseTitle, branch } = body;

    if (!name || !phone || !courseTitle || !branch) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Ismingizni kiriting (kamida 2 harf)" }, { status: 400 });
    }

    if (!/^[\+\d\s\-\(\)]{7,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: "Telefon raqamni to'g'ri kiriting" }, { status: 400 });
    }

    let course = await prisma.course.findFirst({
      where: { OR: [{ title: courseTitle }, { titleUz: courseTitle }] },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          title: courseTitle,
          titleUz: courseTitle,
          description: `${courseTitle} kursi`,
          duration: "Noma'lum",
          price: 0,
          branch: "BOTH",
        },
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentName: name.trim(),
        studentPhone: phone.trim(),
        courseId: course.id,
        branch: branch === "Shovot" ? "SHOVOT" : "URGANCH",
      },
    });

    return NextResponse.json({
      message: "Arizangiz qabul qilindi!",
      data: { id: enrollment.id, created_at: enrollment.enrolledAt.toISOString() },
    }, { status: 201 });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi. Iltimos qayta urinib ko'ring." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
