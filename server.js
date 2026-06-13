const path = require("path");
const { spawn } = require("child_process");
const { execSync } = require("child_process");
const next = require("next");
const { app } = require("./backend/src/index");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = "0.0.0.0";

function run(cmd, label) {
  console.log(`[deploy] ${label}...`);
  try {
    execSync(cmd, { stdio: "inherit", cwd: __dirname });
    console.log(`[deploy] ${label} OK`);
  } catch (e) {
    console.error(`[deploy] ${label} FAILED:`, e.message);
    process.exit(1);
  }
}

async function main() {
  // Run DB migrations + seed at startup
  if (process.env.DATABASE_URL) {
    run("npx prisma migrate deploy", "Running migrations");
    run("node prisma/seed.js", "Seeding database");
  }

  // Prepare Next.js (production mode)
  const nextApp = next({ dev: false });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  // All non-API routes go to Next.js
  app.all("*", (req, res) => handle(req, res));

  // Start Telegram bot as child process (non-blocking)
  const botDir = path.join(__dirname, "tbot");
  const bot = spawn("python3", ["main.py"], {
    cwd: botDir,
    stdio: "inherit",
    env: { ...process.env, RENDER_EXTERNAL_URL: "" },
  });
  bot.on("error", (err) => console.log("[deploy] Telegram bot unavailable:", err.message));
  bot.on("spawn", () => console.log("[deploy] Telegram bot started"));
  bot.on("exit", (code) => console.log(`[deploy] Telegram bot exited (code ${code})`));

  // Start the combined server
  app.listen(PORT, HOST, () => {
    console.log(`[deploy] Server running on ${HOST}:${PORT}`);
  });
}

main().catch((e) => {
  console.error("[deploy] Fatal error:", e);
  process.exit(1);
});
