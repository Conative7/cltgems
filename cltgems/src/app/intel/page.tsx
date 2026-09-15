import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Download,
  Flame,
  Mail,
  MapPinned,
  MessageSquareWarning,
  Radar,
  Search,
  Sparkles,
} from "lucide-react";
import { LeadRequestForm } from "@/components/intel/LeadRequestForm";

export const metadata: Metadata = {
  title: "Find leads",
  description:
    "Order local business lead lists for Charlotte — Google Maps–style public data via Outscraper. Per task, not a subscription.",
};

const LEAD_SERVICES = [
  {
    id: "maps",
    title: "Local business leads",
    desc: "Pull public Google Maps–style listings: name, phone, website, rating, address.",
    tag: "Most popular",
    icon: MapPinned,
    example: "HVAC in Charlotte · roofers in Concord",
  },
  {
    id: "noweb",
    title: "No-website leads",
    desc: "Same pull, filtered to businesses with no site (or a weak listing). Easy outreach wins.",
    tag: "High intent",
    icon: Flame,
    example: "Plumbers missing a website",
  },
  {
    id: "reviews",
    title: "Review-pain intel",
    desc: "Find places with thin or painful reviews — great if you sell reputation or Google cleanup.",
    tag: "Reputation",
    icon: MessageSquareWarning,
    example: "Low-rated home services nearby",
  },
  {
    id: "emails",
    title: "Leads + contacts",
    desc: "Local list plus public email/contact enrichment when available (costs a bit more).",
    tag: "Outreach ready",
    icon: Mail,
    example: "Dentists + public emails",
  },
];

const PACKAGES = [
  {
    id: "neighborhood",
    name: "Neighborhood List",
    price: "$49",
    detail: "~50–100 leads · 1 niche · 1 area",
    margin: "Tool cost usually under ~$3",
  },
  {
    id: "hot",
    name: "Hot Lead Pack",
    price: "$97",
    detail: "Scored hot subset + short notes",
    margin: "Best starter for selling outreach",
    highlight: true,
  },
  {
    id: "metro",
    name: "Metro Sweep",
    price: "$197",
    detail: "Multi-suburb · up to ~300–500",
    margin: "Charlotte metro coverage",
  },
];

const DELIVER = [
  "Spreadsheet (CSV / Excel) you can open anywhere",
  "Name, phone, website, rating, reviews, address when public",
  "Optional “hot” flags: no website, low reviews, weak Google presence",
  "You never log into Outscraper — AI Bloom runs the task for you",
];

export default function IntelPage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-wide text-gem">
            AI Bloom · Find leads · Per task
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl leading-tight">
            Find local business leads — without learning scrapers
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-stone-600 leading-relaxed">
            Built for Charlotte business owners and agencies who need a list to call, text, or sell.
            Pick what you need, tell us the niche and city, get a clean file.
          </p>
          <p className="mt-4 max-w-2xl rounded-xl border border-gem/20 bg-white px-4 py-3 text-sm font-semibold text-gem-dark leading-relaxed">
            Pay per task — not a subscription. Outscraper fees are baked into the price so you still
            profit when you resell or use the list.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/pay" className="btn btn-primary">
              Pay for a pack <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#request" className="btn btn-secondary">
              Request a lead list
            </a>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 space-y-14">
        <section id="services">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink">Lead services</h2>
              <p className="mt-1 text-muted text-sm sm:text-base">
                Like a simple menu of data jobs — inspired by tools like Outscraper, written for owners.
              </p>
            </div>
            <span className="badge badge-gem">Public data only</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEAD_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <article key={s.id} className="card flex flex-col p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gem text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="badge badge-gem">{s.tag}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{s.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-stone-500">Ex: {s.example}</p>
                  <a href={`#request`} className="btn btn-primary mt-4 w-full text-sm">
                    Use this <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink">How owners use it</h2>
            <ol className="mt-5 space-y-4">
              {[
                {
                  t: "1. Pick a lead type",
                  d: "Local list, no-website, review-pain, or contacts — same idea as choosing a scraper, without the tech.",
                  icon: Search,
                },
                {
                  t: "2. Tell us niche + city",
                  d: "Example: “HVAC contractor, Charlotte NC, about 100.” We confirm the package price.",
                  icon: Building2,
                },
                {
                  t: "3. Download your file",
                  d: "We run the job, clean it, and send CSV/Excel. Then you invoice the client (or yourself) and keep the spread.",
                  icon: Download,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.t} className="card flex gap-4 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gem-soft text-gem-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-ink">{step.t}</h3>
                      <p className="mt-1 text-sm text-muted leading-relaxed">{step.d}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <ul className="mt-6 space-y-2">
              {DELIVER.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-stone-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gem mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="request">
            <h2 className="font-display text-2xl font-extrabold text-ink">Request a lead list</h2>
            <p className="mt-1 text-sm text-muted mb-4">
              Fills an email to AI Bloom — no account required on this site yet.
            </p>
            <LeadRequestForm />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-extrabold text-ink">Per-task pricing</h2>
          <p className="mt-2 max-w-2xl text-muted leading-relaxed">
            Invoice Library stays free. Lead lists are paid so Outscraper cost + your time still leave
            profit — especially if you resell the pack or bundle a $97 Google audit.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <article
                key={p.name}
                className={
                  "card flex flex-col p-5 " +
                  (p.highlight ? "border-gem/40 ring-2 ring-gem/15 bg-gem-mist/50" : "")
                }
              >
                {p.highlight ? <span className="badge badge-gem">Best starter</span> : null}
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{p.name}</h3>
                <p className="mt-1 font-display text-3xl font-extrabold text-gem-dark">{p.price}</p>
                <p className="mt-2 text-sm text-stone-700">{p.detail}</p>
                <p className="mt-2 text-xs font-semibold text-muted flex-1">{p.margin}</p>
                <a href={`/pay#${p.id}`} className="btn btn-primary mt-4 w-full text-sm">
                  Buy {p.price} <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
          <p className="mt-4">
            <a href="/pay" className="text-sm font-bold text-gem hover:underline underline-offset-2">
              See all payment options →
            </a>
          </p>
          <p className="mt-4 text-sm text-muted">
            Custom tasks from <strong className="text-ink">$97</strong> after a short quote. Bigger
            enrichment (emails at scale) may add a clear line-item — we tell you before we run.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="card flex gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gem-soft text-gem-dark">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Gem: sell the audit, not just the list</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Use a Hot Lead Pack, then offer your free 3-bullet Google check → <strong>$97 cleanup</strong>.
                The list pays for itself when one owner says yes.
              </p>
            </div>
          </div>
          <div className="card flex gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gem-soft text-gem-dark">
              <Radar className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Gem: agency white-label</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Marketing agencies buy Metro Sweeps and rebrand the CSV for their clients. You stay the
                quiet data engine in Charlotte.
              </p>
            </div>
          </div>
        </section>

        <section className="card border-gem/20 bg-gem-mist p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-gem-dark">Powered by Outscraper</h2>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed max-w-3xl">
            Engine:{" "}
            <a
              href="https://outscraper.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gem underline underline-offset-2"
            >
              Outscraper
            </a>{" "}
            (Google Maps, contacts, reviews, and more). You don’t need their dashboard — AI Bloom runs
            the task and delivers the file. Live self-serve API on this site can come later; order by
            request works today.
          </p>
          <p className="mt-3 text-sm text-stone-700 leading-relaxed max-w-3xl">
            Get paid with our free{" "}
            <Link href="/invoices" className="font-bold text-gem underline underline-offset-2">
              Invoice Library
            </Link>
            . The lead job is the paid product; the invoice tool stays free so you still look pro.
          </p>
          <a href="#request" className="btn btn-primary mt-5">
            Request leads <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
