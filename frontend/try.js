import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1️⃣ Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2️⃣ Directory to scan
const projectDir = path.resolve(__dirname); // change if needed
const outputFile = path.join(projectDir, "all_code_combined.ts");

// 3️⃣ Config (🔥 fully customizable)
const config = {
  ignoreDirs: new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "out",
    "coverage",
    "public",
    "components"
  ]),

  ignoreFiles: new Set([
    ".env",
    ".env.local",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
  ]),

  ignorePatterns: [
    ".test.ts",
    ".spec.ts",
    ".d.ts",
  ],
};

// 4️⃣ Ignore checker
function shouldIgnore(file, isDir) {
  if (isDir && config.ignoreDirs.has(file)) return true;

  if (!isDir && config.ignoreFiles.has(file)) return true;

  if (!isDir && config.ignorePatterns.some(p => file.endsWith(p))) return true;

  return false;
}

// 5️⃣ Get all TS/TSX files recursively
function getAllTSFiles(dir) {
  let results = [];

  let list;
  try {
    list = fs.readdirSync(dir);
  } catch {
    return results; // skip inaccessible dirs
  }

  for (const file of list) {
    const filePath = path.join(dir, file);

    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      continue; // skip broken symlinks / permission issues
    }

    if (shouldIgnore(file, stat.isDirectory())) continue;

    if (stat.isDirectory()) {
      results = results.concat(getAllTSFiles(filePath));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(filePath);
    }
  }

  return results;
}

// 6️⃣ Collect files
const tsFiles = getAllTSFiles(projectDir);

// 7️⃣ Combine content
let combinedContent = "";

for (const file of tsFiles) {
  try {
    const content = fs.readFileSync(file, "utf-8");

    combinedContent += `\n\n// ===== File: ${path.relative(projectDir, file)} =====\n\n`;
    combinedContent += content;
  } catch {
    console.warn(`⚠️ Skipped: ${file}`);
  }
}

// 8️⃣ Write output
fs.writeFileSync(outputFile, combinedContent, "utf-8");

console.log(`✅ Combined ${tsFiles.length} files into ${outputFile}`);