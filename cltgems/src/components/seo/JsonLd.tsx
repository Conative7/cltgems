export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "AI Bloom",
    description:
      "Charlotte tools for small businesses: free Google listing checks, local lead packs, job pricing, and invoices without Canva.",
    url: "https://www.aibloom.agency",
    email: "hello.aibloom@outlook.com",
    areaServed: {
      "@type": "City",
      name: "Charlotte",
      containedInPlace: { "@type": "State", name: "North Carolina" },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Charlotte",
      addressRegion: "NC",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
