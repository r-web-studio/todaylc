import { NextResponse } from "next/server";
import { verifyAccessToken } from "./jwt";
import prisma from "../prisma";

export async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const accessToken = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    return { error: NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 }) };
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return { error: NextResponse.json({ success: false, message: "User not found" }, { status: 401 }) };
    }

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return { error: NextResponse.json({ success: false, message: "Token expired", code: "TOKEN_EXPIRED" }, { status: 401 }) };
    }
    return { error: NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 }) };
  }
}

export function authorize(...allowedRoles: string[]) {
  return (user: { role: string } | null) => {
    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ success: false, message: "Insufficient permissions" }, { status: 403 });
    }
    return null;
  };
}
