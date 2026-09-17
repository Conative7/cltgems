"use client";

import { FormEvent, useCallback, useState } from "react";
import { Download, Lock, RefreshCw } from "lucide-react";

type LeadRow = {
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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function toCsv(leads: LeadRow[]): string {
  const headers = [
    "createdAt",
    "business",
    "website",
    "email",
    "phone",
    "city",
    "mapsUrl",
    "score",
    "emailed",
    "overview",
    "bullets",
  ];
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const L of leads) {
    lines.push(
      [
        L.createdAt,
        L.business,
        L.website,
        L.email,
        L.phone,
        L.city,
        L.mapsUrl,
        String(L.score),
        String(L.emailed),
        L.overview,
        (L.bullets || []).join(" | "),
      ]
        .map(escape)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function LeadsTable() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(
    async (pw: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/leads", {
          headers: {
            Accept: "application/json",
            "x-leads-password": pw,
          },
        });
        const data = (await res.json()) as { ok?: boolean; error?: string; leads?: LeadRow[] };
        if (!res.ok || !data.ok) {
          setError(data.error || "Wrong password or server error.");
          setAuthed(false);
          setLeads([]);
          return;
        }
        setLeads(data.leads || []);
        setAuthed(true);
      } catch {
        setError("Network error loading leads.");
        setAuthed(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  function onUnlock(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Enter the leads password.");
      return;
    }
    void fetchLeads(password.trim());
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aibloom-check-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <form onSubmit={onUnlock} className="card max-w-md mx-auto p-6 space-y-4">
        <div className="flex items-center gap-2 text-gem-dark font-display font-extrabold text-lg">
          <Lock className="h-5 w-5" />
          Leads tracker
        </div>
        <p className="text-sm text-muted">
          Password-gated list of Free Google check submissions. Default password is{" "}
          <code className="text-ink">aibloom</code> (override with{" "}
          <code className="text-ink">LEADS_PASSWORD</code>).
        </p>
        <div>
          <label className="block text-sm font-bold text-ink">Password</label>
          <input
            type="password"
            className="input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink">Captured leads</h2>
          <p className="text-sm text-muted">{leads.length} shown (max 200)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-secondary text-sm"
            onClick={() => void fetchLeads(password)}
            disabled={loading}
          >
            <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
            Refresh
          </button>
          <button type="button" className="btn btn-primary text-sm" onClick={downloadCsv} disabled={!leads.length}>
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-stone-700 leading-relaxed">
        <strong className="text-ink">Durability note:</strong> Formspree inbox (
        hello.aibloom@outlook.com) is the reliable backup. Serverless <code>/tmp</code> may reset on
        cold starts — set <code className="text-ink">LEADS_WEBHOOK_URL</code> (Make/Zapier/Sheets) for a
        durable CRM copy.
      </div>

      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-stone-50 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-2.5 font-bold">Date (ET)</th>
              <th className="px-3 py-2.5 font-bold">Business</th>
              <th className="px-3 py-2.5 font-bold">Website</th>
              <th className="px-3 py-2.5 font-bold">Email</th>
              <th className="px-3 py-2.5 font-bold">Phone</th>
              <th className="px-3 py-2.5 font-bold">Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  No leads stored on this instance yet. New /check submissions will appear here when
                  /tmp is writable.
                </td>
              </tr>
            ) : (
              leads.map((L) => (
                <tr key={L.id} className="border-b border-border last:border-0 hover:bg-gem-mist/40">
                  <td className="px-3 py-2.5 whitespace-nowrap text-stone-600">{formatDate(L.createdAt)}</td>
                  <td className="px-3 py-2.5 font-semibold text-ink">{L.business}</td>
                  <td className="px-3 py-2.5 max-w-[180px] truncate">
                    <a
                      href={L.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gem font-semibold hover:underline"
                    >
                      {L.website}
                    </a>
                  </td>
                  <td className="px-3 py-2.5">
                    <a href={`mailto:${L.email}`} className="hover:underline">
                      {L.email}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{L.phone}</td>
                  <td className="px-3 py-2.5">
                    <span className="badge badge-gem">{L.score}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
