import Link from "next/link";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    href: "/check",
    title: "Free Google scorecard",
    desc: "See how your Charlotte listing and website look to customers — gaps, wins, and what to fix first. Free.",
    cta: "Check your listing",
    cardClass: "warhol-card warhol-card-magenta",
    accent: "bg-warhol-magenta text-white",
  },
  {
    num: "02",
    href: "/intel",
    title: "Lead packs",
    desc: "Order a clean Charlotte lead list by trade — per task CSV. No monthly subscription.",
    cta: "Find leads",
    cardClass: "warhol-card warhol-card-teal",
    accent: "bg-warhol-teal text-white",
  },
  {
    num: "03",
    href: "/invoices",
    title: "Invoice without Canva",
    desc: "Professional Word or PDF on any PC — even a library computer. Fill, download, clear your session.",
    cta: "Make an invoice",
    cardClass: "warhol-card warhol-card-yellow",
    accent: "bg-warhol-yellow text-warhol-ink",
  },
] as const;

const STEPS = [
  {
    num: "1",
    title: "Start free",
    desc: "Run the Google scorecard or price a cleaning job. No account maze.",
  },
  {
    num: "2",
    title: "Pick what you need",
    desc: "Leads when you want more jobs. Invoices when you need to get paid.",
  },
  {
    num: "3",
    title: "Get done",
    desc: "Download a CSV or Word/PDF — or book Starter if you want us to set it up with you.",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <LocalBusinessJsonLd />

      {/* 1. Bold hero */}
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="warhol-eyebrow">AI Bloom · Charlotte · AI made simple</p>
              <h1 className="headline-xl mt-5">
                AI that gets Charlotte businesses found and paid.
              </h1>
              <p className="mt-5 max-w-xl text-lg sm:text-xl text-stone-600 leading-relaxed font-medium">
                Free Google scorecards, lead packs, and invoices without Canva — plain English,
                built for local trades and services.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/check" className="btn-warhol btn-warhol-magenta">
                  Free Google check <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/intel" className="btn-warhol btn-warhol-outline">
                  Find leads
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted font-semibold">
                Or{" "}
                <Link href="/invoices" className="text-warhol-magenta underline underline-offset-2 hover:text-warhol-ink">
                  make an invoice
                </Link>{" "}
                ·{" "}
                <Link href="/price" className="text-warhol-teal underline underline-offset-2 hover:text-warhol-ink">
                  price a job
                </Link>
              </p>
            </div>

            <div className="hero-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/warhol-bloom.jpg"
                alt="AI Bloom Warhol-style pop art bloom — bold color for Charlotte small business"
                width={1200}
                height={1200}
                className="w-full object-cover aspect-square sm:aspect-[4/3] lg:aspect-square"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Punch line / qualitative strip */}
      <section className="border-b-4 border-warhol-ink bg-white">
        <div className="container-page py-8 sm:py-10">
          <div className="stat-strip">
            <div className="stat-strip-item bg-warhol-yellow/30">
              <p className="font-display text-lg font-extrabold text-warhol-ink">No monthly trap</p>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                Lead packs are per task. You buy when you need jobs — not a subscription you forget.
              </p>
            </div>
            <div className="stat-strip-item bg-warhol-teal/10">
              <p className="font-display text-lg font-extrabold text-warhol-ink">Works on a library PC</p>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                Invoice builder downloads Word or PDF. Clear your session before you leave.
              </p>
            </div>
            <div className="stat-strip-item bg-warhol-magenta/10">
              <p className="font-display text-lg font-extrabold text-warhol-ink">Charlotte-first</p>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                Built for local trades and services — warm, plain English, AI made simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What we build — numbered cards */}
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="accent-bar" aria-hidden />
              <h2 className="headline-lg mt-3">What we build</h2>
              <p className="mt-2 max-w-xl text-stone-600 leading-relaxed">
                Three tools you can use today. Price a job sits right beside them when you need a
                ballpark.
              </p>
            </div>
            <Link
              href="/price?trade=cleaning&audience=owner"
              className="text-sm font-bold text-warhol-indigo underline underline-offset-2 hover:text-warhol-magenta shrink-0"
            >
              Price a cleaning job →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} className={s.cardClass + " group flex flex-col"}>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black " +
                      s.accent
                    }
                  >
                    {s.num}
                  </span>
                  <span className="warhol-num select-none" aria-hidden>
                    {s.num}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-extrabold text-warhol-ink group-hover:text-warhol-magenta transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-warhol-ink">
                  {s.cta}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="bg-white border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16">
          <span className="accent-bar" aria-hidden />
          <h2 className="headline-lg mt-3">How it works</h2>
          <p className="mt-2 max-w-xl text-stone-600 leading-relaxed">
            Short path. No jargon. No overwhelm.
          </p>

          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.num} className="warhol-card warhol-card-indigo">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-warhol-indigo text-white text-sm font-black">
                  {step.num}
                </span>
                <h3 className="mt-3 font-display text-lg font-extrabold text-warhol-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Strong CTAs */}
      <section className="section-ink">
        <div className="container-page py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-warhol-yellow bg-warhol-yellow px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-warhol-ink">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Free to start
            </p>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Find your gaps in minutes.
            </h2>
            <p className="mt-4 text-lg text-stone-300 leading-relaxed max-w-xl">
              Run the free Google listing scorecard — then grab leads, invoices, or Starter when
              you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/check" className="btn-warhol btn-warhol-magenta">
                Free Google check <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/starter" className="btn-warhol btn-warhol-outline !bg-transparent !text-white !border-white hover:!bg-white/10">
                Starter $497
              </Link>
            </div>
            <p className="mt-5 text-sm text-stone-400">
              Prefer to pay for a lead pack?{" "}
              <Link href="/pay" className="font-bold text-warhol-yellow underline underline-offset-2 hover:text-white">
                Go to Pay
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Soft secondary strip — demoted desk photos, gender/race neutral captions */}
      <section className="section-cream border-t-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-display text-xl font-extrabold text-warhol-ink">
            Built for real Charlotte work
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600 leading-relaxed">
            Local services energy — clear paperwork, getting found, getting paid. No tech headache.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border-2 border-warhol-ink bg-white shadow-[4px_4px_0_var(--warhol-teal)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/charlotte-local.jpg"
                alt="Charlotte-area service work — AI Bloom helps local businesses get found"
                width={1000}
                height={667}
                className="w-full object-cover aspect-[3/2]"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-sm font-bold text-stone-700">
                Built for Charlotte trades &amp; local services
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border-2 border-warhol-ink bg-white shadow-[4px_4px_0_var(--warhol-magenta)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/invoice-desk.jpg"
                alt="Professional invoice on desk and tablet — invoice without Canva"
                width={1000}
                height={667}
                className="w-full object-cover aspect-[3/2]"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-sm font-bold text-stone-700">
                Invoices that look paid-for, without Canva
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}
