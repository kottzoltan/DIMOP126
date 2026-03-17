import { NextRequest, NextResponse } from "next/server";
import { getCompany, updateCompany } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  return NextResponse.json(company);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Cég nem található" }, { status: 404 });
  }
  const body = await request.json();
  const updates: Parameters<typeof updateCompany>[1] = {};
  if (body?.name != null) updates.name = body.name;
  if (body?.status != null) updates.status = body.status;
  if (body?.vatMode === "VAT" || body?.vatMode === "AAM") updates.vatMode = body.vatMode;
  const updated = await updateCompany(id, updates);
  return NextResponse.json(updated);
}
