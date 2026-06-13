const { spawn, execSync } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 3000;
const STANDALONE = path.join(__dirname, ".next", "standalone", "server.js");

if (process.env.DATABASE_URL) {
  console.log("[server] Running migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: __dirname });
  console.log("[server] Seeding database...");
  execSync("node prisma/seed.js", { stdio: "inherit", cwd: __dirname });
}

const bot = spawn("python", ["main.py"], {
  cwd: path.join(__dirname, "tbot"),
  stdio: "inherit",
  env: { ...process.env, RENDER_EXTERNAL_URL: "" },
});
bot.on("error", () => {});

console.log(`[server] Starting Next.js standalone on 0.0.0.0:${PORT}`);
const server = spawn("node", [STANDALONE], {
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT), HOSTNAME: "0.0.0.0" },
  cwd: path.join(__dirname, ".next", "standalone"),
});
server.on("exit", (code) => process.exit(code));
