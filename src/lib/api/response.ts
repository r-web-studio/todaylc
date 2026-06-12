import { NextResponse } from "next/server";

export function successResponse(data: unknown, message = "Success", statusCode = 200) {
  return NextResponse.json({ success: true, message, data }, { status: statusCode });
}

export function errorResponse(message = "Internal server error", statusCode = 500, errors: unknown = null) {
  const response: Record<string, unknown> = { success: false, message };
  if (errors) response.errors = errors;
  return NextResponse.json(response, { status: statusCode });
}
