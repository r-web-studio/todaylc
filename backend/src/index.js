require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const { apiLimiter } = require("./middleware/rateLimit");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/users");

const app = express();
const prisma = new PrismaClient();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = { app, prisma };

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });

  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  });
}