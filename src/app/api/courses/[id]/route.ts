import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";

const updateCourseSchema = z.object({
  title: z.string().min(2).optional(),
  titleUz: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  duration: z.string().min(1).optional(),
  price: z.coerce.number().int().positive().optional(),
  branch: z.enum(["URGANCH", "SHOVOT", "BOTH"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateCourseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...result.data,
        price: result.data.price ? parseInt(String(result.data.price)) : undefined,
      },
    });
    return successResponse(course, "Course updated");
  } catch (error) {
    console.error("Update course error:", error);
    return errorResponse("Failed to update course");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.course.update({ where: { id }, data: { isActive: false } });
    return successResponse(null, "Course deactivated");
  } catch (error) {
    console.error("Delete course error:", error);
    return errorResponse("Failed to delete course");
  }
}
