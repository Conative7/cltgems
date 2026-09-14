"use client";

import { Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  FORMSPREE_ID,
  INBOX,
  openOutlookDraft,
  submitViaFormspree,
} from "@/lib/notifyEmail";

type Status = "idle" | "sending" | "sent" | "error";

const SUBJECT = "AI Bloom Starter $497";

export function StarterCtaButtons({ className = "" }: { className?: string }) {
  const href =
    "https://outlook.live.com/mail/0/deeplink/compose?to=" +
    encodeURIComponent(INBOX) +
    "&subject=" +
    encodeURIComponent(SUBJECT) +
    "&body=" +
    encodeURIComponent(
      "Hi AI Bloom — I'm interested in the AI Bloom Starter for Operators ($497).\n\nTrade (cleaning / construction / other):\nCity / area:\nPhone (optional):\n\nThanks!",
    );

  return (
    <div className={"flex flex-col sm:flex-row gap-3 " + className}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-base px-6 py-3">
        Get the Starter — $497 <Send className="h-4 w-4" />
      </a>
      <a
        href={`mailto:${INBOX}?subject=${encodeURIComponent(SUBJECT)}`}
        className="btn btn-secondary text-base px-6 py-3"
      >
        <Mail className="h-4 w-4" /> Email {INBOX}
      </a>
    </div>
  );
}

/** Lightweight interest form stub — Formspree first, Outlook fallback */
export function StarterInterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    const body = [
      `From: ${name.trim()} <${email.trim()}>`,
      `Trade: ${trade.trim() || "(not specified)"}`,
      "",
      note.trim() || "(no extra note)",
      "",
      "— AI Bloom Starter $497 interest",
    ].join("\n");

    setStatus("sending");
    if (FORMSPREE_ID) {
      try {
        const ok = await submitViaFormspree({
          name: name.trim(),
          email: email.trim(),
          trade: trade.trim(),
          message: note.trim() || "Interested in AI Bloom Starter $497",
          form: "starter-497",
          _subject: SUBJECT,
          _replyto: email.trim(),
        });
        if (!ok) throw new Error("fail");
        setStatus("sent");
        setName("");
        setEmail("");
        setTrade("");
        setNote("");
        return;
      } catch {
        /* fall through */
      }
    }
    openOutlookDraft(SUBJECT, body);
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-gem/30 bg-gem-mist p-5">
        <p className="font-display font-extrabold text-gem-dark text-lg">Got it — thank you!</p>
        <p className="mt-1 text-sm text-stone-700 leading-relaxed">
          We’ll reply at your email within 1 business day to confirm payment and schedule your
          setup call (or send a Loom if you prefer async).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="starter-name">
            Name
          </label>
          <input
            id="starter-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="starter-email">
            Email
          </label>
          <input
            id="starter-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="starter-trade">
          Trade (cleaning, construction, other)
        </label>
        <input
          id="starter-trade"
          className="input"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          placeholder="e.g. residential cleaning · Charlotte"
        />
      </div>
      <div>
        <label className="label" htmlFor="starter-note">
          Anything we should know?
        </label>
        <textarea
          id="starter-note"
          className="input min-h-[5rem] resize-y"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Prefer Loom vs live call, library PC, etc."
        />
      </div>
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request Starter — $497"} <Send className="h-4 w-4" />
      </button>
      <p className="text-xs text-muted">
        Or email{" "}
        <a className="font-bold text-gem underline underline-offset-2" href={`mailto:${INBOX}?subject=${encodeURIComponent(SUBJECT)}`}>
          {INBOX}
        </a>{" "}
        with subject “{SUBJECT}”.
      </p>
    </form>
  );
}
