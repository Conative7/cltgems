import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
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
    default: "CLT Gems — Charlotte resources for underserved businesses",
    template: "%s | CLT Gems",
  },
  description:
    "Practical resources for Charlotte businesses that are underserved, building, getting certified, and getting paid — directory, grants pointers, and invoice Word/PDF tools.",
  metadataBase: new URL("https://cltgems.com"),
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
      </body>
    </html>
  );
}
