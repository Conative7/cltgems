import Link from "next/link";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import {
  ArrowRight,
  Calculator,
  FileText,
  Radar,
  Sparkles,
  BadgeDollarSign,
  Home,
  Building2,
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
    href: "/price?trade=cleaning&audience=owner",
    title: "Need a price",
    desc: "Free cleaning calculator — ballpark a job, then turn it into an invoice in one tap.",
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

const TRUST_PHOTOS = [
  {
    src: "/images/charlotte-local.jpg",
    alt: "Charlotte-area service work — AI Bloom helps local businesses get found",
    caption: "Built for Charlotte trades & local services",
  },
  {
    src: "/images/invoice-desk.jpg",
    alt: "Professional invoice on desk and tablet — invoice without Canva",
    caption: "Invoices that look paid-for, without Canva",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <LocalBusinessJsonLd />
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
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
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-desk.jpg"
                alt="Charlotte small-business owner using AI Bloom tools on a laptop"
                width={1200}
                height={800}
                className="w-full rounded-2xl border border-border shadow-lg object-cover aspect-[4/3]"
                fetchPriority="high"
              />
            </div>
          </div>

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
                    {p.cta}{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-muted">
            Tip: Price a job →{" "}
            <strong className="text-ink">Estimate</strong> → invoice → download Word or PDF. Done.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            Real tools. Real Charlotte businesses.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600 leading-relaxed">
            Photos beat empty pages. Here&apos;s the vibe we build for — local work, clear paperwork,
            and getting paid without the tech headache.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TRUST_PHOTOS.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-2xl border border-border bg-warm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={1000}
                  height={667}
                  className="w-full object-cover aspect-[3/2]"
                  loading="lazy"
                />
                <figcaption className="px-4 py-3 text-sm font-semibold text-stone-700">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <div className="card border-gem/25 bg-white p-5 sm:p-6">
          <h3 className="font-display text-lg font-extrabold text-ink">
            Free cleaning price calculator
          </h3>
          <p className="mt-1 text-sm text-stone-700 leading-relaxed max-w-2xl">
            Owners price jobs with editable rates. Homeowners get a free Charlotte-area ballpark.
            Unlock Low / Target / High with a quick contact — no spam, no payment.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link href="/price?trade=cleaning&audience=owner" className="btn btn-primary">
              <Building2 className="h-4 w-4" />
              I run a cleaning business
            </Link>
            <Link href="/price?trade=cleaning&audience=homeowner" className="btn btn-secondary">
              <Home className="h-4 w-4" />
              I need a cleaning quote
            </Link>
          </div>
        </div>

        <div className="mt-6 card border-gem/25 bg-gem-mist p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
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

        <div className="mt-6 card border-gem/25 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gem-soft text-gem-dark">
            <BadgeDollarSign className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold text-ink">
              Ready for done-with-you setup?
            </h3>
            <p className="mt-1 text-sm text-stone-700 leading-relaxed max-w-2xl">
              AI Bloom Starter for Operators — $497. We tune your rates, invoice pack, and AI
              follow-up scripts so you quote and get paid faster. One week.
            </p>
          </div>
          <Link href="/starter" className="btn btn-primary shrink-0">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-stone-600">
          <span className="text-muted font-medium">Also:</span>
          {MORE.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="hover:text-gem underline-offset-2 hover:underline"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
