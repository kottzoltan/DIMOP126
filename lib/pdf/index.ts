import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);
const PDF_SCRIPT = path.join(process.cwd(), "scripts", "python", "pdf_export.py");

export async function exportToPdf(workbookPath: string, outDir?: string): Promise<string> {
  const out = outDir ?? path.dirname(workbookPath);
  const { stdout } = await execAsync(
    `python3 "${PDF_SCRIPT}" "${workbookPath}" "${out}"`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  return stdout.trim();
}
