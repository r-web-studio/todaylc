const express = require("express");
const { z } = require("zod");
const { createEnrollmentCtrl, listEnrollments, getEnrollmentCtrl, updateStatusCtrl, deleteEnrollmentCtrl, exportCSV, upload } = require("../controllers/enrollmentsController");
const { validate, validateQuery, validateParams } = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const { enrollmentLimiter, apiLimiter } = require("../middleware/rateLimit");

const router = express.Router();

const enrollmentSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studentPhone: z.string().min(7, "Phone must be at least 7 characters"),
  studentEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  courseId: z.string().cuid("Invalid course ID"),
  branch: z.enum(["URGANCH", "SHOVOT"]),
  message: z.string().optional(),
});

const querySchema = z.object({
  course: z.string().cuid().optional(),
  branch: z.enum(["URGANCH", "SHOVOT"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(["enrolledAt", "studentName", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const statusSchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]) });
const idParam = z.object({ id: z.string().cuid("Invalid enrollment ID") });

router.post("/", enrollmentLimiter, upload.single("photo"), validate(enrollmentSchema), createEnrollmentCtrl);
router.get("/", authenticate, authorize("ADMIN", "SUPERADMIN"), validateQuery(querySchema), listEnrollments);
router.get("/export/csv", authenticate, authorize("ADMIN", "SUPERADMIN"), validateQuery(querySchema), exportCSV);
router.get("/:id", authenticate, authorize("ADMIN", "SUPERADMIN"), validateParams(idParam), getEnrollmentCtrl);
router.patch("/:id/status", authenticate, authorize("ADMIN", "SUPERADMIN"), validateParams(idParam), validate(statusSchema), updateStatusCtrl);
router.delete("/:id", authenticate, authorize("SUPERADMIN"), validateParams(idParam), deleteEnrollmentCtrl);

module.exports = router;