import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/response";

function enrollmentsToCSV(enrollments: Array<Record<string, unknown>>) {
  const headers = ["ID", "Talaba Ismi", "Telefon", "Email", "Kurs", "Filial", "Status", "Xabar", "Yuklangan Rasm", "Yaratilgan Sana", "Yangilangan Sana"];
  const rows = enrollments.map((e) => [
    e.id,
    e.studentName,
    e.studentPhone,
    e.studentEmail || "",
    (e.course as Record<string, string>)?.titleUz || (e.course as Record<string, string>)?.title || "",
    e.branch === "URGANCH" ? "Urganch" : e.branch === "SHOVOT" ? "Shovot" : "Boshqa",
    e.status === "PENDING" ? "Kutilmoqda" : e.status === "CONFIRMED" ? "Tasdiqlangan" : "Bekor qilingan",
    e.message || "",
    e.photoUrl || "",
    new Date(e.enrolledAt as string).toLocaleString("uz-UZ"),
    new Date(e.updatedAt as string).toLocaleString("uz-UZ"),
  ]);
  return [headers, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const where: Record<string, unknown> = {};

    const course = searchParams.get("course");
    const branch = searchParams.get("branch");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (course) where.courseId = course;
    if (branch) where.branch = branch;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: "insensitive" } },
        { studentPhone: { contains: search } },
        { studentEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
    });

    const csv = enrollmentsToCSV(enrollments as unknown as Array<Record<string, unknown>>);
    const filename = `enrollments-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return errorResponse("Failed to export CSV");
  }
}
