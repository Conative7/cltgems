"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import {
  GREETING,
  SUGGESTIONS,
  replyTo,
  type AssistantReply,
  type ChatLink,
} from "./knowledge";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  links?: ChatLink[];
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toMsg(role: Msg["role"], reply: AssistantReply | { text: string }): Msg {
  return {
    id: uid(),
    role,
    text: reply.text,
    links: "links" in reply ? reply.links : undefined,
  };
}

export function SiteAssistant() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(() => [toMsg("assistant", GREETING)]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  function pushAssistant(text: string) {
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, toMsg("assistant", replyTo(text))]);
      setTyping(false);
    }, 320);
  }

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, toMsg("user", { text })]);
    setInput("");
    pushAssistant(text);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="AI Bloom site helper"
          className="flex w-[min(100vw-2rem,22.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-stone-900/15"
          style={{ maxHeight: "min(70vh, 34rem)" }}
        >
          <header className="flex items-center gap-3 bg-gem px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold leading-tight">AI Bloom helper</p>
              <p className="text-xs text-white/85">Navigate · answers · connect</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-white/90 hover:bg-white/15"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-warm px-3 py-3">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-gem px-3 py-2 text-sm text-white whitespace-pre-wrap"
                      : "max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-white px-3 py-2 text-sm text-ink whitespace-pre-wrap shadow-sm"
                  }
                >
                  {m.text}
                  {m.links?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className="inline-flex items-center rounded-full border border-gem/25 bg-gem-mist px-2.5 py-1 text-xs font-bold text-gem-dark hover:bg-gem-soft"
                          onClick={() => setOpen(false)}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {typing ? (
              <p className="text-xs font-semibold text-muted px-1">Helper is typing…</p>
            ) : null}
          </div>

          <div className="border-t border-border bg-white px-3 pt-2 pb-1">
            <div className="flex gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="shrink-0 rounded-full border border-border bg-warm px-2.5 py-1 text-xs font-bold text-stone-700 hover:border-gem/40 hover:text-gem-dark"
                  onClick={() => send(s.prompt)}
                  disabled={typing}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2 pb-2">
              <input
                ref={inputRef}
                className="input flex-1 !py-2 text-sm"
                placeholder="Ask anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message"
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-primary !px-3"
                disabled={typing || !input.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gem text-white shadow-lg shadow-gem/35 ring-4 ring-white transition hover:bg-gem-dark focus:outline-none focus-visible:ring-gem-soft"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close AI Bloom helper" : "Open AI Bloom helper"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
