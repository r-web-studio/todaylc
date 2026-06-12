const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || "0.0.0.0";
const standaloneDir = path.join(__dirname, ".next", "standalone");
const serverScript = path.join(standaloneDir, "server.js");

async function main() {
  // Run migrations if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    console.log("[start.js] Running Prisma migrations...");
    try {
      require("child_process").execSync("npx prisma migrate deploy", {
        cwd: __dirname,
        stdio: "inherit",
        env: { ...process.env },
      });
    } catch (err) {
      console.error("[start.js] Migration failed:", err.message);
      process.exit(1);
    }

    console.log("[start.js] Seeding database...");
    try {
      require("child_process").execSync("node prisma/seed.js", {
        cwd: __dirname,
        stdio: "inherit",
        env: { ...process.env },
      });
    } catch (err) {
      console.error("[start.js] Seed failed:", err.message);
      process.exit(1);
    }
  }

  if (!fs.existsSync(serverScript)) {
    console.error(`[start.js] Standalone server not found at ${serverScript}`);
    process.exit(1);
  }

  console.log(`[start.js] Starting Next.js on ${HOST}:${PORT}...`);
  const server = spawn("node", [serverScript], {
    cwd: standaloneDir,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: HOST,
    },
  });

  server.on("exit", (code) => {
    console.error(`[start.js] Server exited with code ${code}`);
    process.exit(code);
  });
}

main().catch((err) => {
  console.error("[start.js] Fatal error:", err);
  process.exit(1);
});
