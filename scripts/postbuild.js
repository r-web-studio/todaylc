const fs = require("fs");
const path = require("path");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

console.log("Copying public/ to standalone output...");
copyRecursive("public", ".next/standalone/public");

console.log("Copying .next/static/ to standalone output...");
copyRecursive(".next/static", ".next/standalone/.next/static");

console.log("Standalone output ready.");
