export interface ResourceGem {
  id: string;
  title: string;
  summary: string;
  href: string;
  tags: string[];
  verifyNote?: boolean;
  group: "Grants & aid" | "City & county" | "Workforce & certification" | "Getting paid";
}

export const RESOURCE_GEMS: ResourceGem[] = [
  {
    id: "ncsbe",
    title: "NC Statewide Uniform Certification (NCSBE / HUB)",
    summary: "Apply or renew Historically Underutilized Business certification with the State of North Carolina.",
    href: "https://ncadmin.nc.gov/businesses/historically-underutilized-businesses-hub",
    tags: ["HUB", "Certification"],
    group: "Workforce & certification",
  },
  {
    id: "meck-vendor",
    title: "Mecklenburg County Vendor Opportunities",
    summary: "County purchasing and vendor registration pathways for local contractors and suppliers.",
    href: "https://www.mecknc.gov/",
    tags: ["Procurement", "County"],
    verifyNote: true,
    group: "City & county",
  },
  {
    id: "charlotte-biz",
    title: "City of Charlotte — Economic Development",
    summary: "City programs, business resources, and economic development contacts for Charlotte operators.",
    href: "https://www.charlottenc.gov/",
    tags: ["City", "Small business"],
    verifyNote: true,
    group: "City & county",
  },
  {
    id: "skilled-to-build",
    title: "Skilled to Build (workforce / construction pathways)",
    summary: "Workforce and construction career pathway programs referenced by local partners — confirm current cohorts on the official program site.",
    href: "https://www.charlottenc.gov/",
    tags: ["Workforce", "Construction"],
    verifyNote: true,
    group: "Workforce & certification",
  },
  {
    id: "sba-nc",
    title: "SBA North Carolina District",
    summary: "Federal small-business counseling, lending partners, and contracting readiness resources.",
    href: "https://www.sba.gov/district/north-carolina",
    tags: ["SBA", "Capital"],
    group: "Grants & aid",
  },
  {
    id: "nc-commerce",
    title: "NC Department of Commerce — Business Resources",
    summary: "State-level economic development, small business, and workforce pointers.",
    href: "https://www.commerce.nc.gov/",
    tags: ["State", "Development"],
    group: "Grants & aid",
  },
  {
    id: "score-charlotte",
    title: "SCORE Mentoring (Charlotte area)",
    summary: "Free mentor matching for business plans, marketing, and operations — useful before chasing capital.",
    href: "https://www.score.org/",
    tags: ["Mentoring", "Free"],
    verifyNote: true,
    group: "Workforce & certification",
  },
  {
    id: "charlotte-works",
    title: "Charlotte Works / local workforce boards",
    summary: "Job seeker and employer workforce services; useful for staffing and training partnerships.",
    href: "https://www.charlotteworks.com/",
    tags: ["Workforce", "Hiring"],
    verifyNote: true,
    group: "Workforce & certification",
  },
  {
    id: "dbe-ncdot",
    title: "NCDOT Disadvantaged Business Enterprise (DBE)",
    summary: "Transportation-related DBE certification and contracting information for NC firms.",
    href: "https://www.ncdot.gov/",
    tags: ["DBE", "Transportation"],
    verifyNote: true,
    group: "Workforce & certification",
  },
  {
    id: "irs-ein",
    title: "IRS — Get an EIN (free)",
    summary: "Official free EIN application so you can invoice and bank as a business without paying a middleman.",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    tags: ["Tax ID", "Getting paid"],
    group: "Getting paid",
  },
  {
    id: "clt-traffic",
    title: "Charlotte traffic & road conditions (NCDOT)",
    summary: "Check incidents and road work before job runs — external live traffic resource.",
    href: "https://drivenc.gov/",
    tags: ["Traffic", "Field ops"],
    group: "City & county",
  },
  {
    id: "invoice-tip",
    title: "CLT Gems Invoice Library",
    summary: "Build Word + PDF invoices on a library PC, then wipe your session before you leave.",
    href: "/invoices",
    tags: ["Invoices", "Docs"],
    group: "Getting paid",
  },
];
