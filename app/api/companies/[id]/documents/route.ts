import { NextRequest, NextResponse } from "next/server";
import { getCompany } from "@/lib/storage";
import {
  listDocuments,
  addDocument,
  isAllowedDocument,
} from "@/lib/storage/documents";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  const docs = await listDocuments(id);
  return NextResponse.json(docs);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) return NextResponse.json({ error: "Cég nem található" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fájl megadása kötelező" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalName = file.name;
  const mimeType = file.type || "application/octet-stream";
  const size = file.size;

  if (!isAllowedDocument(originalName, mimeType, size)) {
    return NextResponse.json(
      { error: "Tiltott fájltípus vagy túl nagy méret (max 10 MB)" },
      { status: 400 }
    );
  }

  try {
    const doc = await addDocument(id, originalName, mimeType, size, buffer);
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Feltöltés sikertelen" },
      { status: 500 }
    );
  }
}
