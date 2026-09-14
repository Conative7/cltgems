"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/intel", label: "Find leads" },
  { href: "/check", label: "Free Google check" },
  { href: "/price", label: "Price a job" },
  { href: "/estimate", label: "Estimate" },
  { href: "/invoices", label: "Invoices" },
  { href: "/starter", label: "Get started" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-warm/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gem text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-lg font-extrabold leading-tight text-ink">
              AI Bloom
            </span>
            <span className="block text-[11px] font-semibold text-muted leading-tight truncate">
              Charlotte · AI made simple
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors " +
                  (active ? "bg-gem-soft text-gem-dark" : "text-stone-600 hover:bg-stone-100 hover:text-ink")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="md:hidden btn btn-secondary p-2 min-h-11 min-w-11"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-border bg-warm px-4 py-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-3 text-sm font-semibold text-ink hover:bg-gem-soft"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
