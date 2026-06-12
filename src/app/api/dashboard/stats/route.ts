import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, authorize } from "@/lib/api/auth";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const authError = authorize("ADMIN", "SUPERADMIN")(auth.user!);
  if (authError) return authError;

  try {
    const [total, pending, confirmed, cancelled, byBranch, byCourse, thisWeek, lastWeek] = await Promise.all([
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count({ where: { status: "CONFIRMED" } }),
      prisma.enrollment.count({ where: { status: "CANCELLED" } }),
      prisma.enrollment.groupBy({ by: ["branch"], _count: true }),
      prisma.enrollment.groupBy({ by: ["courseId"], _count: true }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const branchData: Record<string, number> = {};
    byBranch.forEach((b) => (branchData[b.branch] = b._count));

    const courseData: Record<string, number> = {};
    const courses = await prisma.course.findMany({ where: { id: { in: byCourse.map((c) => c.courseId) } } });
    byCourse.forEach((c) => {
      const course = courses.find((co) => co.id === c.courseId);
      if (course) courseData[course.title] = c._count;
    });

    const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyEnrollments = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("enrolledAt") as date, COUNT(*) as count
      FROM "enrollments"
      WHERE "enrolledAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("enrolledAt")
      ORDER BY date ASC
    `;

    return successResponse({
      total, pending, confirmed, cancelled,
      branchSplit: branchData,
      byCourse: courseData,
      thisWeek, lastWeek, weekDelta,
      dailyEnrollments: dailyEnrollments.map((d) => ({ date: d.date, count: Number(d.count) })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse("Failed to fetch dashboard stats");
  }
}
