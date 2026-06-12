import prisma from "../prisma";

export async function createEnrollment(data: {
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  photoUrl?: string;
  courseId: string;
  branch: string;
  message?: string;
}) {
  return prisma.enrollment.create({
    data: {
      studentName: data.studentName,
      studentPhone: data.studentPhone,
      studentEmail: data.studentEmail || null,
      photoUrl: data.photoUrl || null,
      courseId: data.courseId,
      branch: data.branch as "URGANCH" | "SHOVOT",
      message: data.message || null,
    },
    include: { course: true },
  });
}

export async function getEnrollments(filters: {
  course?: string;
  branch?: string;
  status?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { course, branch, status, search, page, limit, sortBy = "enrolledAt", sortOrder = "desc" } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
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

export async function getEnrollmentsForExport(filters: {
  course?: string;
  branch?: string;
  status?: string;
  search?: string;
}) {
  const { course, branch, status, search } = filters;
  const where: Record<string, unknown> = {};
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
