const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createEnrollment(data) {
  return prisma.enrollment.create({
    data: {
      studentName: data.studentName,
      studentPhone: data.studentPhone,
      studentEmail: data.studentEmail,
      photoUrl: data.photoUrl,
      courseId: data.courseId,
      branch: data.branch,
      message: data.message,
    },
    include: { course: true },
  });
}

async function getEnrollments(filters = {}) {
  const { course, branch, status, search, page = 1, limit = 20, sortBy = "enrolledAt", sortOrder = "desc" } = filters;
  const skip = (page - 1) * limit;

  const where = {};
  if (course) where.courseId = course;
  if (branch) where.branch = branch;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { studentName: { contains: search, mode: "insensitive" } },
      { studentPhone: { contains: search } },
      { studentEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      include: { course: true },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.enrollment.count({ where }),
  ]);

  return { enrollments, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getEnrollmentById(id) {
  return prisma.enrollment.findUnique({
    where: { id },
    include: { course: true },
  });
}

async function updateEnrollmentStatus(id, status, adminId) {
  const enrollment = await prisma.enrollment.update({
    where: { id },
    data: { status },
    include: { course: true },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: "ENROLLMENT_STATUS_UPDATE",
      targetId: id,
      targetType: "Enrollment",
      metadata: { newStatus: status, studentName: enrollment.studentName },
    },
  });

  return enrollment;
}

async function deleteEnrollment(id, adminId) {
  const enrollment = await prisma.enrollment.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: "ENROLLMENT_DELETE",
      targetId: id,
      targetType: "Enrollment",
      metadata: { studentName: enrollment.studentName, courseId: enrollment.courseId },
    },
  });

  return enrollment;
}

async function getDashboardStats() {
  const [total, pending, confirmed, cancelled, byBranch, byCourse, thisWeek, lastWeek] = await Promise.all([
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "PENDING" } }),
    prisma.enrollment.count({ where: { status: "CONFIRMED" } }),
    prisma.enrollment.count({ where: { status: "CANCELLED" } }),
    prisma.enrollment.groupBy({ by: ["branch"], _count: true }),
    prisma.enrollment.groupBy({ by: ["courseId"], _count: true }),
    prisma.enrollment.count({
      where: { enrolledAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  const branchData = {};
  byBranch.forEach((b) => (branchData[b.branch] = b._count));

  const courseData = {};
  const courses = await prisma.course.findMany({ where: { id: { in: byCourse.map((c) => c.courseId) } } });
  byCourse.forEach((c) => {
    const course = courses.find((co) => co.id === c.courseId);
    if (course) courseData[course.title] = c._count;
  });

  const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  return {
    total,
    pending,
    confirmed,
    cancelled,
    branchSplit: branchData,
    byCourse: courseData,
    thisWeek,
    lastWeek,
    weekDelta,
  };
}

async function getEnrollmentsForExport(filters = {}) {
  const { course, branch, status, search } = filters;
  const where = {};
  if (course) where.courseId = course;
  if (branch) where.branch = branch;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { studentName: { contains: search, mode: "insensitive" } },
      { studentPhone: { contains: search } },
      { studentEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.enrollment.findMany({
    where,
    include: { course: true },
    orderBy: { enrolledAt: "desc" },
  });
}

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
  deleteEnrollment,
  getDashboardStats,
  getEnrollmentsForExport,
};