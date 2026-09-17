import { NextRequest, NextResponse } from "next/server";
import { listLeads } from "@/lib/check/leadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function expectedPassword(): string {
  return process.env.LEADS_PASSWORD?.trim() || "aibloom";
}

function authorized(req: NextRequest): boolean {
  const header = req.headers.get("x-leads-password") || "";
  const query = req.nextUrl.searchParams.get("password") || "";
  const expected = expectedPassword();
  return header === expected || query === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const leads = await listLeads(200);
  return NextResponse.json({ ok: true, leads });
}
