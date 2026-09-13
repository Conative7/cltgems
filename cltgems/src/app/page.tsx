import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  FileText,
  Radar,
  Sparkles,
} from "lucide-react";

const PATHS = [
  {
    href: "/intel",
    title: "Need leads",
    desc: "Order a Charlotte lead list — per task, clean CSV. No monthly subscription.",
    cta: "Find leads",
    icon: Radar,
    accent: "bg-gem text-white",
    ring: "border-gem/30 hover:border-gem",
  },
  {
    href: "/invoices",
    title: "Need an invoice",
    desc: "Professional Word or PDF — works on a library PC. No Canva. No account maze.",
    cta: "Make an invoice",
    icon: FileText,
    accent: "bg-gem-dark text-white",
    ring: "border-gem/30 hover:border-gem",
  },
  {
    href: "/price",
    title: "Need a price",
    desc: "Ballpark cleaning or construction in minutes — then turn it into an invoice in one tap.",
    cta: "Price a job",
    icon: Calculator,
    accent: "bg-[#0f766e] text-white",
    ring: "border-gem/30 hover:border-gem",
  },
] as const;

const MORE = [
  { href: "/check", label: "Free Google listing check" },
  { href: "/add", label: "Add your business" },
  { href: "/about#connect", label: "Connect with us" },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-12 sm:py-16">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-bold text-gem-dark">
            <Sparkles className="h-3.5 w-3.5" />
            AI Bloom · Charlotte · AI made simple
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl leading-tight">
            What do you need today?
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-stone-600 leading-relaxed">
            Three simple tools for real Charlotte businesses — get found, price the job, get paid.
            No jargon. No overwhelm.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PATHS.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={
                    "card group flex flex-col p-5 sm:p-6 border-2 transition-all hover:shadow-lg " +
                    p.ring
                  }
                >
                  <span
                    className={
                      "flex h-12 w-12 items-center justify-center rounded-xl " + p.accent
                    }
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-display text-xl font-extrabold text-ink group-hover:text-gem">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gem">
                    {p.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-muted">
            Tip: Price a job →{" "}
            <strong className="text-ink">Make invoice</strong> → download Word or PDF. Done.
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <div className="card border-gem/25 bg-gem-mist p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold text-gem-dark">
              Invoice without Canva
            </h3>
            <p className="mt-1 text-sm text-stone-700 leading-relaxed max-w-2xl">
              Built for shared and library PCs. Fill the form, download Word or PDF, then clear your
              session before you leave — so the next person never sees your draft.
            </p>
          </div>
          <Link href="/invoices" className="btn btn-primary shrink-0">
            Open invoice builder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-stone-600">
          <span className="text-muted font-medium">Also:</span>
          {MORE.map((m) => (
            <Link key={m.href} href={m.href} className="hover:text-gem underline-offset-2 hover:underline">
              {m.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
