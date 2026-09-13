"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { FORMSPREE_ID, INBOX, openOutlookDraft, submitViaFormspree } from "@/lib/notifyEmail";

type Status = "idle" | "sending" | "sent";

export function GoogleCheckForm() {
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("Charlotte, NC");
  const [mapsUrl, setMapsUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"formspree" | "outlook">("formspree");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!business.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Leave an email or phone so we can send your 3 bullets.");
      return;
    }

    const subject = `Free Google check — ${business.trim()}`;
    const body = [
      "Free 3-bullet Google listing check request",
      "",
      `Business: ${business.trim()}`,
      `City: ${city.trim() || "Charlotte, NC"}`,
      `Maps link: ${mapsUrl.trim() || "(none)"}`,
      `Reply email: ${email.trim() || "—"}`,
      `Phone: ${phone.trim() || "—"}`,
    ].join("\n");

    setStatus("sending");

    if (FORMSPREE_ID) {
      try {
        const ok = await submitViaFormspree({
          form: "free-google-check",
          business: business.trim(),
          city: city.trim(),
          mapsUrl: mapsUrl.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: body,
          _subject: subject,
          _replyto: email.trim() || INBOX,
        });
        if (!ok) throw new Error("fail");
        setMode("formspree");
        setStatus("sent");
        return;
      } catch {
        /* outlook fallback */
      }
    }

    openOutlookDraft(subject, body);
    setMode("outlook");
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-gem/30 bg-gem-mist p-5">
        <div className="flex gap-3 items-start">
          <CheckCircle2 className="h-6 w-6 text-gem shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-gem-dark text-lg">Request received</p>
            <p className="mt-1 text-sm text-stone-700 leading-relaxed">
              {mode === "formspree"
                ? "We’ll email your free 3-bullet Google listing check within about a day (often faster)."
                : "Outlook opened with your request — hit Send if needed. We’ll reply with 3 plain bullets."}
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-bold text-gem underline underline-offset-2"
              onClick={() => {
                setStatus("idle");
                setBusiness("");
                setMapsUrl("");
              }}
            >
              Check another business
            </button>
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
        />
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
          <label className="block text-sm font-bold text-ink">Your email</label>
          <input
            type="email"
            className="input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-ink">Google Maps link (optional)</label>
        <input
          className="input mt-1"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          placeholder="Paste Maps URL if you have it"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-ink">Phone (optional)</label>
        <input
          className="input mt-1"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="For text reply"
        />
      </div>
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending…" : "Get my free 3-bullet check"}
      </button>
      <p className="text-xs text-muted">Free sample. Optional $97 cleanup checklist if you want help fixing it.</p>
    </form>
  );
}
