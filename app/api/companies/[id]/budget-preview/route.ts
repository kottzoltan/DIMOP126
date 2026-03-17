import { NextRequest, NextResponse } from "next/server";
import { getCompany } from "@/lib/storage";
import { readBudgetPreview } from "@/lib/workbook";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  const preview = await readBudgetPreview(id);
  return NextResponse.json(preview);
}
