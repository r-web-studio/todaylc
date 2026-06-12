const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("../utils/response");
const { createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus, deleteEnrollment, getEnrollmentsForExport } = require("../services/enrollmentService");
const { sendEnrollmentNotification, sendEnrollmentConfirmation } = require("../services/emailService");

const prisma = new PrismaClient();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WebP images allowed"));
  },
});

async function createEnrollmentCtrl(req, res) {
  try {
    const data = req.validatedData;
    if (req.file) data.photoUrl = `/uploads/${req.file.filename}`;

    const enrollment = await createEnrollment(data);

    await sendEnrollmentNotification(enrollment);
    if (enrollment.studentEmail) await sendEnrollmentConfirmation(enrollment);

    return successResponse(res, enrollment, "Enrollment submitted successfully", 201);
  } catch (error) {
    console.error("Create enrollment error:", error);
    if (error.code === "P2003") return errorResponse(res, "Invalid course ID", 400);
    return errorResponse(res, "Failed to submit enrollment");
  }
}

async function listEnrollments(req, res) {
  try {
    const { course, branch, status, search, page, limit, sortBy, sortOrder } = req.validatedQuery;
    const result = await getEnrollments({
      course,
      branch,
      status,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      sortBy,
      sortOrder,
    });
    return successResponse(res, result);
  } catch (error) {
    console.error("List enrollments error:", error);
    return errorResponse(res, "Failed to fetch enrollments");
  }
}

async function getEnrollmentCtrl(req, res) {
  try {
    const { id } = req.validatedParams;
    const enrollment = await getEnrollmentById(id);
    if (!enrollment) return errorResponse(res, "Enrollment not found", 404);
    return successResponse(res, enrollment);
  } catch (error) {
    console.error("Get enrollment error:", error);
    return errorResponse(res, "Failed to fetch enrollment");
  }
}

async function updateStatusCtrl(req, res) {
  try {
    const { id } = req.validatedParams;
    const { status } = req.validatedData;

    const enrollment = await getEnrollmentById(id);
    if (!enrollment) return errorResponse(res, "Enrollment not found", 404);

    const updated = await updateEnrollmentStatus(id, status, req.user.id);
    return successResponse(res, updated, "Status updated");
  } catch (error) {
    console.error("Update status error:", error);
    return errorResponse(res, "Failed to update status");
  }
}

async function deleteEnrollmentCtrl(req, res) {
  try {
    const { id } = req.validatedParams;
    const enrollment = await getEnrollmentById(id);
    if (!enrollment) return errorResponse(res, "Enrollment not found", 404);

    await deleteEnrollment(id, req.user.id);
    return successResponse(res, null, "Enrollment deleted");
  } catch (error) {
    console.error("Delete enrollment error:", error);
    return errorResponse(res, "Failed to delete enrollment");
  }
}

async function exportCSV(req, res) {
  try {
    const { course, branch, status, search } = req.validatedQuery;
    const enrollments = await getEnrollmentsForExport({ course, branch, status, search });

    const { streamCSV } = require("../services/csvService");
    streamCSV(enrollments, res);
  } catch (error) {
    console.error("Export CSV error:", error);
    return errorResponse(res, "Failed to export CSV");
  }
}

module.exports = { createEnrollmentCtrl, listEnrollments, getEnrollmentCtrl, updateStatusCtrl, deleteEnrollmentCtrl, exportCSV, upload };