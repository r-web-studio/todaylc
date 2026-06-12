import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";
import { validateBody, validateQuery } from "@/lib/api/validate";
import { createEnrollment, getEnrollments, getEnrollmentsForExport } from "@/lib/api/enrollment-service";

const enrollmentSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studentPhone: z.string().min(7, "Phone must be at least 7 characters"),
  studentEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  courseId: z.string().min(1, "Course is required"),
  branch: z.enum(["URGANCH", "SHOVOT"]),
  message: z.string().optional(),
});

const querySchema = z.object({
  course: z.string().optional(),
  branch: z.enum(["URGANCH", "SHOVOT"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(["enrolledAt", "studentName", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body: Record<string, unknown> = {};
    formData.forEach((value, key) => { body[key] = value; });

    const validated = validateBody(enrollmentSchema, body);
    if (validated.error) return validated.error;

    const photoFile = formData.get("photo") as File | null;
    let photoUrl: string | undefined;

    if (photoFile) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(photoFile.type)) {
        return NextResponse.json({ success: false, message: "Only JPEG, PNG, WebP images allowed" }, { status: 400 });
      }
      const maxSize = parseInt(process.env.MAX_FILE_SIZE || "5242880");
      if (photoFile.size > maxSize) {
        return NextResponse.json({ success: false, message: "File too large" }, { status: 400 });
      }
      const ext = photoFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    const enrollment = await createEnrollment({ ...validated.data!, photoUrl });
    return successResponse(enrollment, "Enrollment submitted successfully", 201);
  } catch (error: unknown) {
    console.error("Create enrollment error:", error);
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2003") {
      return errorResponse("Invalid course ID", 400);
    }
    return errorResponse("Failed to submit enrollment");
  }
}

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const validated = validateQuery(querySchema, Object.fromEntries(searchParams));
    if (validated.error) return validated.error;

    const q = validated.data!;
    const result = await getEnrollments({
      course: q.course,
      branch: q.branch,
      status: q.status,
      search: q.search,
      page: q.page || 1,
      limit: q.limit || 20,
      sortBy: q.sortBy,
      sortOrder: q.sortOrder,
    });
    return successResponse(result);
  } catch (error) {
    console.error("List enrollments error:", error);
    return errorResponse("Failed to fetch enrollments");
  }
}
