"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { openOutlookDraft } from "@/lib/notifyEmail";

const PACKAGES = [
  { id: "neighborhood", label: "Neighborhood List — $49" },
  { id: "hot", label: "Hot Lead Pack — $97 (best starter)" },
  { id: "metro", label: "Metro Sweep — $197" },
  { id: "custom", label: "Custom task — quote from $97" },
] as const;

const SERVICES = [
  { id: "maps", label: "Local business leads (Google Maps)" },
  { id: "noweb", label: "No-website / weak listing leads" },
  { id: "reviews", label: "Review-pain / reputation intel" },
  { id: "emails", label: "Leads + public contact enrichment" },
] as const;

export function LeadRequestForm({ defaultService = "maps" }: { defaultService?: string }) {
  const [service, setService] = useState(defaultService);
  const [pkg, setPkg] = useState("hot");
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("Charlotte, NC");
  const [limit, setLimit] = useState("100");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");

  const draft = useMemo(() => {
    const pkgLabel = PACKAGES.find((p) => p.id === pkg)?.label ?? pkg;
    const serviceLabel = SERVICES.find((s) => s.id === service)?.label ?? service;
    const subject = `Lead order — ${pkgLabel}`;
    const body = [
      "Hi AI Bloom,",
      "",
      "I'd like to order a lead list.",
      "",
      `My name: ${name || "(add your name)"}`,
      `Service: ${serviceLabel}`,
      `Package: ${pkgLabel}`,
      `Niche / category: ${niche || "(e.g. HVAC, roofers, dentists)"}`,
      `Location: ${location || "(e.g. Charlotte, NC)"}`,
      `Approx. how many: ${limit}`,
      `Notes: ${notes || "(optional)"}`,
      "",
      "Please confirm price and turnaround. Thanks!",
    ].join("\n");
    return { subject, body };
  }, [service, pkg, niche, location, limit, notes, name]);

  return (
    <form
      className="card space-y-4 p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        openOutlookDraft(draft.subject, draft.body);
      }}
    >
      <div>
        <label className="block text-sm font-bold text-ink">What do you need?</label>
        <select
          className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-ink">Niche / category</label>
          <input
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
            placeholder="e.g. HVAC contractor"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink">Location</label>
          <input
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
            placeholder="Charlotte, NC"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-ink">Package</label>
          <select
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
          >
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-ink">About how many leads?</label>
          <input
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
            inputMode="numeric"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-ink">Your name</label>
        <input
          className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-ink">Notes (optional)</label>
        <textarea
          className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm min-h-20"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. only no-website, skip national chains"
        />
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Opens your email to send the order to AI Bloom. We confirm price, run the pull, then invoice you
        (free Invoice Library). No subscription.
      </p>

      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        Request this lead list <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
