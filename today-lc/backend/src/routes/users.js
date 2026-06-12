const express = require("express");
const { z } = require("zod");
const { listUsers, createUser, deleteUser } = require("../controllers/usersController");
const { validate, validateParams } = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "SUPERADMIN"]).default("ADMIN"),
});

const idParam = z.object({ id: z.string().cuid("Invalid user ID") });

router.get("/", authenticate, authorize("SUPERADMIN"), listUsers);
router.post("/", authenticate, authorize("SUPERADMIN"), validate(userSchema), createUser);
router.delete("/:id", authenticate, authorize("SUPERADMIN"), validateParams(idParam), deleteUser);

module.exports = router;