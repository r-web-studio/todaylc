const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

const prisma = new PrismaClient();

async function login(req, res) {
  try {
    const { email, password } = req.validatedData;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    setTokenCookies(res, accessToken, refreshToken);

    return successResponse(res, {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, "Login failed");
  }
}

async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, "Refresh token required", 401);
    }

    const { verifyRefreshToken } = require("../utils/jwt");
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    setTokenCookies(res, accessToken, newRefreshToken);

    return successResponse(res, { accessToken }, "Token refreshed");
  } catch (error) {
    return errorResponse(res, "Invalid refresh token", 401);
  }
}

async function logout(req, res) {
  clearTokenCookies(res);
  return successResponse(res, null, "Logged out successfully");
}

async function me(req, res) {
  return successResponse(res, { user: req.user }, "User fetched");
}

module.exports = { login, refresh, logout, me };