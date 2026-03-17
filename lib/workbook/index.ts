import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { EDITABLE_FIELDS } from "@/config/editableFields";
import {
  getTemplatePath,
  getWorkbookPath,
  ensureDataDir,
} from "@/lib/storage";

const execAsync = promisify(exec);

const PYTHON_SCRIPT = path.join(process.cwd(), "scripts", "python", "workbook_service.py");

function getCellMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const f of EDITABLE_FIELDS) {
    map[f.key] = `${f.sheet}!${f.cell}`;
  }
  return map;
}

export async function copyTemplateToCompany(companyId: string): Promise<string> {
  await ensureDataDir();
  const templatePath = getTemplatePath();
  const targetPath = getWorkbookPath(companyId);
  await execAsync(
    `python3 "${PYTHON_SCRIPT}" copy --template "${templatePath}" --target "${targetPath}"`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  return targetPath;
}

export async function applyFormDataToWorkbook(
  companyId: string,
  formData: Record<string, unknown>
): Promise<void> {
  const workbookPath = getWorkbookPath(companyId);
  const cellMap = getCellMap();
  const tmpDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(tmpDir, { recursive: true });
  const formDataPath = path.join(tmpDir, `form-${Date.now()}.json`);
  const cellMapPath = path.join(tmpDir, `map-${Date.now()}.json`);
  await fs.writeFile(formDataPath, JSON.stringify(formData));
  await fs.writeFile(cellMapPath, JSON.stringify(cellMap));
  try {
    await execAsync(
      `python3 "${PYTHON_SCRIPT}" apply --workbook "${workbookPath}" --form-data-file "${formDataPath}" --cell-map-file "${cellMapPath}"`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
  } finally {
    await fs.unlink(formDataPath).catch(() => {});
    await fs.unlink(cellMapPath).catch(() => {});
  }
}

/** Recalculate workbook using LibreOffice headless. Falls back to no-op if LO not installed. */
export async function recalcWorkbook(workbookPath: string): Promise<boolean> {
  try {
    const dir = path.dirname(workbookPath);
    await execAsync(
      `soffice --headless --convert-to xlsx --outdir "${dir}" "${workbookPath}"`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    return true;
  } catch {
    return false;
  }
}

export async function readBudgetPreview(companyId: string): Promise<Record<string, number | null>> {
  const workbookPath = getWorkbookPath(companyId);
  try {
    const { stdout } = await execAsync(
      `python3 "${PYTHON_SCRIPT}" preview --workbook "${workbookPath}"`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    return JSON.parse(stdout.trim());
  } catch {
    return {};
  }
}
