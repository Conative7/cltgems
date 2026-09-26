"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import {
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  hasClickToCall,
} from "@/lib/siteContact";

const NAV = [
  { href: "/intel", label: "Find leads" },
  { href: "/check", label: "Free Google check" },
  { href: "/pay", label: "Pay" },
  { href: "/price", label: "Price a job" },
  { href: "/invoices", label: "Invoices" },
  { href: "/starter", label: "Get started" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const showPhone = hasClickToCall();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-warhol-ink bg-warhol-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-warhol-ink bg-warhol-magenta text-white shadow-[2px_2px_0_var(--warhol-ink)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-lg font-black leading-tight text-warhol-ink tracking-tight">
              AI Bloom
            </span>
            <span className="block text-[11px] font-bold text-muted leading-tight truncate uppercase tracking-wider">
              Charlotte · AI made simple
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-lg px-2.5 py-2 text-sm font-bold transition-colors " +
                  (active
                    ? "bg-warhol-yellow text-warhol-ink border-2 border-warhol-ink"
                    : "text-stone-600 hover:bg-warhol-yellow/40 hover:text-warhol-ink border-2 border-transparent")
                }
              >
                {item.label}
              </Link>
            );
          })}
          {showPhone ? (
            <a
              href={`tel:${SITE_PHONE_TEL}`}
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border-2 border-warhol-ink bg-warhol-magenta px-3 py-2 text-sm font-extrabold text-white shadow-[2px_2px_0_var(--warhol-ink)] hover:bg-[#c91678] transition-colors"
            >
              <Phone className="h-4 w-4" />
              {SITE_PHONE_DISPLAY}
            </a>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {showPhone ? (
            <a
              href={`tel:${SITE_PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-warhol-ink bg-warhol-magenta p-2 min-h-11 min-w-11 text-white shadow-[2px_2px_0_var(--warhol-ink)]"
              aria-label={`Call ${SITE_PHONE_DISPLAY}`}
            >
              <Phone className="h-5 w-5" />
            </a>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border-2 border-warhol-ink bg-white p-2 min-h-11 min-w-11 text-warhol-ink shadow-[2px_2px_0_var(--warhol-teal)]"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t-2 border-warhol-ink bg-warhol-cream px-4 py-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "block rounded-lg px-3 py-3 text-sm font-bold " +
                  (active ? "bg-warhol-yellow text-warhol-ink" : "text-warhol-ink hover:bg-warhol-yellow/50")
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          {showPhone ? (
            <a
              href={`tel:${SITE_PHONE_TEL}`}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-extrabold text-warhol-magenta"
              onClick={() => setOpen(false)}
            >
              <Phone className="h-4 w-4" />
              Call {SITE_PHONE_DISPLAY}
            </a>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
