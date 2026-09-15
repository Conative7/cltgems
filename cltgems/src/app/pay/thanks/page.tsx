import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks · Payment received",
  description: "Thanks for your AI Bloom payment. We’ll follow up by email.",
};

export default function PayThanksPage() {
  return (
    <div className="container-page py-16 sm:py-24 max-w-xl text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-gem" />
      <h1 className="mt-4 font-display text-3xl font-extrabold text-ink">Payment received — thank you</h1>
      <p className="mt-3 text-stone-600 leading-relaxed">
        Stripe confirms the charge. We’ll email you at the address on the receipt with next steps
        (usually within one business day). Questions? hello.aibloom@outlook.com
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/intel" className="btn btn-primary">
          Back to Find leads <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
