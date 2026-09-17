import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/check/analyzeWebsite";
import { appendLead } from "@/lib/check/leadStore";
import { FORMSPREE_ID, INBOX } from "@/lib/notifyEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  business?: string;
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  mapsUrl?: string;
};

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function postFormspree(fields: Record<string, string>): Promise<boolean> {
  const id = FORMSPREE_ID || "mljeynwz";
  try {
    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const business = (body.business || "").trim();
  const website = (body.website || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const city = (body.city || "Charlotte, NC").trim() || "Charlotte, NC";
  const mapsUrl = (body.mapsUrl || "").trim();

  const errors: string[] = [];
  if (!business) errors.push("Business name is required.");
  if (!website) errors.push("Website is required.");
  if (!email || !isEmail(email)) errors.push("A valid email is required.");
  if (!phone || phone.replace(/\D/g, "").length < 7) errors.push("A valid phone is required.");

  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  const teaser = await analyzeWebsite(website);

  const greatCount = teaser.great.length;
  const missingCount = teaser.missing.length;
  const fixCount = teaser.fix.length;
  const scorecardSummary = [
    `Score ${teaser.score}/100 · ${greatCount} great · ${missingCount} missing · ${fixCount} to fix`,
    teaser.overview,
    "Top priorities:",
    ...teaser.bullets.map((b, i) => `${i + 1}. ${b}`),
  ].join("\n");

  const subject = `Instant website scorecard — ${business} (score ${teaser.score})`;
  const emailed = await postFormspree({
    form: "free-google-check",
    business,
    website: teaser.normalizedUrl || website,
    email,
    phone,
    city,
    mapsUrl: mapsUrl || "(none)",
    score: String(teaser.score),
    overview: teaser.overview,
    bullets: teaser.bullets.join("\n• "),
    greatCount: String(greatCount),
    missingCount: String(missingCount),
    fixCount: String(fixCount),
    checksRun: String(teaser.checksRun),
    scorecard: scorecardSummary,
    _subject: subject,
    _replyto: email || INBOX,
  });

  const lead = await appendLead({
    business,
    website: teaser.normalizedUrl || website,
    email,
    phone,
    city,
    mapsUrl,
    score: teaser.score,
    overview: teaser.overview,
    bullets: [...teaser.bullets],
    emailed,
  });

  return NextResponse.json({
    ok: true,
    emailed,
    leadId: lead.id,
    teaser: {
      score: teaser.score,
      overview: teaser.overview,
      great: teaser.great,
      missing: teaser.missing,
      fix: teaser.fix,
      bullets: teaser.bullets,
      upsellHints: teaser.upsellHints,
      findings: teaser.findings,
      normalizedUrl: teaser.normalizedUrl,
      fetchOk: teaser.fetchOk,
      checksRun: teaser.checksRun,
    },
  });
}
