import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1️⃣ Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2️⃣ Directory to start scanning
const projectDir = path.resolve(__dirname); // Change if needed
const outputFile = path.join(projectDir, "all_code_combined.ts"); // Output file

// 3️⃣ Folders to ignore
const ignoreDirs = ["node_modules", ".git", "dist", "build"];

// 4️⃣ Helper function to get all .ts and .tsx files recursively
function getAllTSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        results = results.concat(getAllTSFiles(filePath));
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(filePath);
    }
  }

  return results;
}

// 5️⃣ Get all files
const tsFiles = getAllTSFiles(projectDir);

// 6️⃣ Combine all content
let combinedContent = "";
for (const file of tsFiles) {
  const content = fs.readFileSync(file, "utf-8");
  combinedContent += `\n\n// ===== File: ${path.relative(projectDir, file)} =====\n\n`;
  combinedContent += content;
}

// 7️⃣ Write to single file
fs.writeFileSync(outputFile, combinedContent, "utf-8");
console.log(`✅ Combined ${tsFiles.length} files into ${outputFile}`);