import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, setTokenCookies } from "@/lib/api/jwt";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshToken) return errorResponse("Refresh token required", 401);

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });

    if (!user) return errorResponse("User not found", 401);

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    setTokenCookies(accessToken, newRefreshToken);

    return successResponse({ accessToken }, "Token refreshed");
  } catch {
    return errorResponse("Invalid refresh token", 401);
  }
}
