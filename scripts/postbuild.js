const fs = require("fs");
const path = require("path");

function copy(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    e.isDirectory() ? copy(s, d) : fs.copyFileSync(s, d);
  }
}

const base = path.join(__dirname, "..");
const out = path.join(base, ".next", "standalone");

console.log("Copying public/ → .next/standalone/public");
copy(path.join(base, "public"), path.join(out, "public"));

console.log("Copying .next/static/ → .next/standalone/.next/static");
copy(path.join(base, ".next", "static"), path.join(out, ".next", "static"));

console.log("Standalone output ready.");
