import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(request: NextRequest): Promise<{ id: string; role: string } | null> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "dimop126-secret-change-in-production",
  });
  if (!token?.id) return null;
  return { id: token.id as string, role: (token.role as string) || "editor" };
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
