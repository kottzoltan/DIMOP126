import { NextRequest, NextResponse } from "next/server";
import { getCompany, getFormData, saveFormData, updateCompany } from "@/lib/storage";
import { applyFormDataToWorkbook, readBudgetPreview, recalcWorkbook } from "@/lib/workbook";
import { getWorkbookPath } from "@/lib/storage";
import { prepareFormDataForWorkbook } from "@/lib/prepareFormDataForWorkbook";

const VALID_VAT = new Set(["VAT", "AAM"]);
const EDITABLE_KEYS = new Set([
  "alap_dii_felmérés", "alap_dfk_megvan", "alap_dfk_vallalja", "alap_30mbps", "alap_50pct_internet",
  "alap_tavoli_hozzaferes", "alap_online_megbeszeles", "alap_ikt_kepzes", "alap_ikt_szakember", "alap_ikt_biztonsag",
  "alap_3_ikt_intézkedes", "alap_ikt_gyakorlat", "alap_weboldal", "alap_kozossegi_media", "alap_2_tipusu_media",
  "alap_felho", "alap_fejlett_felho", "alap_erp", "alap_crm", "alap_adatanalitika", "alap_mi", "alap_robot",
  "alap_iot", "alap_e_szamlak", "alap_webes_ertekesites", "alap_elektronikus_ertekesites",
  "alap_alkalmazotti_letszam", "alap_projekt_honap",
  "hw_szamitogep", "hw_monitor", "hw_laptop", "hw_nas", "hw_router", "hw_mobil", "hw_tablet", "hw_nyomtato",
]);
for (let r = 5; r <= 39; r++) {
  EDITABLE_KEYS.add(`sw_figyelembe_${r}`);
  EDITABLE_KEYS.add(`sw_mennyiseg_${r}`);
  EDITABLE_KEYS.add(`sw_mennyiseg_${r}_overridden`);
}

function filterFormData(body: Record<string, unknown>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (EDITABLE_KEYS.has(k)) filtered[k] = v;
  }
  return filtered;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  const formData = await getFormData(id);
  return NextResponse.json({ company, formData });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const formData = filterFormData(body);
  if (body.vatMode !== undefined && VALID_VAT.has(body.vatMode as string)) {
    await updateCompany(id, { vatMode: body.vatMode as "VAT" | "AAM" });
  }
  await saveFormData(id, formData);
  const prepared = prepareFormDataForWorkbook(formData);
  try {
    await applyFormDataToWorkbook(id, prepared);
    const wbPath = getWorkbookPath(id);
    await recalcWorkbook(wbPath);
    await updateCompany(id, { lastCalculatedAt: new Date().toISOString() });
  } catch (e) {
    console.error("Apply/recalc failed:", e);
    return NextResponse.json(
      { error: "Mentés sikertelen. Ellenőrizze a Python/openpyxl és a template elérését." },
      { status: 500 }
    );
  }
  const preview = await readBudgetPreview(id);
  return NextResponse.json({ formData, budgetPreview: preview });
}
