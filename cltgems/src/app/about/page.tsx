import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Bloom — simple Charlotte tools for the AI age. Find leads, price jobs, invoice, and get help. Say hello anytime.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16 max-w-3xl">
          <p className="warhol-eyebrow">AI Bloom · Charlotte</p>
          <h1 className="headline-lg mt-5">
            AI made simple — for real people building real businesses
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed font-medium">
            No jargon. No overwhelm. Clear tools that help you move faster in the AI age —
            and a real person who will answer when you reach out.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 max-w-3xl space-y-10">
        <section className="space-y-4 text-stone-700 leading-relaxed">
          <p>
            <strong className="text-warhol-ink">AI Bloom</strong> helps Charlotte small businesses use AI
            and simple software without the hassle. You don’t need to be techy. You need results:
            find the right people, price the job, send a clean invoice, and get paid.
          </p>
          <p>Open a page, do the thing, go back to work. That’s it.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-extrabold text-warhol-ink">What you can do here</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/intel", title: "Find leads", desc: "Local business lists, per task — no subscription.", card: "warhol-card warhol-card-magenta" },
              { href: "/price", title: "Price a job", desc: "Ballpark cleaning & construction estimates fast.", card: "warhol-card warhol-card-teal" },
              { href: "/invoices", title: "Invoices", desc: "Free Word/PDF builder — even on a library PC.", card: "warhol-card warhol-card-yellow" },
              { href: "/directory", title: "Directory", desc: "Browse Charlotte-oriented operators (growing).", card: "warhol-card warhol-card-indigo" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={item.card + " flex h-full flex-col !p-4"}>
                  <span className="font-display font-bold text-warhol-ink">{item.title}</span>
                  <span className="mt-1 text-sm text-muted leading-relaxed">{item.desc}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-warhol-magenta">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="connect"
          className="rounded-2xl border-3 border-warhol-ink bg-white p-6 sm:p-8 shadow-[6px_6px_0_var(--warhol-magenta)] border-2"
        >
          <div className="flex gap-3 items-start mb-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-warhol-ink bg-warhol-magenta text-white shadow-[3px_3px_0_var(--warhol-ink)]">
              <HeartHandshake className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-warhol-ink">Connect with us</h2>
              <p className="mt-1 text-stone-700 leading-relaxed">
                Questions, ideas, or just <strong className="text-warhol-ink">hello</strong> — send a note
                here. You’ll get a reply at the email you leave. We also get notified at{" "}
                <span className="font-semibold text-warhol-ink">hello.aibloom@outlook.com</span>.
              </p>
            </div>
          </div>
          <ContactForm />
        </section>

        <section className="rounded-xl border-2 border-warhol-ink bg-warhol-cream p-5 flex gap-3 shadow-[4px_4px_0_var(--warhol-yellow)]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-warhol-ink bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/aibloom-flower-mark.jpg" alt="" width={40} height={40} className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="font-display font-extrabold text-warhol-ink text-lg flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-warhol-magenta" />
              AI Bloom
            </p>
            <p className="font-semibold text-warhol-ink">AI made simple.</p>
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
