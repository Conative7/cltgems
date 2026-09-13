import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Mail, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Bloom — simple Charlotte tools for the AI age. Find leads, price jobs, invoice, and get help. Say hello anytime.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-12 sm:py-16 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-gem">AI Bloom · Charlotte</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            AI made simple — for real people building real businesses
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            No jargon. No overwhelm. Clear tools that help you move faster in the AI age —
            and a real person who will answer when you reach out.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 max-w-3xl space-y-10">
        <section className="space-y-4 text-stone-700 leading-relaxed">
          <p>
            <strong className="text-ink">AI Bloom</strong> helps Charlotte small businesses use AI
            and simple software without the hassle. You don’t need to be techy. You need results:
            find the right people, price the job, send a clean invoice, and get paid.
          </p>
          <p>Open a page, do the thing, go back to work. That’s it.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-extrabold text-ink">What you can do here</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/intel", title: "Find leads", desc: "Local business lists, per task — no subscription." },
              { href: "/price", title: "Price a job", desc: "Ballpark cleaning & construction estimates fast." },
              { href: "/invoices", title: "Invoices", desc: "Free Word/PDF builder — even on a library PC." },
              { href: "/directory", title: "Directory", desc: "Browse Charlotte-oriented operators (growing)." },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="card flex h-full flex-col p-4 transition-shadow hover:shadow-md"
                >
                  <span className="font-display font-bold text-ink">{item.title}</span>
                  <span className="mt-1 text-sm text-muted leading-relaxed">{item.desc}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gem">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="connect"
          className="rounded-2xl border-2 border-gem/30 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gem text-white">
              <HeartHandshake className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-extrabold text-ink">Connect with us</h2>
              <p className="mt-2 text-stone-700 leading-relaxed">
                Stuck on a tool? Curious about AI for your business? Or just want to say{" "}
                <strong className="text-ink">hello</strong>? We read every message.
              </p>
              <a
                href="mailto:hello.aibloom@outlook.com?subject=Hello%20from%20the%20AI%20Bloom%20site"
                className="mt-5 inline-flex items-center justify-center gap-2 btn btn-primary text-base px-5 py-3"
              >
                <Mail className="h-5 w-5" />
                Email hello.aibloom@outlook.com
              </a>
              <p className="mt-3 text-sm text-muted">
                Copy &amp; paste:{" "}
                <a
                  href="mailto:hello.aibloom@outlook.com"
                  className="font-bold text-gem underline underline-offset-2 break-all"
                >
                  hello.aibloom@outlook.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-gem-mist p-5 flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gem-dark border border-gem/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-extrabold text-gem-dark text-lg">AI Bloom</p>
            <p className="font-semibold text-ink">AI made simple.</p>
            <p className="text-muted tracking-wide">Learn. Try. Grow.</p>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Built in Charlotte for people who build here. Use what you need — skip the rest.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
