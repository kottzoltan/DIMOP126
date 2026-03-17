import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { CompanyDocument } from "./index";
import { getCompanyDir } from "./index";

const ALLOWED_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "png", "jpg", "jpeg", "zip",
]);
const ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/zip",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getDocumentsDir(companyId: string): string {
  return path.join(getCompanyDir(companyId), "documents");
}

function getDocumentsIndexPath(companyId: string): string {
  return path.join(getDocumentsDir(companyId), "index.json");
}

export function isAllowedDocument(originalName: string, mimeType: string, size: number): boolean {
  const ext = path.extname(originalName).slice(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return false;
  if (!ALLOWED_MIMES.has(mimeType)) return false;
  if (size > MAX_FILE_SIZE) return false;
  return true;
}

async function loadDocumentsIndex(companyId: string): Promise<CompanyDocument[]> {
  const p = getDocumentsIndexPath(companyId);
  try {
    const data = await fs.readFile(p, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveDocumentsIndex(companyId: string, docs: CompanyDocument[]): Promise<void> {
  const dir = getDocumentsDir(companyId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(getDocumentsIndexPath(companyId), JSON.stringify(docs, null, 2));
}

export async function listDocuments(companyId: string): Promise<CompanyDocument[]> {
  return loadDocumentsIndex(companyId);
}

export async function addDocument(
  companyId: string,
  originalName: string,
  mimeType: string,
  size: number,
  buffer: Buffer
): Promise<CompanyDocument> {
  if (!isAllowedDocument(originalName, mimeType, size)) {
    throw new Error("Tiltott fájltípus vagy méret");
  }
  const dir = getDocumentsDir(companyId);
  await fs.mkdir(dir, { recursive: true });
  const id = uuidv4();
  const ext = path.extname(originalName) || "";
  const safeName = `${id}${ext}`;
  const filePath = path.join(dir, safeName);
  await fs.writeFile(filePath, buffer);
  const doc: CompanyDocument = {
    id,
    companyId,
    originalName,
    mimeType,
    size,
    path: filePath,
    createdAt: new Date().toISOString(),
  };
  const docs = await loadDocumentsIndex(companyId);
  docs.push(doc);
  await saveDocumentsIndex(companyId, docs);
  return doc;
}

export async function getDocument(companyId: string, documentId: string): Promise<CompanyDocument | null> {
  const docs = await loadDocumentsIndex(companyId);
  return docs.find((d) => d.id === documentId) ?? null;
}

export async function deleteDocument(companyId: string, documentId: string): Promise<boolean> {
  const doc = await getDocument(companyId, documentId);
  if (!doc) return false;
  try {
    await fs.unlink(doc.path);
  } catch {}
  const docs = await loadDocumentsIndex(companyId);
  const filtered = docs.filter((d) => d.id !== documentId);
  await saveDocumentsIndex(companyId, filtered);
  return true;
}
