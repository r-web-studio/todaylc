const { execSync, spawn } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

function run(cmd, label) {
  console.log(`[server] ${label}...`);
  try {
    execSync(cmd, { stdio: "inherit", cwd: __dirname });
    console.log(`[server] ${label} OK`);
  } catch (e) {
    console.error(`[server] ${label} FAILED:`, e.message);
    process.exit(1);
  }
}

async function main() {
  if (process.env.DATABASE_URL) {
    run("npx prisma migrate deploy", "Running migrations");
    run("node prisma/seed.js", "Seeding database");
  }

  const nextBin = path.join(__dirname, "node_modules", "next", "dist", "bin", "next");
  console.log(`[server] Starting Next.js on ${HOST}:${PORT}`);
  const child = spawn("node", [nextBin, "start", "-p", String(PORT), "-H", HOST], {
    stdio: "inherit",
    env: { ...process.env },
    cwd: __dirname,
  });
  child.on("exit", (code) => process.exit(code));
}

main().catch((e) => { console.error(e); process.exit(1); });
