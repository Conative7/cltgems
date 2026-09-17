import { randomUUID } from "crypto";
import { promises as fs } from "fs";

export type CheckLead = {
  id: string;
  createdAt: string;
  business: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  mapsUrl: string;
  score: number;
  overview: string;
  bullets: string[];
  emailed: boolean;
};

const STORE_PATH = "/tmp/aibloom-check-leads.json";
const MAX_LEADS = 200;

async function readAll(): Promise<CheckLead[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const data = JSON.parse(raw) as CheckLead[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(leads: CheckLead[]): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(leads, null, 2), "utf8");
}

async function maybeWebhook(lead: CheckLead): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(lead),
    });
  } catch {
    /* best-effort */
  }
}

export async function appendLead(
  input: Omit<CheckLead, "id" | "createdAt"> & { id?: string; createdAt?: string }
): Promise<CheckLead> {
  const lead: CheckLead = {
    id: input.id || randomUUID(),
    createdAt: input.createdAt || new Date().toISOString(),
    business: input.business,
    website: input.website,
    email: input.email,
    phone: input.phone,
    city: input.city,
    mapsUrl: input.mapsUrl,
    score: input.score,
    overview: input.overview,
    bullets: input.bullets,
    emailed: input.emailed,
  };

  try {
    const existing = await readAll();
    existing.unshift(lead);
    await writeAll(existing.slice(0, MAX_LEADS));
  } catch {
    /* /tmp may be unavailable in some runtimes — Formspree is the backup */
  }

  void maybeWebhook(lead);
  return lead;
}

export async function listLeads(max = MAX_LEADS): Promise<CheckLead[]> {
  const all = await readAll();
  return all.slice(0, Math.min(max, MAX_LEADS));
}
