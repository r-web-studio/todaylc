import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    const enrollment = await prisma.enrollment.findUnique({ where: { id }, include: { course: true } });
    if (!enrollment) return errorResponse("Enrollment not found", 404);
    return successResponse(enrollment);
  } catch (error) {
    console.error("Get enrollment error:", error);
    return errorResponse("Failed to fetch enrollment");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    const enrollment = await prisma.enrollment.findUnique({ where: { id } });
    if (!enrollment) return errorResponse("Enrollment not found", 404);

    await prisma.enrollment.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        adminId: auth.user!.id,
        action: "ENROLLMENT_DELETE",
        targetId: id,
        targetType: "Enrollment",
        metadata: { studentName: enrollment.studentName, courseId: enrollment.courseId },
      },
    });
    return successResponse(null, "Enrollment deleted");
  } catch (error) {
    console.error("Delete enrollment error:", error);
    return errorResponse("Failed to delete enrollment");
  }
}
