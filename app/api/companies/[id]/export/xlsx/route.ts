import { NextRequest, NextResponse } from "next/server";
import { getCompany } from "@/lib/storage";
import { getWorkbookPath } from "@/lib/storage";
import fs from "fs/promises";

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
  try {
    await fs.access(wbPath);
  } catch {
    return NextResponse.json({ error: "Workbook nem található" }, { status: 404 });
  }
  const buf = await fs.readFile(wbPath);
  const filename = `${company.slug || company.id}-palyazat.xlsx`;
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
