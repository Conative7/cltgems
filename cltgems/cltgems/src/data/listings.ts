export type Certification =
  | "HUB"
  | "Minority-owned"
  | "Woman-owned"
  | "Veteran"
  | "NCSBE"
  | "DBE";

export type Category =
  | "Construction"
  | "Mobility & Transit"
  | "Cleaning"
  | "Consulting"
  | "Logistics"
  | "IT & Tech"
  | "Professional Services"
  | "Facilities";

export interface Listing {
  id: string;
  name: string;
  category: Category;
  area: string;
  certifications: Certification[];
  blurb: string;
  phone?: string;
  website?: string;
}

/** Demo / sample listings for MVP — replace with live directory data. */
export const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    name: "Tryon Trades Collective",
    category: "Construction",
    area: "Uptown / Center City",
    certifications: ["HUB", "Minority-owned", "NCSBE"],
    blurb: "General contracting and small commercial build-outs serving Charlotte nonprofits and HUB primes.",
    phone: "(704) 555-0101",
    website: "https://example.com/tryon-trades",
  },
  {
    id: "2",
    name: "Queen City Mobility Partners",
    category: "Mobility & Transit",
    area: "West Charlotte",
    certifications: ["HUB", "Woman-owned"],
    blurb: "Fleet support, ADA transport coordination, and last-mile mobility consulting for employers.",
    phone: "(704) 555-0102",
  },
  {
    id: "3",
    name: "Freedom Drive Facilities Care",
    category: "Cleaning",
    area: "West Blvd corridor",
    certifications: ["Minority-owned", "HUB"],
    blurb: "Commercial janitorial and post-construction clean for offices, clinics, and job sites.",
    phone: "(704) 555-0103",
  },
  {
    id: "4",
    name: "Beatties Ford Business Advisors",
    category: "Consulting",
    area: "North Charlotte",
    certifications: ["Minority-owned", "Woman-owned"],
    blurb: "Certification readiness, proposal coaching, and bookkeeping setup for first-time city vendors.",
    website: "https://example.com/bfba",
  },
  {
    id: "5",
    name: "Piedmont Load & Haul",
    category: "Logistics",
    area: "Airport / Steele Creek",
    certifications: ["Veteran", "HUB", "NCSBE"],
    blurb: "Local trucking, material delivery, and jobsite logistics for Mecklenburg County projects.",
    phone: "(704) 555-0105",
  },
  {
    id: "6",
    name: "NoDa Network Solutions",
    category: "IT & Tech",
    area: "NoDa",
    certifications: ["HUB", "Minority-owned"],
    blurb: "Managed IT, Point-of-sale support, and simple websites for neighborhood shops and contractors.",
    website: "https://example.com/noda-net",
  },
  {
    id: "7",
    name: "South End Scaffold & Safety",
    category: "Construction",
    area: "South End",
    certifications: ["HUB", "DBE"],
    blurb: "Scaffold rental, fall-protection training, and site safety walkthroughs for mid-size GC teams.",
    phone: "(704) 555-0107",
  },
  {
    id: "8",
    name: "Eastland Access Transit Aids",
    category: "Mobility & Transit",
    area: "East Charlotte",
    certifications: ["Woman-owned", "NCSBE"],
    blurb: "Non-emergency medical transport coordination and mobility equipment referrals.",
    phone: "(704) 555-0108",
  },
  {
    id: "9",
    name: "Mint Hill Maintenance Co-op",
    category: "Facilities",
    area: "Mint Hill / East",
    certifications: ["HUB"],
    blurb: "Preventive maintenance, light HVAC filter changes, and facilities handyman crews.",
  },
  {
    id: "10",
    name: "Plaza Midwood Creative Ops",
    category: "Professional Services",
    area: "Plaza Midwood",
    certifications: ["Woman-owned", "Minority-owned"],
    blurb: "Brand kits, print-ready flyers, and bilingual marketing for local service businesses.",
    website: "https://example.com/pmco",
  },
  {
    id: "11",
    name: "University City Concrete Finishers",
    category: "Construction",
    area: "University City",
    certifications: ["HUB", "Minority-owned", "Veteran"],
    blurb: "Flatwork, sidewalks, and small pad pours for residential and light commercial sites.",
    phone: "(704) 555-0111",
  },
  {
    id: "12",
    name: "Steele Creek Supply Runners",
    category: "Logistics",
    area: "Steele Creek",
    certifications: ["HUB", "NCSBE"],
    blurb: "Same-day parts and materials courier for trades between Charlotte warehouses and job sites.",
    phone: "(704) 555-0112",
  },
  {
    id: "13",
    name: "Grier Heights Green Clean",
    category: "Cleaning",
    area: "Grier Heights",
    certifications: ["Woman-owned", "Minority-owned"],
    blurb: "Eco-friendly residential and small-office cleaning with flexible scheduling.",
  },
  {
    id: "14",
    name: "CLT Compliance Desk",
    category: "Consulting",
    area: "Uptown",
    certifications: ["HUB", "Woman-owned", "NCSBE"],
    blurb: "NCSBE / HUB application walkthroughs and document checklists for Mecklenburg vendors.",
    website: "https://example.com/clt-compliance",
  },
  {
    id: "15",
    name: "River District Electric Crew",
    category: "Construction",
    area: "River District / West",
    certifications: ["HUB", "DBE", "Minority-owned"],
    blurb: "Licensed electrical subcontracting for multi-family and light commercial tenants.",
    phone: "(704) 555-0115",
  },
  {
    id: "16",
    name: "Ballantyne Bookkeeping Bar",
    category: "Professional Services",
    area: "Ballantyne",
    certifications: ["Woman-owned"],
    blurb: "Invoice workflows, QuickBooks setup, and getting-paid coaching for solo operators.",
    website: "https://example.com/bbb-clt",
  },
];

export const CATEGORIES: Category[] = [
  "Construction",
  "Mobility & Transit",
  "Cleaning",
  "Consulting",
  "Logistics",
  "IT & Tech",
  "Professional Services",
  "Facilities",
];

export const CERTIFICATIONS: Certification[] = [
  "HUB",
  "Minority-owned",
  "Woman-owned",
  "Veteran",
  "NCSBE",
  "DBE",
];
