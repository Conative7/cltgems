/** Shared helpers: Formspree (true inbox) or Outlook Web compose (no mailto app picker). */

export const INBOX = "hello.aibloom@outlook.com";

export const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "";

export function outlookComposeUrl(subject: string, body: string): string {
  return (
    "https://outlook.live.com/mail/0/deeplink/compose?to=" +
    encodeURIComponent(INBOX) +
    "&subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

export async function submitViaFormspree(fields: Record<string, string>): Promise<boolean> {
  if (!FORMSPREE_ID) return false;
  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  return res.ok;
}

/** Open Outlook Web with a ready draft (user hits Send once). */
export function openOutlookDraft(subject: string, body: string): void {
  window.open(outlookComposeUrl(subject, body), "_blank", "noopener,noreferrer");
}
