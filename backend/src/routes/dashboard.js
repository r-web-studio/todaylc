const express = require("express");
const { getStats } = require("../controllers/dashboardController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", authenticate, authorize("ADMIN", "SUPERADMIN"), getStats);

module.exports = router;