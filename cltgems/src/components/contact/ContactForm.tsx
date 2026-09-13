"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { FORMSPREE_ID, INBOX, openOutlookDraft, submitViaFormspree } from "@/lib/notifyEmail";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"formspree" | "outlook">("outlook");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email, and message.");
      return;
    }

    const subject = `AI Bloom inquiry from ${name.trim()}`;
    const body = `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`;

    setStatus("sending");

    if (FORMSPREE_ID) {
      try {
        const ok = await submitViaFormspree({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          form: "connect",
          _subject: subject,
          _replyto: email.trim(),
        });
        if (!ok) throw new Error("fail");
        setMode("formspree");
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
        return;
      } catch {
        // fall through to Outlook
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
            <p className="font-display font-bold text-gem-dark text-lg">
              {mode === "formspree" ? "Sent — thank you!" : "Almost there — hit Send in Outlook"}
            </p>
            <p className="mt-1 text-sm text-stone-700 leading-relaxed">
              {mode === "formspree"
                ? `Your message went to ${INBOX}. We’ll reply at the email you left.`
                : `Outlook Web opened with your message to ${INBOX}. Sign in if needed, then click Send. No app-chooser popup.`}
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-bold text-gem underline underline-offset-2"
              onClick={() => setStatus("idle")}
            >
              Send another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-ink">Your name</label>
          <input
            className="input mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            autoComplete="name"
            required
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
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-ink">Message</label>
        <textarea
          className="input mt-1 min-h-[110px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say hello, ask a question, or tell us what you need…"
          required
        />
      </div>
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        <Send className="h-4 w-4" />
        {status === "sending" ? "Opening…" : "Send to hello.aibloom@outlook.com"}
      </button>
      <p className="text-xs text-muted leading-relaxed">
        Opens Outlook on the web with your note ready — no phone/app chooser. Destination: {INBOX}.
      </p>
    </form>
  );
}
