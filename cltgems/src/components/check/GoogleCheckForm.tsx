"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flame,
  Loader2,
  MapPin,
  Sparkles,
  Target,
  Wrench,
  Zap,
} from "lucide-react";

type ScoreItem = {
  id: string;
  label: string;
  status: "great" | "missing" | "fix";
  detail: string;
  fix?: string;
  weight: number;
};

type Teaser = {
  score: number;
  overview: string;
  great: ScoreItem[];
  missing: ScoreItem[];
  fix: ScoreItem[];
  bullets: string[];
  upsellHints?: string[];
  findings?: { label: string; ok: boolean; detail: string }[];
  normalizedUrl?: string;
  fetchOk?: boolean;
  checksRun?: number;
};

type Status = "idle" | "analyzing" | "done";

const STATUS_LINES = [
  "Fetching your public homepage…",
  "Scoring what’s great…",
  "Flagging what’s missing…",
  "Pinpointing what to fix…",
  "Building your live scorecard…",
];

function scoreTone(score: number): {
  label: string;
  ring: string;
  text: string;
  bg: string;
} {
  if (score >= 75)
    return {
      label: "Strong",
      ring: "border-emerald-400",
      text: "text-emerald-700",
      bg: "from-emerald-50 to-white",
    };
  if (score >= 55)
    return {
      label: "Needs work",
      ring: "border-amber-400",
      text: "text-amber-700",
      bg: "from-amber-50 to-white",
    };
  return {
    label: "Critical",
    ring: "border-rose-400",
    text: "text-rose-700",
    bg: "from-rose-50 to-white",
  };
}

function ScoreRow({ item, tone }: { item: ScoreItem; tone: "great" | "missing" | "fix" }) {
  const tipColor =
    tone === "great"
      ? "text-emerald-800"
      : tone === "missing"
        ? "text-amber-900"
        : "text-rose-900";
  return (
    <li className="border-b border-black/5 last:border-0 py-2.5 first:pt-0 last:pb-0">
      <p className={"text-sm font-bold leading-snug " + tipColor}>{item.label}</p>
      <p className="mt-0.5 text-xs text-stone-600 leading-relaxed">{item.detail}</p>
      {item.fix && tone !== "great" ? (
        <p className="mt-1 text-xs font-semibold leading-relaxed text-stone-800">
          Fix: {item.fix}
        </p>
      ) : null}
    </li>
  );
}

export function GoogleCheckForm() {
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Charlotte, NC");
  const [mapsUrl, setMapsUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [teaser, setTeaser] = useState<Teaser | null>(null);
  const [emailed, setEmailed] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (status !== "analyzing") return;
    setLineIdx(0);
    const t = setInterval(() => {
      setLineIdx((i) => (i + 1) % STATUS_LINES.length);
    }, 1100);
    return () => clearInterval(t);
  }, [status]);

  const tone = useMemo(() => (teaser ? scoreTone(teaser.score) : null), [teaser]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!business.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!website.trim()) {
      setError("Website is required — we scan the public homepage for free.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone is required.");
      return;
    }

    setStatus("analyzing");
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          business: business.trim(),
          website: website.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim() || "Charlotte, NC",
          mapsUrl: mapsUrl.trim(),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        emailed?: boolean;
        teaser?: Teaser;
      };
      if (!res.ok || !data.ok || !data.teaser) {
        setError(data.error || "Something went wrong. Try again in a moment.");
        setStatus("idle");
        return;
      }
      setTeaser(data.teaser);
      setEmailed(Boolean(data.emailed));
      setStatus("done");
    } catch {
      setError("Network error — check your connection and try again.");
      setStatus("idle");
    }
  }

  function reset() {
    setStatus("idle");
    setTeaser(null);
    setEmailed(false);
    setError("");
  }

  if (status === "analyzing") {
    return (
      <div className="rounded-xl border border-gem/30 bg-gem-mist p-6 sm:p-8 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-gem" />
        <p className="mt-4 font-display text-xl font-extrabold text-gem-dark">
          Building your instant scorecard…
        </p>
        <p className="mt-2 text-sm font-semibold text-stone-600 min-h-[1.5rem]">
          {STATUS_LINES[lineIdx]}
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {STATUS_LINES.map((_, i) => (
            <span
              key={i}
              className={
                "h-1.5 w-6 rounded-full transition-colors " +
                (i === lineIdx ? "bg-gem" : "bg-gem/25")
              }
            />
          ))}
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gem">
          Live on this page — not a waiting list
        </p>
      </div>
    );
  }

  if (status === "done" && teaser && tone) {
    const great = teaser.great || [];
    const missing = teaser.missing || [];
    const fix = teaser.fix || [];

    return (
      <div className="space-y-5">
        {/* Instant banner */}
        <div className="flex items-center gap-2 rounded-lg border border-gem/30 bg-gem-mist px-3 py-2">
          <Zap className="h-4 w-4 shrink-0 text-gem" />
          <p className="text-xs sm:text-sm font-bold text-gem-dark">
            Your live scorecard — not a waiting list
          </p>
        </div>

        {/* Huge score + overview */}
        <div
          className={
            "rounded-xl border border-gem/30 bg-gradient-to-br p-5 sm:p-6 " + tone.bg
          }
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className={
                "mx-auto sm:mx-0 flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-[6px] bg-white shadow-md " +
                tone.ring
              }
            >
              <span className={"font-display text-5xl font-extrabold leading-none " + tone.text}>
                {teaser.score}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                / 100
              </span>
              <span className={"mt-1 text-xs font-extrabold uppercase tracking-wide " + tone.text}>
                {tone.label}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <span className="badge badge-gem">Instant scorecard · free</span>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-extrabold text-ink">
                {business.trim() || "Your business"}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-stone-700 leading-relaxed">
                {teaser.overview}
              </p>
              <p className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-bold">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5">
                  {great.length} great
                </span>
                <span className="rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5">
                  {missing.length} missing
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5">
                  {fix.length} to fix
                </span>
                {typeof teaser.checksRun === "number" ? (
                  <span className="rounded-full bg-stone-100 text-stone-600 px-2.5 py-0.5">
                    {teaser.checksRun} checks
                  </span>
                ) : null}
              </p>
              {teaser.normalizedUrl ? (
                <p className="mt-2 text-xs text-muted truncate">
                  Scanned: {teaser.normalizedUrl}
                  {teaser.fetchOk === false ? " · used Charlotte best-practice tips" : ""}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <h4 className="font-display text-base font-extrabold">What&apos;s great</h4>
            </div>
            {great.length === 0 ? (
              <p className="mt-3 text-sm text-stone-600">Nothing scored great yet — easy wins ahead.</p>
            ) : (
              <ul className="mt-3">
                {great.map((item) => (
                  <ScoreRow key={item.id} item={item} tone="great" />
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <h4 className="font-display text-base font-extrabold">What&apos;s missing</h4>
            </div>
            {missing.length === 0 ? (
              <p className="mt-3 text-sm text-stone-600">No major gaps — nice work.</p>
            ) : (
              <ul className="mt-3">
                {missing.map((item) => (
                  <ScoreRow key={item.id} item={item} tone="missing" />
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border-2 border-rose-300 bg-rose-50/80 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-800">
              <Wrench className="h-5 w-5 shrink-0" />
              <h4 className="font-display text-base font-extrabold">What to fix</h4>
            </div>
            {fix.length === 0 ? (
              <p className="mt-3 text-sm text-stone-600">Nothing broken in this scan.</p>
            ) : (
              <ul className="mt-3">
                {fix.map((item) => (
                  <ScoreRow key={item.id} item={item} tone="fix" />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Top 3 priorities */}
        <div className="rounded-xl border border-ink/10 bg-white p-4 sm:p-5 shadow-sm">
          <h4 className="font-display text-lg font-extrabold text-ink flex items-center gap-2">
            <Target className="h-5 w-5 text-gem" />
            Top 3 priorities
          </h4>
          <ul className="mt-3 space-y-3">
            {(teaser.bullets || []).slice(0, 3).map((b, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-border bg-stone-50 p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gem-soft text-gem-dark font-display font-extrabold text-sm">
                  {i + 1}
                </span>
                <p className="text-sm text-stone-700 leading-relaxed pt-1">{b}</p>
              </li>
            ))}
          </ul>
        </div>

        {teaser.upsellHints && teaser.upsellHints.length > 0 ? (
          <div className="rounded-xl border border-gold/30 bg-amber-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              What the $97 GBP cleanup PDF covers
            </p>
            <ul className="mt-2 space-y-1.5">
              {teaser.upsellHints.map((h) => (
                <li key={h} className="text-sm text-stone-700 leading-relaxed flex gap-2">
                  <Target className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/pay#cleanup" className="btn btn-primary w-full">
            Pay $97 cleanup <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pay#hot" className="btn btn-secondary w-full">
            <Flame className="h-4 w-4 text-orange-600" />
            Hot lead pack
          </Link>
          <button type="button" className="btn btn-secondary w-full" onClick={reset}>
            Run another check
          </button>
        </div>

        <div
          className={
            "flex gap-3 items-start rounded-xl border p-4 " +
            (emailed ? "border-gem/30 bg-gem-mist" : "border-border bg-stone-50")
          }
        >
          <CheckCircle2 className={"h-5 w-5 shrink-0 mt-0.5 " + (emailed ? "text-gem" : "text-muted")} />
          <div>
            <p className="text-sm font-bold text-ink">
              {emailed
                ? "We also emailed AI Bloom your lead"
                : "Scorecard ready — inbox notify may have delayed"}
            </p>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              {emailed
                ? "hello.aibloom@outlook.com received your business details + scorecard. We’ll follow up if helpful."
                : "Your results are on this page. If you don’t hear from us, reply via About → Connect."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-bold text-ink">Business name *</label>
        <input
          className="input mt-1"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="e.g. Metro AC Repair"
          required
          autoComplete="organization"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-ink">Website *</label>
        <input
          className="input mt-1"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="yourbusiness.com"
          required
          autoComplete="url"
          inputMode="url"
        />
        <p className="mt-1 text-xs text-muted">
          Instant on-page scorecard — we&apos;ll add https:// if needed.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-ink">Email *</label>
          <input
            type="email"
            className="input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink">Phone *</label>
          <input
            className="input mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(704) 555-0100"
            required
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-ink">City</label>
          <input
            className="input mt-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Charlotte, NC"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink">Google Maps link</label>
          <input
            className="input mt-1"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder="Optional Maps URL"
          />
        </div>
      </div>
      {error ? (
        <p className="text-sm font-semibold text-red-700 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        <MapPin className="h-4 w-4" />
        Get my instant scorecard
      </button>
      <p className="text-xs text-muted leading-relaxed">
        Free public-website scan · what&apos;s great, missing &amp; fixable in seconds. Optional $97
        cleanup + lead packs if you want help fixing it.
      </p>
    </form>
  );
}
