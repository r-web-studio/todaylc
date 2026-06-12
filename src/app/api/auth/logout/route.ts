import { NextResponse } from "next/server";
import { clearTokenCookies } from "@/lib/api/jwt";
import { successResponse } from "@/lib/api/response";

export async function POST() {
  clearTokenCookies();
  return successResponse(null, "Logged out successfully");
}
