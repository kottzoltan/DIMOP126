import { NextRequest, NextResponse } from "next/server";
import { getCompany, updateCompany } from "@/lib/storage";
import { recalcWorkbook, readBudgetPreview } from "@/lib/workbook";
import { getWorkbookPath } from "@/lib/storage";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  const wbPath = getWorkbookPath(id);
  const ok = await recalcWorkbook(wbPath);
  if (ok) {
    await updateCompany(id, { lastCalculatedAt: new Date().toISOString() });
  }
  const preview = await readBudgetPreview(id);
  return NextResponse.json({ budgetPreview: preview, recalculated: ok });
}
