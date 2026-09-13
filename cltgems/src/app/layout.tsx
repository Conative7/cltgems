import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { SiteAssistant } from "@/components/chat/SiteAssistant";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aibloom.agency"),
  title: {
    default: "AI Bloom — Charlotte invoices, leads & free Google listing checks",
    template: "%s | AI Bloom",
  },
  description:
    "AI made simple for Charlotte businesses. Free Google listing checks, Find leads packs, Price a job, and invoices without Canva — even on a library PC.",
  keywords: [
    "Charlotte invoice generator",
    "invoice without Canva",
    "Charlotte Google listing audit",
    "HVAC leads Charlotte",
    "AI Bloom",
    "local business leads Charlotte NC",
  ],
  alternates: {
    canonical: "https://www.aibloom.agency",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aibloom.agency",
    siteName: "AI Bloom",
    title: "AI Bloom — Charlotte tools that get you found and paid",
    description:
      "Free Google listing checks, lead packs, job pricing, and invoices without Canva. Built in Charlotte.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Bloom — Charlotte invoices, leads & free Google checks",
    description:
      "AI made simple. Free Google listing checks, Find leads, Price a job, invoices without Canva.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable + " " + nunito.variable + " h-full antialiased"}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SiteAssistant />
      </body>
    </html>
  );
}
