import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const { id } = await params;
    if (id === auth.user!.id) return errorResponse("Cannot delete yourself", 400);

    await prisma.user.delete({ where: { id } });
    return successResponse(null, "Admin deleted");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse("Failed to delete admin");
  }
}
