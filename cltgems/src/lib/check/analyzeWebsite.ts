/** Free public-website instant scorecard — no paid APIs. */

export type ScoreItem = {
  id: string;
  label: string; // short plain English
  status: "great" | "missing" | "fix";
  detail: string; // one sentence why
  fix?: string; // only for missing/fix — what to do
  weight: number; // points toward score when great
};

export type WebsiteTeaser = {
  score: number;
  overview: string;
  great: ScoreItem[];
  missing: ScoreItem[];
  fix: ScoreItem[];
  bullets: [string, string, string]; // top 3 priority fixes for skimmers
  upsellHints: string[];
  findings: { label: string; ok: boolean; detail: string }[]; // keep for API compat
  normalizedUrl: string;
  fetchOk: boolean;
  checksRun: number;
};

const UA =
  "Mozilla/5.0 (compatible; AIBloomCheck/1.0; +https://www.aibloom.agency) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CTA_WORDS =
  /\b(contact|book|booking|schedule|call\s*now|get\s*a\s*quote|request\s*quote|free\s*estimate|estimate|appointments?|hire\s*us|get\s*started|quote)\b/i;

const ADDRESS_ISH =
  /\b(\d{1,5}\s+[A-Za-z0-9.\s]+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|way|hwy|highway)\b|\bcharlotte\b|\bnc\s*\d{5}|\bnorth\s*carolina\b)/i;

const HOURS_ISH =
  /\b(hours|open|closed|mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:rs(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?|mon[\s–\-]+fri|9\s*am|5\s*pm)\b/i;

const CONTACT_PATH =
  /href=["'][^"']*(contact|about|services)[^"']*["']/i;

const FAVICON =
  /<link[^>]+rel=["'][^"']*(icon|shortcut\s+icon|apple-touch-icon)[^"']*["']/i;

export function normalizeUrl(raw: string): string {
  let u = raw.trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes(".")) return u;
    return parsed.toString().replace(/\/$/, "") === parsed.origin
      ? parsed.origin + "/"
      : parsed.toString();
  } catch {
    return u;
  }
}

function extractMeta(html: string, name: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  );
  const m = html.match(re) || html.match(re2);
  return m?.[1]?.trim() || "";
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function extractH1Text(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return "";
  return m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function hasViewport(html: string): boolean {
  return /<meta[^>]+name=["']viewport["']/i.test(html);
}

function hasTel(html: string): boolean {
  return /href=["']tel:/i.test(html);
}

function hasMailto(html: string): boolean {
  return /href=["']mailto:/i.test(html);
}

function hasVisibleContactPath(html: string): boolean {
  return CONTACT_PATH.test(html) || /\b(contact\s*us|get\s*in\s*touch|email\s*us)\b/i.test(html);
}

function hasLocalBusinessSchema(html: string): boolean {
  if (/itemtype=["'][^"']*LocalBusiness/i.test(html)) return true;
  const blocks = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (!blocks) return false;
  for (const block of blocks) {
    const inner = block.replace(/<\/?script[^>]*>/gi, "");
    if (
      /LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|Store|Restaurant|Organization/i.test(
        inner
      )
    ) {
      return true;
    }
  }
  return false;
}

function hasOpenGraph(html: string): boolean {
  return /property=["']og:(title|description|image)["']/i.test(html);
}

function countImages(html: string): number {
  const matches = html.match(/<img\b/gi);
  return matches ? matches.length : 0;
}

function hasFavicon(html: string): boolean {
  return FAVICON.test(html);
}

function hasHours(html: string): boolean {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  return HOURS_ISH.test(text);
}

function hasAddress(html: string): boolean {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  return ADDRESS_ISH.test(text);
}

function hasCta(html: string): boolean {
  return CTA_WORDS.test(html);
}

function mixedContentRisk(html: string, pageIsHttps: boolean): boolean {
  if (!pageIsHttps) return false;
  const httpSrc = html.match(
    /(?:src|href)=["']http:\/\/[^"']+["']/gi
  );
  return (httpSrc?.length || 0) >= 3;
}

function isGenericTitle(title: string): boolean {
  const t = title.trim().toLowerCase();
  return (
    t === "home" ||
    t === "homepage" ||
    t === "welcome" ||
    t === "index" ||
    t === "untitled" ||
    /^home\s*[|\-–—]\s*/i.test(title) && title.length < 20
  );
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function partition(items: ScoreItem[]): {
  great: ScoreItem[];
  missing: ScoreItem[];
  fix: ScoreItem[];
} {
  return {
    great: items.filter((i) => i.status === "great"),
    missing: items.filter((i) => i.status === "missing"),
    fix: items.filter((i) => i.status === "fix"),
  };
}

function scoreFromItems(items: ScoreItem[]): number {
  const total = items.reduce((s, i) => s + i.weight, 0);
  if (total <= 0) return 0;
  const earned = items
    .filter((i) => i.status === "great")
    .reduce((s, i) => s + i.weight, 0);
  return clampScore((earned / total) * 100);
}

function buildOverview(
  score: number,
  great: ScoreItem[],
  missing: ScoreItem[],
  fix: ScoreItem[]
): string {
  const band =
    score >= 75 ? "Strong" : score >= 55 ? "Needs work" : "Critical";
  return `Your live scorecard lands at ${score}/100 — ${band}. ${great.length} check${
    great.length === 1 ? "" : "s"
  } look great, ${missing.length} ${
    missing.length === 1 ? "is" : "are"
  } missing, and ${fix.length} need${fix.length === 1 ? "s" : ""} a fix. This free public-HTML scan is instant — not a waiting list — and pairs cleanly with a full Google Business Profile cleanup.`;
}

function buildBullets(missing: ScoreItem[], fix: ScoreItem[]): [string, string, string] {
  const pool = [...missing, ...fix]
    .sort((a, b) => b.weight - a.weight)
    .map((i) => i.fix || i.detail);

  const fallbacks = [
    "Align your website NAP (name, address, phone) exactly with your Google Business Profile — mismatches confuse Charlotte ranking.",
    "Upload fresh job photos and a short “why Charlotte trusts us” blurb; thin sites look risky next to competitors.",
    "Make sure the same website URL is on Google Maps, citations, and your homepage — consistency wins local pack spots.",
  ];

  const out: string[] = [];
  for (const tip of pool) {
    if (out.length >= 3) break;
    if (!out.includes(tip)) out.push(tip);
  }
  let fi = 0;
  while (out.length < 3) {
    const next = fallbacks[fi % fallbacks.length];
    if (!out.includes(next)) out.push(next);
    else out.push(fallbacks[(fi + 1) % fallbacks.length]);
    fi++;
  }
  return [out[0], out[1], out[2]];
}

function upsellHintsFor(score: number, gapCount: number): string[] {
  return [
    "The $97 GBP cleanup PDF maps every Google Business Profile field, photo, Q&A, and review ask — ready to hand a VA.",
    "Upgrade with a Hot Lead Pack when you want nearby Charlotte businesses that still look incomplete online.",
    gapCount >= 4 || score < 60
      ? "Several on-page gaps usually mean the Maps listing needs the same cleanup — that’s what the $97 PDF is for."
      : "Even strong sites leave ranking on the table without categories, photos, and review velocity dialed in.",
  ].slice(0, 3);
}

function toFindings(items: ScoreItem[]): WebsiteTeaser["findings"] {
  return items.map((i) => ({
    label: i.label,
    ok: i.status === "great",
    detail: i.detail,
  }));
}

function finalize(items: ScoreItem[], normalizedUrl: string, fetchOk: boolean): WebsiteTeaser {
  const { great, missing, fix } = partition(items);
  const score = scoreFromItems(items);
  return {
    score,
    overview: buildOverview(score, great, missing, fix),
    great,
    missing,
    fix,
    bullets: buildBullets(missing, fix),
    upsellHints: upsellHintsFor(score, missing.length + fix.length),
    findings: toFindings(items),
    normalizedUrl,
    fetchOk,
    checksRun: items.length,
  };
}

/** Charlotte GBP tips when fetch fails — UI never blank. */
function failureScorecard(reason: string, normalizedUrl: string): WebsiteTeaser {
  const httpsGuess = normalizedUrl.startsWith("https://");
  const items: ScoreItem[] = [
    {
      id: "reachable",
      label: "Site loads",
      status: "fix",
      detail: `Couldn’t load the page (${reason}).`,
      fix: "Confirm the URL opens in a browser and isn’t blocking bots, then resubmit.",
      weight: 12,
    },
    {
      id: "https",
      label: "HTTPS",
      status: httpsGuess ? "great" : "missing",
      detail: httpsGuess
        ? "URL looks like HTTPS — verify it loads securely."
        : "No https:// on the URL we tried.",
      fix: httpsGuess ? undefined : "Move the site to HTTPS and use that URL on Google Business Profile.",
      weight: 8,
    },
    {
      id: "title",
      label: "Page title",
      status: "missing",
      detail: "Couldn’t read the page title without a live HTML scan.",
      fix: "Set a descriptive title with business name + service + Charlotte (10–60 characters).",
      weight: 8,
    },
    {
      id: "meta",
      label: "Meta description",
      status: "missing",
      detail: "Meta description wasn’t readable without a successful fetch.",
      fix: "Add a 50–160 character meta description with your niche and Charlotte.",
      weight: 7,
    },
    {
      id: "viewport",
      label: "Mobile viewport",
      status: "missing",
      detail: "Viewport meta couldn’t be checked.",
      fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
      weight: 6,
    },
    {
      id: "h1",
      label: "Clear H1 headline",
      status: "missing",
      detail: "H1 couldn’t be verified.",
      fix: "Add one H1 that says what you do and where (e.g. Charlotte HVAC repair).",
      weight: 6,
    },
    {
      id: "tel",
      label: "Click-to-call phone",
      status: "missing",
      detail: "No live page to scan for tel: links.",
      fix: "Put a clickable tel: link in the header — Charlotte mobile searchers call first.",
      weight: 9,
    },
    {
      id: "email",
      label: "Email or contact path",
      status: "missing",
      detail: "Contact paths couldn’t be checked.",
      fix: "Add mailto: or clear Contact / About links so visitors can reach you.",
      weight: 5,
    },
    {
      id: "address",
      label: "Address / city",
      status: "missing",
      detail: "Address signals weren’t readable.",
      fix: "Show your street or Charlotte/NC service area on the homepage for Maps NAP match.",
      weight: 8,
    },
    {
      id: "cta",
      label: "Strong CTA",
      status: "missing",
      detail: "CTA language couldn’t be checked.",
      fix: "Add a bold Book / Quote / Contact / Estimate button above the fold.",
      weight: 7,
    },
    {
      id: "og",
      label: "Open Graph tags",
      status: "missing",
      detail: "Share preview tags weren’t readable.",
      fix: "Add og:title, og:description, and og:image for pro-looking shares.",
      weight: 4,
    },
    {
      id: "schema",
      label: "LocalBusiness schema",
      status: "missing",
      detail: "Structured data couldn’t be checked.",
      fix: "Add LocalBusiness JSON-LD with name, phone, address, and hours.",
      weight: 8,
    },
    {
      id: "images",
      label: "Images present",
      status: "missing",
      detail: "Image tags couldn’t be counted.",
      fix: "Add real job photos — empty pages lose trust next to Charlotte competitors.",
      weight: 3,
    },
    {
      id: "favicon",
      label: "Favicon",
      status: "missing",
      detail: "Favicon link couldn’t be checked.",
      fix: "Add a favicon link so browser tabs look branded.",
      weight: 2,
    },
    {
      id: "nav",
      label: "Contact / About / Services links",
      status: "missing",
      detail: "Navigation hints weren’t readable.",
      fix: "Link to Contact, About, or Services pages from the main nav.",
      weight: 4,
    },
    {
      id: "hours",
      label: "Hours language",
      status: "missing",
      detail: "Hours wording couldn’t be checked.",
      fix: "Publish Mon–Fri (or daily) hours on the site to match your Google listing.",
      weight: 2,
    },
    {
      id: "mixed",
      label: "Mixed content risk",
      status: "missing",
      detail: "Couldn’t scan for insecure http assets.",
      fix: "Serve all images and scripts over HTTPS once the site is live securely.",
      weight: 2,
    },
    {
      id: "title-specificity",
      label: "Specific (not generic) title",
      status: "missing",
      detail: "Title specificity couldn’t be judged without HTML.",
      fix: "Avoid a bare “Home” title — include business name and service.",
      weight: 3,
    },
  ];

  // Soft-adjust overview for failure path
  const result = finalize(items, normalizedUrl, false);
  result.overview = `We couldn’t fully scan ${
    normalizedUrl || "that site"
  } (${reason}). Score ${result.score}/100 reflects that the site didn’t load for us — ${
    result.great.length
  } signal${result.great.length === 1 ? "" : "s"} still look okay from the URL, while ${
    result.missing.length + result.fix.length
  } items need attention. Here’s a Charlotte-ready scorecard so this page is never blank.`;
  return result;
}

function buildLiveItems(opts: {
  finalUrl: string;
  httpsOk: boolean;
  html: string;
}): ScoreItem[] {
  const { finalUrl, httpsOk, html } = opts;
  const title = extractTitle(html);
  const metaDesc = extractMeta(html, "description");
  const viewport = hasViewport(html);
  const h1Text = extractH1Text(html);
  const h1Ok = h1Text.length >= 3;
  const tel = hasTel(html);
  const mailto = hasMailto(html);
  const contactPath = hasVisibleContactPath(html);
  const address = hasAddress(html);
  const cta = hasCta(html);
  const og = hasOpenGraph(html);
  const schema = hasLocalBusinessSchema(html);
  const imgCount = countImages(html);
  const favicon = hasFavicon(html);
  const navHint = CONTACT_PATH.test(html);
  const hours = hasHours(html);
  const mixed = mixedContentRisk(html, httpsOk);
  const genericTitle = title.length > 0 && isGenericTitle(title);

  const items: ScoreItem[] = [];

  // 1. Site loads
  items.push({
    id: "reachable",
    label: "Site loads",
    status: "great",
    detail: `Homepage loaded successfully (${finalUrl}).`,
    weight: 12,
  });

  // 2. HTTPS
  items.push(
    httpsOk
      ? {
          id: "https",
          label: "HTTPS",
          status: "great",
          detail: "Secure https connection — visitors and Google prefer it.",
          weight: 8,
        }
      : {
          id: "https",
          label: "HTTPS",
          status: "fix",
          detail: "Page is not on HTTPS.",
          fix: "Install an SSL certificate and use the https:// URL on your Google Business Profile.",
          weight: 8,
        }
  );

  // 3. Page title present & useful
  if (!title) {
    items.push({
      id: "title",
      label: "Page title",
      status: "missing",
      detail: "No <title> tag found — hurts SEO and listing clarity.",
      fix: "Add a title with business name + service + Charlotte (aim 10–60 characters).",
      weight: 8,
    });
  } else if (title.length >= 10 && title.length <= 60) {
    items.push({
      id: "title",
      label: "Page title",
      status: "great",
      detail: `Solid title (${title.length} chars): “${title.slice(0, 70)}${
        title.length > 70 ? "…" : ""
      }”.`,
      weight: 8,
    });
  } else {
    items.push({
      id: "title",
      label: "Page title",
      status: "fix",
      detail: `Title length is ${title.length} characters (best is 10–60).`,
      fix: "Tighten or expand the title toward 10–60 characters with niche + city.",
      weight: 8,
    });
  }

  // 4. Meta description
  if (!metaDesc) {
    items.push({
      id: "meta",
      label: "Meta description",
      status: "missing",
      detail: "No meta description — search snippets look thin.",
      fix: "Write a 50–160 character meta description with your niche and Charlotte.",
      weight: 7,
    });
  } else if (metaDesc.length >= 50 && metaDesc.length <= 160) {
    items.push({
      id: "meta",
      label: "Meta description",
      status: "great",
      detail: `Good meta description length (${metaDesc.length} chars).`,
      weight: 7,
    });
  } else {
    items.push({
      id: "meta",
      label: "Meta description",
      status: "fix",
      detail: `Meta description is ${metaDesc.length} characters (aim 50–160).`,
      fix: "Rewrite the meta description to land between 50 and 160 characters.",
      weight: 7,
    });
  }

  // 5. Mobile viewport
  items.push(
    viewport
      ? {
          id: "viewport",
          label: "Mobile viewport",
          status: "great",
          detail: "Viewport meta present — phone-friendly signal.",
          weight: 6,
        }
      : {
          id: "viewport",
          label: "Mobile viewport",
          status: "missing",
          detail: "No viewport meta — mobile users may struggle.",
          fix: "Add a viewport meta tag (width=device-width, initial-scale=1).",
          weight: 6,
        }
  );

  // 6. Clear H1
  items.push(
    h1Ok
      ? {
          id: "h1",
          label: "Clear H1 headline",
          status: "great",
          detail: `H1 found: “${h1Text.slice(0, 60)}${h1Text.length > 60 ? "…" : ""}”.`,
          weight: 6,
        }
      : {
          id: "h1",
          label: "Clear H1 headline",
          status: "missing",
          detail: "No clear H1 headline on the page.",
          fix: "Add one H1 that states what you do and where (Charlotte).",
          weight: 6,
        }
  );

  // 7. Click-to-call
  items.push(
    tel
      ? {
          id: "tel",
          label: "Click-to-call phone",
          status: "great",
          detail: "tel: link found — great for mobile callers.",
          weight: 9,
        }
      : {
          id: "tel",
          label: "Click-to-call phone",
          status: "missing",
          detail: "No clickable tel: link spotted.",
          fix: "Add a header tel: link — Charlotte mobile searchers call before they scroll.",
          weight: 9,
        }
  );

  // 8. Email mailto OR visible contact path
  if (mailto || contactPath) {
    items.push({
      id: "email",
      label: "Email or contact path",
      status: "great",
      detail: mailto
        ? "mailto: link found."
        : "Visible contact / about path found for reaching you.",
      weight: 5,
    });
  } else {
    items.push({
      id: "email",
      label: "Email or contact path",
      status: "missing",
      detail: "No mailto: or obvious contact path found.",
      fix: "Add a mailto: link or clear Contact page so leads can reach you.",
      weight: 5,
    });
  }

  // 9. Physical address / city
  items.push(
    address
      ? {
          id: "address",
          label: "Address / city",
          status: "great",
          detail: "Address- or Charlotte-area text detected.",
          weight: 8,
        }
      : {
          id: "address",
          label: "Address / city",
          status: "missing",
          detail: "No clear street or Charlotte/NC address on the page.",
          fix: "Show street or service-area city so Google can match Maps NAP.",
          weight: 8,
        }
  );

  // 10. Strong CTA
  items.push(
    cta
      ? {
          id: "cta",
          label: "Strong CTA",
          status: "great",
          detail: "Book / quote / contact / estimate language found.",
          weight: 7,
        }
      : {
          id: "cta",
          label: "Strong CTA",
          status: "missing",
          detail: "Weak or missing call-to-action language.",
          fix: "Put a bold Book / Quote / Contact / Estimate button above the fold.",
          weight: 7,
        }
  );

  // 11. Open Graph
  items.push(
    og
      ? {
          id: "og",
          label: "Open Graph tags",
          status: "great",
          detail: "Open Graph tags present for share previews.",
          weight: 4,
        }
      : {
          id: "og",
          label: "Open Graph tags",
          status: "missing",
          detail: "Missing og: tags — weaker when shared on social.",
          fix: "Add og:title, og:description, and og:image.",
          weight: 4,
        }
  );

  // 12. LocalBusiness schema
  items.push(
    schema
      ? {
          id: "schema",
          label: "LocalBusiness schema",
          status: "great",
          detail: "Local/business structured data found.",
          weight: 8,
        }
      : {
          id: "schema",
          label: "LocalBusiness schema",
          status: "missing",
          detail: "No LocalBusiness JSON-LD spotted.",
          fix: "Add LocalBusiness schema with name, phone, address, and hours.",
          weight: 8,
        }
  );

  // 13. Images present
  items.push(
    imgCount > 0
      ? {
          id: "images",
          label: "Images present",
          status: "great",
          detail: `${imgCount} image tag${imgCount === 1 ? "" : "s"} found on the page.`,
          weight: 3,
        }
      : {
          id: "images",
          label: "Images present",
          status: "missing",
          detail: "No <img> tags found — pages without photos look thin.",
          fix: "Add real job or team photos to build trust.",
          weight: 3,
        }
  );

  // 14. Favicon
  items.push(
    favicon
      ? {
          id: "favicon",
          label: "Favicon",
          status: "great",
          detail: "Favicon (or apple-touch-icon) link present.",
          weight: 2,
        }
      : {
          id: "favicon",
          label: "Favicon",
          status: "missing",
          detail: "No favicon link found.",
          fix: "Add a favicon so browser tabs look branded.",
          weight: 2,
        }
  );

  // 15. Contact / about / services in links
  items.push(
    navHint
      ? {
          id: "nav",
          label: "Contact / About / Services links",
          status: "great",
          detail: "Nav or footer links hint at Contact, About, or Services.",
          weight: 4,
        }
      : {
          id: "nav",
          label: "Contact / About / Services links",
          status: "missing",
          detail: "No href containing contact, about, or services spotted.",
          fix: "Add Contact, About, or Services links in the main navigation.",
          weight: 4,
        }
  );

  // 16. Hours language (soft)
  items.push(
    hours
      ? {
          id: "hours",
          label: "Hours language",
          status: "great",
          detail: "Hours / open / weekday language found on the page.",
          weight: 2,
        }
      : {
          id: "hours",
          label: "Hours language",
          status: "missing",
          detail: "No clear open/hours wording spotted (soft check).",
          fix: "Publish business hours that match your Google listing.",
          weight: 2,
        }
  );

  // 17. Mixed content (soft)
  if (mixed) {
    items.push({
      id: "mixed",
      label: "Mixed content risk",
      status: "fix",
      detail: "Several http:// assets on an https page — browsers may block them.",
      fix: "Update image/script URLs to https:// to avoid mixed-content warnings.",
      weight: 2,
    });
  } else {
    items.push({
      id: "mixed",
      label: "Mixed content risk",
      status: "great",
      detail: httpsOk
        ? "No heavy mixed-content pattern detected."
        : "N/A until the site is on HTTPS — no mixed-content flag raised.",
      weight: 2,
    });
  }

  // 18. Title specificity vs generic Home
  if (!title) {
    items.push({
      id: "title-specificity",
      label: "Specific (not generic) title",
      status: "missing",
      detail: "No title to judge specificity.",
      fix: "Use a business-specific title, not a bare “Home”.",
      weight: 3,
    });
  } else if (genericTitle) {
    items.push({
      id: "title-specificity",
      label: "Specific (not generic) title",
      status: "fix",
      detail: `Title looks generic (“${title.slice(0, 40)}”).`,
      fix: "Replace a bare “Home” title with business name + service + city.",
      weight: 3,
    });
  } else {
    items.push({
      id: "title-specificity",
      label: "Specific (not generic) title",
      status: "great",
      detail: "Title looks business-specific rather than a bare “Home”.",
      weight: 3,
    });
  }

  return items;
}

export async function analyzeWebsite(website: string): Promise<WebsiteTeaser> {
  const normalizedUrl = normalizeUrl(website);
  if (!normalizedUrl) {
    return failureScorecard("no website provided", "");
  }

  let html = "";
  let finalUrl = normalizedUrl;
  let httpsOk = normalizedUrl.startsWith("https://");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(normalizedUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return failureScorecard(`site returned HTTP ${res.status}`, normalizedUrl);
    }
    finalUrl = res.url || normalizedUrl;
    httpsOk = finalUrl.startsWith("https://");
    const ctype = res.headers.get("content-type") || "";
    html = await res.text();
    if (html.length > 500_000) html = html.slice(0, 500_000);
    if (!ctype.includes("html") && !html.includes("<html") && !html.includes("<body")) {
      return failureScorecard("response was not HTML", normalizedUrl);
    }
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === "AbortError"
          ? "timed out after ~8s"
          : err.message.slice(0, 120)
        : "fetch failed";
    return failureScorecard(msg, normalizedUrl);
  }

  const items = buildLiveItems({ finalUrl, httpsOk, html });
  return finalize(items, finalUrl, true);
}
