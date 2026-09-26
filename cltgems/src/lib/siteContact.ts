/**
 * Public contact details shown on the site.
 * Add PHONE later for click-to-call (tel:) — leave empty to hide the header call link.
 */
export const SITE_EMAIL = "hello.aibloom@outlook.com";

/** Display form, e.g. "(704) 555-1234". Empty = no tel: link yet. */
export const SITE_PHONE_DISPLAY = "";

/** Digits only for tel: href, e.g. "+17045551234". */
export const SITE_PHONE_TEL = "";

export function hasClickToCall() {
  return Boolean(SITE_PHONE_TEL && SITE_PHONE_DISPLAY);
}
