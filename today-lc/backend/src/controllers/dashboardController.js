const { successResponse, errorResponse } = require("../utils/response");
const { getDashboardStats } = require("../services/enrollmentService");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getStats(req, res) {
  try {
    const stats = await getDashboardStats();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyEnrollments = await prisma.$queryRaw`
      SELECT DATE("enrolledAt") as date, COUNT(*) as count
      FROM "enrollments"
      WHERE "enrolledAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("enrolledAt")
      ORDER BY date ASC
    `;

    return successResponse(res, { ...stats, dailyEnrollments });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse(res, "Failed to fetch dashboard stats");
  }
}

module.exports = { getStats };