import { ZodSchema } from "zod";
import { NextResponse } from "next/server";

export function validateBody(schema: ZodSchema, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

export function validateQuery(schema: ZodSchema, query: Record<string, string | string[] | undefined>) {
  const result = schema.safeParse(query);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { success: false, message: "Invalid query parameters", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}
