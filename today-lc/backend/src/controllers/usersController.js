const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/bcrypt");
const { successResponse, errorResponse } = require("../utils/response");

const prisma = new PrismaClient();

async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(res, users);
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse(res, "Failed to fetch users");
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.validatedData;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return errorResponse(res, "Email already in use", 400);

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(res, user, "Admin created", 201);
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse(res, "Failed to create admin");
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.validatedParams;
    if (id === req.user.id) return errorResponse(res, "Cannot delete yourself", 400);

    await prisma.user.delete({ where: { id } });
    return successResponse(res, null, "Admin deleted");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, "Failed to delete admin");
  }
}

module.exports = { listUsers, createUser, deleteUser };