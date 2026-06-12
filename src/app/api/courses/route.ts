import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validate";

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  titleUz: z.string().min(2, "Uzbek title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration required"),
  price: z.coerce.number().int().positive("Price must be positive"),
  branch: z.enum(["URGANCH", "SHOVOT", "BOTH"]).default("BOTH"),
});

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return successResponse(courses);
  } catch (error) {
    console.error("List courses error:", error);
    return errorResponse("Failed to fetch courses");
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validated = validateBody(courseSchema, body);
    if (validated.error) return validated.error;

    const { title, titleUz, description, duration, price, branch } = validated.data!;
    const course = await prisma.course.create({
      data: { title, titleUz, description, duration, price: parseInt(String(price)), branch },
    });
    return successResponse(course, "Course created", 201);
  } catch (error) {
    console.error("Create course error:", error);
    return errorResponse("Failed to create course");
  }
}
