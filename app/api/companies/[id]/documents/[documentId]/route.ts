import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getCompany } from "@/lib/storage";
import { getDocument, deleteDocument } from "@/lib/storage/documents";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const { id, documentId } = await params;
  const company = await getCompany(id);
  if (!company) return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  const doc = await getDocument(id, documentId);
  if (!doc) return NextResponse.json({ error: "Dokumentum nem található" }, { status: 404 });
  try {
    const buf = await fs.readFile(doc.path);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${doc.originalName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Fájl olvasása sikertelen" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const { id, documentId } = await params;
  const company = await getCompany(id);
  if (!company) return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  const ok = await deleteDocument(id, documentId);
  if (!ok) return NextResponse.json({ error: "Dokumentum nem található" }, { status: 404 });
  return NextResponse.json({ success: true });
}
