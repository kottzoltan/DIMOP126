import { NextRequest, NextResponse } from "next/server";
import { createCompany, saveFormData } from "@/lib/storage";
import { copyTemplateToCompany, applyFormDataToWorkbook } from "@/lib/workbook";
import { getDefaultFormData } from "@/lib/defaultFormData";
import { prepareFormDataForWorkbook } from "@/lib/prepareFormDataForWorkbook";

export async function GET() {
  const { listCompanies } = await import("@/lib/storage");
  const companies = await listCompanies();
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = body?.name as string;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Név megadása kötelező" }, { status: 400 });
  }
  const company = await createCompany(name.trim());
  try {
    await copyTemplateToCompany(company.id);
    const defaultForm = getDefaultFormData();
    await saveFormData(company.id, defaultForm);
    const prepared = prepareFormDataForWorkbook(defaultForm);
    await applyFormDataToWorkbook(company.id, prepared);
  } catch (e) {
    console.error("Template copy failed:", e);
    return NextResponse.json(
      { error: "A sablon másolása sikertelen. Ellenőrizze a template mappát." },
      { status: 500 }
    );
  }
  return NextResponse.json(company);
}
