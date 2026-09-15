export type ChatLink = { label: string; href: string };

export type AssistantReply = {
  text: string;
  links?: ChatLink[];
};

export type Suggestion = { label: string; prompt: string };

export const SUGGESTIONS: Suggestion[] = [
  { label: "Find leads", prompt: "How do I find leads?" },
  { label: "Free Google check", prompt: "I want a free Google listing check" },
  { label: "Price a job", prompt: "Where can I price a job?" },
  { label: "Estimate", prompt: "How do I make an estimate?" },
  { label: "Invoices", prompt: "How do I make an invoice?" },
  { label: "Pay / buy", prompt: "How do I pay?" },
  { label: "Talk to a person", prompt: "I want to talk to a person" },
];

const LINKS = {
  intel: { label: "Find leads", href: "/intel" },
  price: { label: "Price a job", href: "/price" },
  estimate: { label: "Estimate & agreement", href: "/estimate" },
  invoices: { label: "Invoices", href: "/invoices" },
  directory: { label: "Directory", href: "/directory" },
  about: { label: "About & connect", href: "/about#connect" },
  check: { label: "Free Google check", href: "/check" },
  add: { label: "Add your business", href: "/add" },
  starter: { label: "Get started ($497)", href: "/starter" },
  pay: { label: "Pay / buy", href: "/pay" },
} as const;

function has(q: string, words: string[]) {
  return words.some((w) => q.includes(w));
}

/** Simple, friendly intent matcher — works with zero API keys */
export function replyTo(userText: string): AssistantReply {
  const q = userText.toLowerCase().trim();

  if (!q) {
    return {
      text: "Tell me what you need — leads, pricing, invoices, or just say hello.",
      links: [LINKS.intel, LINKS.about],
    };
  }

  if (has(q, ["hello", "hi ", "hey", "good morning", "good afternoon", "howdy"])) {
    return {
      text: "Hey! I’m the AI Bloom helper. I can point you to the right tool or answer quick questions about leads, pricing, and invoices.",
      links: [LINKS.intel, LINKS.price, LINKS.invoices],
    };
  }

  if (has(q, ["human", "person", "someone", "email", "contact", "talk", "call", "reach", "hello.aibloom", "support"])) {
    return {
      text: "Happy to connect you with a real person. Send a note on About → Connect with us, or email hello.aibloom@outlook.com. We reply as soon as we can.",
      links: [LINKS.about],
    };
  }

  if (has(q, ["price", "cost", "how much", "pricing", "$", "dollar", "fee", "charge"])) {
    if (has(q, ["audit", "google", "listing", "cleanup", "map"])) {
      return {
        text: "Google listing help: we often start with a free 3-bullet check. A full cleanup checklist/PDF is $97 (also available white-label). Want leads instead? Open Find leads or Pay.",
        links: [LINKS.pay, LINKS.check, LINKS.intel],
      };
    }
    return {
      text: "Find leads packs (per task, no subscription):\n• Neighborhood — $49 (~50–100 listings)\n• Hot Lead Pack — $97 (starter)\n• Metro Sweep — $197\n• Custom — from $97\n\nAlso: $97 Google listing audits. Pay online on the Pay page.",
      links: [LINKS.pay, LINKS.intel],
    };
  }

  if (has(q, ["lead", "leads", "outscraper", "scrap", "list", "hot lead", "intel", "data", "prospect", "no website", "review"])) {
    return {
      text: "Find leads is our per-task shop for local business lists (Charlotte-focused). Pick a pack, pay on the Pay page, tell us niche + city — you get a cleaned CSV. No monthly subscription.",
      links: [LINKS.pay, LINKS.intel],
    };
  }

  if (has(q, ["invoice", "invoices", "pdf", "word", "bill", "billing"])) {
    return {
      text: "You can build a clean invoice for free and download Word or PDF — even on a library PC. Open Invoices to start.",
      links: [LINKS.invoices],
    };
  }

  if (has(q, ["estimate", "agreement", "scope of work", "work agreement", "quote", "proposal"])) {
    return {
      text: "Estimate & agreement builds a simple scope + price PDF clients can accept (not legal advice). You can import from Price a job, then turn it into an invoice.",
      links: [LINKS.estimate, LINKS.price, LINKS.invoices],
    };
  }

  if (has(q, ["job price", "pricing tool", "cleaning", "construction", "how much should i charge"])) {
    return {
      text: "Use Price a job for a fast ballpark on cleaning & construction-style work. Then create an estimate / agreement or invoice.",
      links: [LINKS.price, LINKS.estimate],
    };
  }

  if (has(q, ["directory", "businesses", "browse", "find a company"])) {
    return {
      text: "The Directory lists Charlotte-oriented operators — it’s growing. You can also add your own business.",
      links: [LINKS.directory, LINKS.add],
    };
  }

  if (has(q, ["add business", "list my", "submit", "get listed"])) {
    return {
      text: "You can add your business to the directory from the Add business page. Takes a couple minutes.",
      links: [LINKS.add],
    };
  }

  if (has(q, ["about", "who are you", "ai bloom", "what is this", "charlotte", "what do you do"])) {
    return {
      text: "AI Bloom makes AI and simple tools usable for real Charlotte businesses — find leads, price jobs, invoice, and get help without the jargon. Learn. Try. Grow.",
      links: [LINKS.about, LINKS.intel],
    };
  }


  if (has(q, ["starter", "497", "get started", "operator pack", "setup call", "follow-up kit", "follow up kit"])) {
    return {
      text: "AI Bloom Starter for Operators is $497 (one-time, ~1 week): we set your Price a job rates, invoice pack, and AI follow-up scripts, plus a 30-min setup (or Loom) and 30 days email support. Free tools stay free — this is the done-with-you package.",
      links: [LINKS.starter, LINKS.about],
    };
  }

  if (has(q, ["order", "buy", "purchase", "pay", "how do i get"])) {
    return {
      text: "Open Pay to buy a lead pack, $97 Google cleanup, or the $497 Starter with card. Or Connect with us for Venmo / Zelle / invoice.",
      links: [LINKS.pay, LINKS.starter, LINKS.about],
    };
  }

  if (has(q, ["navigate", "where", "help", "lost", "menu", "pages", "site map", "what can"])) {
    return {
      text: "Here’s the map:\n• Find leads — local lists\n• Price a job — quick ballpark\n• Estimate — scope + agreement PDF\n• Invoices — Word/PDF\n• Get started — $497 Starter setup\n• Directory — browse / add\n• About — connect with us\n\nTap a button below, or ask in plain words.",
      links: [LINKS.intel, LINKS.price, LINKS.estimate, LINKS.invoices, LINKS.starter, LINKS.about],
    };
  }

  return {
    text: "I might not have that exact answer yet. Try Find leads, Price a job, or Invoices — or Connect with us and a person will reply at hello.aibloom@outlook.com.",
    links: [LINKS.intel, LINKS.about],
  };
}

export const GREETING: AssistantReply = {
  text: "Hi — I’m your AI Bloom helper. I can guide you around the site or answer quick questions about leads, prices, and tools. What do you need?",
  links: [LINKS.intel, LINKS.price, LINKS.invoices, LINKS.about],
};
