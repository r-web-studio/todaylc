import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { hashPassword } from "@/lib/api/bcrypt";
import { successResponse, errorResponse } from "@/lib/api/response";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "SUPERADMIN"]).default("ADMIN"),
});

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(users);
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("Failed to fetch users");
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const body = await request.json();
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, role } = result.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return errorResponse("Email already in use", 400);

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(user, "Admin created", 201);
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse("Failed to create admin");
  }
}
