import fs from "node:fs";
import path from "node:path";

const ignored = new Set(["node_modules", ".next", ".git", ".env.example", "package-lock.json"]);
const patterns = [
  /postgres(?:ql)?:\/\/[^\s"']+:[^\s"']+@/i,
  /CLOUDINARY_API_SECRET\s*=\s*["'][^"']{8,}["']/i,
  /NEXTAUTH_SECRET\s*=\s*["'][^"']{8,}["']/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
];

let findings = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && fs.statSync(full).size < 2_000_000) {
      const text = fs.readFileSync(full, "utf8");
      for (const pattern of patterns) if (pattern.test(text)) findings.push(full);
    }
  }
}
walk(process.cwd());
if (findings.length) {
  console.error("Potential secrets found:");
  [...new Set(findings)].forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}
console.log("Secret scan passed.");
