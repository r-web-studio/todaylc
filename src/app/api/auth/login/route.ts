import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/api/bcrypt";
import { generateAccessToken, generateRefreshToken, setTokenCookies } from "@/lib/api/jwt";
import { successResponse, errorResponse } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validate";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateBody(loginSchema, body);
    if (validated.error) return validated.error;

    const { email, password } = validated.data!;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse("Invalid credentials", 401);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return errorResponse("Invalid credentials", 401);

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    setTokenCookies(accessToken, refreshToken);

    return successResponse({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed");
  }
}
