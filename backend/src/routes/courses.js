const express = require("express");
const { z } = require("zod");
const { listCourses, createCourse, updateCourse, deleteCourse } = require("../controllers/coursesController");
const { validate, validateParams, validateQuery } = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  titleUz: z.string().min(2, "Uzbek title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration required"),
  price: z.coerce.number().int().positive("Price must be positive"),
  branch: z.enum(["URGANCH", "SHOVOT", "BOTH"]).default("BOTH"),
});

const updateCourseSchema = courseSchema.partial();

const idParam = z.object({ id: z.string().cuid("Invalid course ID") });

router.get("/", listCourses);
router.post("/", authenticate, authorize("ADMIN", "SUPERADMIN"), validate(courseSchema), createCourse);
router.put("/:id", authenticate, authorize("ADMIN", "SUPERADMIN"), validateParams(idParam), validate(updateCourseSchema), updateCourse);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPERADMIN"), validateParams(idParam), deleteCourse);

module.exports = router;