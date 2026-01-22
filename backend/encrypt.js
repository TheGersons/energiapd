import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const INPUT_DIR = "./src/encyptedFiles";
const OUTPUT_DIR = "./src/encyptedFiles/encrypt/";

function findPDFs(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPDFs(fullPath, results);
    } else if (
      entry.isFile() &&
      path.extname(entry.name).toLowerCase() === ".pdf"
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

function encryptPDF(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "--encrypt",
      "--owner-password=$M*w8vRJ0FUdEH@1V^c2yPW2ZRS02YERGxFr8envvRqg3hz7#Y3ZUk%VsRhEvsQ!",
      "--bits=256",
      "--print=full",
      "--modify=none",
      "--extract=n",
      "--annotate=y",
      "--form=n",
      "--assemble=n",
      "--",
      inputPath,
      outputPath,
    ];

    const qpdf = spawn("qpdf", args);

    qpdf.stderr.on("data", (data) => {
      console.error(`❌ Error (${inputPath}): ${data}`);
    });

    qpdf.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ Protegido: ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`qpdf failed with code ${code}`));
      }
    });
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const pdfs = findPDFs(INPUT_DIR);
  console.log(`🔍 Encontrados ${pdfs.length} PDF(s). Protegiendo...`);

  for (const pdf of pdfs) {
    const relative = path.relative(INPUT_DIR, pdf);
    const output = path.join(OUTPUT_DIR, relative);
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      await encryptPDF(pdf, output);
    } catch (err) {
      console.error(`❌ Error al proteger ${pdf}:`, err.message);
    }
  }

  console.log("🎉 Proceso completado.");
}

main().catch(console.error);
