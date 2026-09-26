import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Download,
  FileText,
  MessageSquareText,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { StarterCtaButtons, StarterInterestForm } from "@/components/starter/StarterCta";

export const metadata: Metadata = {
  title: "AI Bloom Starter — $497 for operators",
  description:
    "AI Bloom Starter for Operators ($497): we set your pricing rates, invoice templates, and AI follow-up scripts so you quote and get paid faster. 1-week delivery. Charlotte.",
  alternates: {
    canonical: "https://www.aibloom.agency/starter",
  },
  openGraph: {
    title: "AI Bloom Starter for Operators — $497",
    description:
      "AI made simple. Learn. Try. Grow. Pricing setup, invoice pack, AI follow-up kit, live setup call, 30 days support.",
    url: "https://www.aibloom.agency/starter",
  },
};

const INCLUDED = [
  {
    title: "Price a job setup",
    detail:
      "Your trade (cleaning or construction), hourly rates, and overhead/profit defaults tuned with you — saved so the calculator matches how you actually bid.",
  },
  {
    title: "Invoice pack",
    detail:
      "1 primary format + branded fields (business name, payment terms, thank-you note). Word + PDF workflow walkthrough you can repeat on a library PC.",
  },
  {
    title: "AI follow-up kit",
    detail:
      "5–7 copy-paste prompts/scripts: quote follow-up, invoice reminder, past-due polite nudge, thank-you, LinkedIn “just completed a job” post.",
  },
  {
    title: "30-minute live setup call",
    detail:
      "Or async Loom if you prefer. Goal: you’re quoting on phone or library PC before we hang up.",
  },
  {
    title: "30 days email support",
    detail: "Questions on the tools we set up — reply help, no ticket maze.",
  },
];

const TIMELINE = [
  { day: "Day 1", title: "Kickoff", desc: "Short intake: trade, rates you already use, how you get paid." },
  { day: "Days 2–3", title: "Build", desc: "We tune Price a job defaults + draft your invoice pack + scripts." },
  { day: "Day 4–5", title: "Review", desc: "You check samples; we adjust names, terms, and tone." },
  { day: "Day 6–7", title: "Go live", desc: "30-min setup (or Loom). Quote one real job. You’re done." },
];

const NOT_THIS = [
  "Not a custom AI rebuild or chatbot project",
  "Not QuickBooks / full accounting software",
  "Not a monthly agency retainer",
  "Not “we’ll run your whole marketing”",
];

const FAQ = [
  {
    q: "Who is this for?",
    a: "Charlotte and nearby operators — cleaners, contractors, HUB-ish and underserved small businesses who want to quote and get paid faster without becoming “tech people.”",
  },
  {
    q: "What do I need to start?",
    a: "A business name, how you usually price (hourly or flat), and an email. Phone optional. Library PC is fine for the tools.",
  },
  {
    q: "How do I pay?",
    a: "Pay $497 on the Pay page (card via Stripe), or email with subject “AI Bloom Starter $497” for Zelle / invoice. Work starts after payment clears.",
  },
  {
    q: "Can I do Loom instead of a live call?",
    a: "Yes. Prefer async? We record a 30-minute Loom walkthrough of your setup so you can pause and replay.",
  },
  {
    q: "Is this the free tools on the site?",
    a: "The free Price a job and Invoice tools stay free. Starter is the done-with-you setup: your rates, your brand fields, your scripts, plus a call and 30 days support.",
  },
];

export default function StarterPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16">
          <p className="warhol-eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            AI Bloom · Paid offer · 1-week delivery
          </p>
          <h1 className="headline-lg mt-5 max-w-3xl">
            AI Bloom Starter for Operators
          </h1>
          <p className="mt-3 text-xl font-extrabold text-warhol-magenta">
            AI made simple. Learn. Try. Grow.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed font-medium">
            We set your pricing rates, invoice templates, and a simple AI follow-up script so you
            quote and get paid faster.
          </p>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-warhol-ink">$497</span>
            <span className="text-sm font-semibold text-muted">one-time · delivered in ~7 days</span>
          </div>
          <StarterCtaButtons className="mt-6" />
          <p className="mt-4 text-sm text-muted">
            Prefer a peek first?{" "}
            <a
              href="/samples/ai-bloom-starter-sample.md"
              className="font-bold text-warhol-magenta underline underline-offset-2"
              download
            >
              Download sample pack
            </a>{" "}
            or jump to{" "}
            <a href="#sample" className="font-bold text-warhol-teal underline underline-offset-2">
              sample deliverables
            </a>
            .
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <h2 className="font-display text-2xl font-extrabold text-warhol-ink">Who it’s for</h2>
        <p className="mt-3 max-w-2xl text-stone-600 leading-relaxed">
          Charlotte / underserved operators — residential & commercial cleaners, small contractors,
          HUB-ish and neighborhood businesses who win work by reputation, not by fancy software.
          If you quote from your phone or a library PC, this was built with you in mind.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            "Cleaners who want consistent rates",
            "Contractors who need cleaner invoices",
            "Operators tired of “figure out AI alone”",
          ].map((t) => (
            <li
              key={t}
              className="flex items-start gap-2 rounded-xl border-2 border-warhol-ink bg-white p-4 text-sm font-semibold text-warhol-ink shadow-[4px_4px_0_var(--warhol-teal)]"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-warhol-teal" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y-4 border-warhol-ink bg-white">
        <div className="container-page py-10 sm:py-12">
          <h2 className="font-display text-2xl font-extrabold text-warhol-ink">What’s included</h2>
          <p className="mt-2 text-stone-600">Concrete deliverables for a one-week turnaround.</p>
          <ul className="mt-6 space-y-4">
            {INCLUDED.map((item, i) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border-2 border-warhol-ink bg-white p-5 shadow-[4px_4px_0_var(--warhol-ink)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-warhol-ink bg-warhol-magenta text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-warhol-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-warhol-magenta" />
          <h2 className="font-display text-2xl font-extrabold text-warhol-ink">
            What you’ll have in 7 days
          </h2>
        </div>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((t) => (
            <li
              key={t.day}
              className="rounded-xl border-2 border-warhol-ink bg-warhol-cream p-4 shadow-[4px_4px_0_var(--warhol-yellow)]"
            >
              <p className="text-xs font-extrabold uppercase tracking-wide text-warhol-magenta">{t.day}</p>
              <p className="mt-1 font-display font-extrabold text-warhol-ink">{t.title}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{t.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="sample" className="border-y-4 border-warhol-ink section-cream">
        <div className="container-page py-10 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-warhol-ink">
                Sample of what you walk away with
              </h2>
              <p className="mt-2 max-w-2xl text-stone-600 leading-relaxed">
                Mock deliverables — realistic examples so you know what “done” looks like. Yours
                will use your rates, name, and voice.
              </p>
            </div>
            <a
              href="/samples/ai-bloom-starter-sample.md"
              className="btn-warhol btn-warhol-outline shrink-0"
              download
            >
              <Download className="h-4 w-4" /> Full sample pack
            </a>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border-2 border-warhol-ink bg-white shadow-[6px_6px_0_var(--warhol-teal)]">
              <div className="border-b-2 border-warhol-ink bg-warhol-cream px-4 py-3 flex items-center gap-2">
                <Timer className="h-4 w-4 text-warhol-teal" />
                <h3 className="font-display font-extrabold text-warhol-ink text-sm">Example rate card</h3>
              </div>
              <div className="p-4 text-sm space-y-2 bg-white">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Queen City Clean Co. · Residential
                </p>
                <div className="rounded-lg border-2 border-warhol-ink bg-warhol-cream p-3 space-y-1.5 font-mono text-[13px]">
                  <div className="flex justify-between"><span>Lead tech</span><span>$45/hr</span></div>
                  <div className="flex justify-between"><span>Helper</span><span>$28/hr</span></div>
                  <div className="flex justify-between"><span>Supplies (default)</span><span>8%</span></div>
                  <div className="flex justify-between"><span>Overhead</span><span>18%</span></div>
                  <div className="flex justify-between border-t-2 border-warhol-ink pt-1.5 font-bold"><span>Target profit</span><span>22%</span></div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Saved into Price a job so ballparks match how you bid.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-warhol-ink bg-white shadow-[6px_6px_0_var(--warhol-magenta)]">
              <div className="border-b-2 border-warhol-ink bg-warhol-cream px-4 py-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-warhol-magenta" />
                <h3 className="font-display font-extrabold text-warhol-ink text-sm">Example invoice line</h3>
              </div>
              <div className="p-4 text-sm bg-white">
                <div className="invoice-paper !p-4 !shadow-none text-[13px] border-2 border-warhol-ink">
                  <p className="font-display font-extrabold text-warhol-magenta">Queen City Clean Co.</p>
                  <p className="text-xs text-muted mt-0.5">Invoice #1042 · Due Net 14</p>
                  <div className="mt-3 border-t border-border pt-2 space-y-1">
                    <div className="flex justify-between gap-2">
                      <span>Deep clean — 3BR / 2BA (Plaza Midwood)</span>
                      <span className="shrink-0 font-semibold">$285.00</span>
                    </div>
                    <div className="flex justify-between text-muted text-xs">
                      <span>Payment: Zelle / check · Thank you for trusting us.</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">Primary format + branded Word/PDF workflow.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-warhol-ink bg-white shadow-[6px_6px_0_var(--warhol-yellow)]">
              <div className="border-b-2 border-warhol-ink bg-warhol-cream px-4 py-3 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-warhol-ink" />
                <h3 className="font-display font-extrabold text-warhol-ink text-sm">Example follow-up</h3>
              </div>
              <div className="p-4 text-sm bg-white space-y-3">
                <div className="rounded-lg border-2 border-warhol-ink bg-warhol-cream p-3 leading-relaxed text-[13px] text-stone-700">
                  <p className="text-xs font-bold text-muted mb-1">Quote follow-up (text/email)</p>
                  Hi Jordan — just checking you got the quote for the Plaza Midwood deep clean
                  ($285). Happy to adjust timing if next week works better. — Maya, Queen City Clean
                </div>
                <p className="text-xs text-muted">
                  Plus invoice reminder, past-due nudge, thank-you, and LinkedIn post in the kit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <h2 className="font-display text-2xl font-extrabold text-warhol-ink">What it’s not</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {NOT_THIS.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-stone-600">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section id="get-started" className="border-y-4 border-warhol-ink bg-white">
        <div className="container-page py-10 sm:py-14 max-w-3xl">
          <p className="warhol-eyebrow">Clear price</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-warhol-ink">
            $497 — one time
          </h2>
          <a href="/pay#starter" className="btn-warhol btn-warhol-magenta mt-4 inline-flex">
            Pay $497 now
          </a>
          <p className="mt-3 text-stone-600 leading-relaxed">
            Setup + deliverables + 30-min call (or Loom) + 30 days email support. Free site tools
            stay free; this is the done-with-you package.
          </p>
          <StarterCtaButtons className="mt-6" />
          <div className="mt-10 rounded-2xl border-2 border-warhol-ink bg-warhol-cream p-6 sm:p-8 shadow-[6px_6px_0_var(--warhol-magenta)]">
            <h3 className="font-display text-xl font-extrabold text-warhol-ink">Request the Starter</h3>
            <p className="mt-1 text-sm text-muted mb-5">
              Subject line we watch for: <strong className="text-warhol-ink">AI Bloom Starter $497</strong>
            </p>
            <StarterInterestForm />
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12 max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold text-warhol-ink">FAQ</h2>
        <dl className="mt-6 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border-2 border-warhol-ink bg-white p-5 shadow-[4px_4px_0_var(--warhol-ink)]">
              <dt className="font-display font-extrabold text-warhol-ink">{f.q}</dt>
              <dd className="mt-2 text-sm text-stone-600 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-muted">
          Still exploring?{" "}
          <Link href="/price" className="font-bold text-warhol-magenta hover:underline">
            Try Price a job free
          </Link>
          {" · "}
          <Link href="/invoices" className="font-bold text-warhol-teal hover:underline">
            Make an invoice
          </Link>
          {" · "}
          <Link href="/about#connect" className="font-bold text-warhol-magenta hover:underline inline-flex items-center gap-1">
            Connect <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </section>
    </div>
  );
}
