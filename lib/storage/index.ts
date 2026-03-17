import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");
const COMPANIES_DIR = path.join(DATA_DIR, "companies");
const COMPANIES_JSON = path.join(DATA_DIR, "companies.json");
const TEMPLATE_PATH = path.join(process.cwd(), "template", "DIMOP126B végleges, kalkulátor_v1.xlsx");

export type CompanyStatus = "draft" | "completed" | "exported";
export type VatMode = "VAT" | "AAM";

export interface Company {
  id: string;
  name: string;
  slug: string;
  status: CompanyStatus;
  vatMode?: VatMode;
  createdAt: string;
  updatedAt: string;
  workbookPath?: string;
  pdfPath?: string;
  lastCalculatedAt?: string;
  templateVersion?: string;
}

export interface CompanyDocument {
  id: string;
  companyId: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface CompanyApplication {
  companyId: string;
  formDataJson: Record<string, unknown>;
  workbookPath?: string;
  pdfPath?: string;
  lastCalculatedAt?: string;
}

export async function ensureDataDir(): Promise<void> {
  await fs.mkdir(COMPANIES_DIR, { recursive: true });
  try {
    await fs.access(COMPANIES_JSON);
  } catch {
    await fs.writeFile(COMPANIES_JSON, JSON.stringify([]));
  }
}

export function getTemplatePath(): string {
  return TEMPLATE_PATH;
}

export function getCompanyDir(companyId: string): string {
  return path.join(COMPANIES_DIR, companyId);
}

export function getWorkbookPath(companyId: string): string {
  return path.join(getCompanyDir(companyId), "application.xlsx");
}

export function getPdfPath(companyId: string): string {
  return path.join(getCompanyDir(companyId), "application.pdf");
}

export function getFormDataPath(companyId: string): string {
  return path.join(getCompanyDir(companyId), "form-data.json");
}

export async function listCompanies(): Promise<Company[]> {
  await ensureDataDir();
  const data = await fs.readFile(COMPANIES_JSON, "utf-8");
  return JSON.parse(data);
}

export async function getCompany(id: string): Promise<Company | null> {
  const companies = await listCompanies();
  return companies.find((c) => c.id === id) ?? null;
}

export async function createCompany(name: string): Promise<Company> {
  await ensureDataDir();
  const companies = await listCompanies();
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `company-${Date.now()}`;
  const company: Company = {
    id: uuidv4(),
    name,
    slug,
    status: "draft",
    vatMode: "VAT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  companies.push(company);
  await fs.writeFile(COMPANIES_JSON, JSON.stringify(companies, null, 2));
  await fs.mkdir(getCompanyDir(company.id), { recursive: true });
  return company;
}

export async function updateCompany(
  id: string,
  updates: Partial<Pick<Company, "name" | "status" | "vatMode" | "workbookPath" | "pdfPath" | "lastCalculatedAt">>
): Promise<Company | null> {
  const companies = await listCompanies();
  const idx = companies.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  companies[idx] = {
    ...companies[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(COMPANIES_JSON, JSON.stringify(companies, null, 2));
  return companies[idx];
}

export async function getFormData(companyId: string): Promise<Record<string, unknown>> {
  const p = getFormDataPath(companyId);
  try {
    const data = await fs.readFile(p, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function saveFormData(companyId: string, formData: Record<string, unknown>): Promise<void> {
  await fs.mkdir(getCompanyDir(companyId), { recursive: true });
  await fs.writeFile(getFormDataPath(companyId), JSON.stringify(formData, null, 2));
}
