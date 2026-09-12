export interface ResourceGem {
  id: string;
  title: string;
  summary: string;
  href: string;
  cta: string;
  tags: string[];
  verifyNote?: boolean;
  group: "Certification & contracting" | "City & county" | "Capital & counseling" | "Workforce" | "Getting paid";
}

export const RESOURCE_GEMS: ResourceGem[] = [
  {
    id: "ncsbe",
    title: "NC Small Business Enterprise (NCSBE)",
    summary:
      "State small-business certification pathway after the HUB office closed (July 2026). Check current NCSBE status, transition FAQs, and contact NCSBE@doa.nc.gov.",
    href: "https://www.doa.nc.gov/divisions/small-business-enterprise-program",
    cta: "Open NCSBE program",
    tags: ["NCSBE", "State", "Certification"],
    verifyNote: true,
    group: "Certification & contracting",
  },
  {
    id: "charlotte-supplier",
    title: "City of Charlotte — Supplier registration",
    summary:
      "Register as a city supplier to get purchase orders, payments, and visibility for contracting opportunities.",
    href: "https://www.charlottenc.gov/Growth-and-Development/Doing-Business/Vendor-Registration",
    cta: "Register as a supplier",
    tags: ["Procurement", "City"],
    group: "City & county",
  },
  {
    id: "charlotte-cbi",
    title: "Charlotte Business INClusion — Get certified",
    summary:
      "City MWSBE / small business certification for greater exposure on Charlotte contracts. Register as a supplier first, then apply.",
    href: "https://www.charlottenc.gov/City-Government/Departments/Contracting-and-Procurement/CBI/Get-Small-Business-Certified",
    cta: "Start certification",
    tags: ["MWSBE", "SBE", "City"],
    group: "Certification & contracting",
  },
  {
    id: "charlotte-contracts",
    title: "City of Charlotte — Contract opportunities",
    summary:
      "Active and planned city solicitations in one place (Bonfire hub + city portal).",
    href: "https://www.charlottenc.gov/Growth-and-Development/Doing-Business/Contract-Opportunities",
    cta: "Browse opportunities",
    tags: ["Bids", "Procurement"],
    group: "City & county",
  },
  {
    id: "sba-nc",
    title: "SBA North Carolina District",
    summary:
      "Federal counseling, lending partners, and contracting readiness. Charlotte main office on Fairview Road (appointments).",
    href: "https://www.sba.gov/district/north-carolina",
    cta: "Visit SBA NC",
    tags: ["SBA", "Capital", "Counseling"],
    group: "Capital & counseling",
  },
  {
    id: "score-charlotte",
    title: "SCORE Charlotte — free mentors",
    summary:
      "Free mentor matching for business plans, marketing, operations, and cash-flow habits — useful before chasing capital.",
    href: "https://www.score.org/charlotte/find-or-become-a-mentor/local-mentors",
    cta: "Find a mentor",
    tags: ["Mentoring", "Free"],
    group: "Capital & counseling",
  },
  {
    id: "charlotte-works",
    title: "Charlotte Works",
    summary:
      "Mecklenburg workforce board — hiring help, training partners, and employer services.",
    href: "https://www.charlotteworks.com/",
    cta: "Explore workforce help",
    tags: ["Workforce", "Hiring"],
    group: "Workforce",
  },
  {
    id: "irs-ein",
    title: "IRS — Get an EIN (free)",
    summary:
      "Official free Employer Identification Number so you can invoice and bank as a business — never pay a middleman for this.",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    cta: "Apply for EIN",
    tags: ["Tax ID", "Free"],
    group: "Getting paid",
  },
  {
    id: "invoice-builder",
    title: "Invoice builder (this site)",
    summary:
      "Build a clear Word or PDF invoice on phone or library PC, email/share it, then wipe your session when done.",
    href: "/invoices",
    cta: "Build an invoice",
    tags: ["Invoices", "PDF", "Word"],
    group: "Getting paid",
  },
];
