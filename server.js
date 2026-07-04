const http = require("http");
const { spawn, execSync } = require("child_process");
const path = require("path");
const next = require("next");

const PORT = parseInt(process.env.PORT, 10) || 3000;

// Run DB migrations at startup
if (process.env.DATABASE_URL) {
  console.log("[server] Running migrations...");
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: __dirname });
    console.log("[server] Migrations completed successfully.");
  } catch (err) {
    console.error("[server] Migration failed:", err.message);
  }
}

// Start Telegram bot (non-blocking)
const bot = spawn("python", ["main.py"], {
  cwd: path.join(__dirname, "tbot"),
  stdio: "inherit",
  env: { ...process.env, RENDER_EXTERNAL_URL: "" },
});
bot.on("error", (err) => {
  console.error("[server] Bot failed to start:", err.message);
});
bot.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[server] Bot exited with code ${code}`);
  }
});

// Prepare and start Next.js in production mode
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] Production server running on 0.0.0.0:${PORT}`);
  });
});
