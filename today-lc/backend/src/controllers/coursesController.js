const { PrismaClient } = require("@prisma/client");
const { successResponse, errorResponse } = require("../utils/response");

const prisma = new PrismaClient();

async function listCourses(req, res) {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return successResponse(res, courses);
  } catch (error) {
    console.error("List courses error:", error);
    return errorResponse(res, "Failed to fetch courses");
  }
}

async function createCourse(req, res) {
  try {
    const { title, titleUz, description, duration, price, branch } = req.validatedData;
    const course = await prisma.course.create({
      data: { title, titleUz, description, duration, price: parseInt(price), branch },
    });
    return successResponse(res, course, "Course created", 201);
  } catch (error) {
    console.error("Create course error:", error);
    return errorResponse(res, "Failed to create course");
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.validatedParams;
    const { title, titleUz, description, duration, price, branch, isActive } = req.validatedData;
    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        titleUz,
        description,
        duration,
        price: price ? parseInt(price) : undefined,
        branch,
        isActive,
      },
    });
    return successResponse(res, course, "Course updated");
  } catch (error) {
    console.error("Update course error:", error);
    return errorResponse(res, "Failed to update course");
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.validatedParams;
    await prisma.course.update({
      where: { id },
      data: { isActive: false },
    });
    return successResponse(res, null, "Course deactivated");
  } catch (error) {
    console.error("Delete course error:", error);
    return errorResponse(res, "Failed to delete course");
  }
}

module.exports = { listCourses, createCourse, updateCourse, deleteCourse };