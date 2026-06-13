const { spawn, execSync } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 3000;

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

const next = spawn("node", [
  path.join(__dirname, "node_modules", "next", "dist", "bin", "next"),
  "start", "-p", String(PORT), "-H", "0.0.0.0",
], { stdio: "inherit", env: { ...process.env }, cwd: __dirname });

next.on("exit", (code) => process.exit(code));
