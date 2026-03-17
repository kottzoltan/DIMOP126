import { NextRequest, NextResponse } from "next/server";
import { getCompany, updateCompany } from "@/lib/storage";
import { getWorkbookPath, getPdfPath } from "@/lib/storage";
import { exportToPdf } from "@/lib/pdf";
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
  try {
    const pdfPath = await exportToPdf(wbPath);
    await updateCompany(id, { pdfPath, status: "exported" });
  } catch (e) {
    console.error("PDF export failed:", e);
    return NextResponse.json(
      {
        error:
          "PDF export sikertelen. Telepítse a LibreOffice-ot: brew install --cask libreoffice",
      },
      { status: 500 }
    );
  }
  const pdfPath = getPdfPath(id);
  try {
    const buf = await fs.readFile(pdfPath);
    const filename = `${company.slug || company.id}-palyazat.pdf`;
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF fájl olvasása sikertelen" }, { status: 500 });
  }
}
