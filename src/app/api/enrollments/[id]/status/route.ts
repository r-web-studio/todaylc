import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";

const statusSchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const result = statusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({ where: { id } });
    if (!enrollment) return errorResponse("Enrollment not found", 404);

    const updated = await prisma.enrollment.update({
      where: { id },
      data: { status: result.data.status },
      include: { course: true },
    });

    await prisma.auditLog.create({
      data: {
        adminId: auth.user!.id,
        action: "ENROLLMENT_STATUS_UPDATE",
        targetId: id,
        targetType: "Enrollment",
        metadata: { newStatus: result.data.status, studentName: updated.studentName },
      },
    });

    return successResponse(updated, "Status updated");
  } catch (error) {
    console.error("Update status error:", error);
    return errorResponse("Failed to update status");
  }
}
