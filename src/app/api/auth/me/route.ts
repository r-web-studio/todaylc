import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/api/auth";
import { successResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;
  return successResponse({ user: auth.user }, "User fetched");
}
