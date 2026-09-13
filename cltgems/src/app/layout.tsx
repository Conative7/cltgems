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
  title: {
    default: "AI Bloom — Charlotte tools for underserved businesses",
    template: "%s | AI Bloom",
  },
  description:
    "AI made simple. Learn. Try. Grow. Practical Charlotte tools — directory, per-task data intel, job pricing, and invoice Word/PDF tools.",
  metadataBase: new URL("https://aibloom.agency"),
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
