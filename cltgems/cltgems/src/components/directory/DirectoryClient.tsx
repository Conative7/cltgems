"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  CERTIFICATIONS,
  SAMPLE_LISTINGS,
  type Category,
  type Certification,
} from "@/data/listings";
import { ExternalLink, Phone } from "lucide-react";

export function DirectoryClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState<Category | "">("");
  const [cert, setCert] = useState<Certification | "">("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SAMPLE_LISTINGS.filter((item) => {
      if (category && item.category !== category) return false;
      if (cert && !item.certifications.includes(cert)) return false;
      if (!needle) return true;
      const hay = [
        item.name,
        item.category,
        item.area,
        item.blurb,
        ...item.certifications,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, category, cert]);

  return (
    <div className="space-y-6">
      <div className="card border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <span className="badge badge-demo mr-2">Demo listings</span>
        Sample data for MVP — replace with your live Charlotte directory. Not verified live counts.
      </div>

      <div className="card p-4 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="label">Search</label>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, area, tag…"
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Certification</label>
          <select
            className="input"
            value={cert}
            onChange={(e) => setCert(e.target.value as Certification | "")}
          >
            <option value="">All certifications</option>
            {CERTIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted">
        Showing <strong className="text-ink">{filtered.length}</strong> of {SAMPLE_LISTINGS.length} demo listings
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => (
          <li key={item.id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">{item.name}</h2>
                <p className="text-sm text-muted">
                  {item.category} · {item.area}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed flex-1">{item.blurb}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.certifications.map((c) => (
                <li key={c} className="badge badge-gem">
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {item.phone ? (
                <a href={"tel:" + item.phone.replace(/[^\d+]/g, "")} className="inline-flex items-center gap-1 font-semibold text-gem">
                  <Phone className="h-3.5 w-3.5" /> {item.phone}
                </a>
              ) : null}
              {item.website ? (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-gem"
                >
                  Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-muted py-10">No listings match those filters. Try clearing search or filters.</p>
      ) : null}
    </div>
  );
}
