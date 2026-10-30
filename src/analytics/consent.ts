declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

/** Choice record. The storage name and lifetime still need Atul/Chandan sign-off. */
export const CONSENT_STORAGE_KEY = "p2p_consent";
export const CONSENT_VERSION = 1;

export type ConsentChoice = {
  v: number;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();
let reopen: "banner" | "settings" | null = null;
// Remember the current-page choice even when browser storage is unavailable.
let currentChoice: ConsentChoice | null = null;

function read(): ConsentChoice | null {
  if (currentChoice) return currentChoice;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function cookieChoice(): ConsentChoice | null {
  return read();
}

export function hasConsent(category: "analytics" | "marketing"): boolean {
  return read()?.[category] === true;
}

export function cookieBannerMode(): "closed" | "banner" | "settings" {
  if (reopen) return reopen;
  return read() ? "closed" : "banner";
}

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

export function openCookieSettings() {
  reopen = "settings";
  emit();
}

export function closeCookieBanner() {
  reopen = null;
  emit();
}

export function isProductionHost(): boolean {
  if (typeof location === "undefined") return false;
  const host = location.hostname;
  return host === "par2play.com" || host === "www.par2play.com";
}

export function globalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
}

const TRACKING_COOKIES = [
  "_ga",
  "_ga_W5W5LHTPF1",
  "_gcl_au",
  "_gcl_aw",
  "_fbp",
  "_fbc",
  "_clck",
  "_clsk",
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function deleteCookie(name: string) {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${name}=; expires=${expires}; path=/`;
  document.cookie = `${name}=; expires=${expires}; path=/; domain=.par2play.com`;
}

export function clearTrackingStorage() {
  for (const name of TRACKING_COOKIES) deleteCookie(name);
  try {
    for (const name of TRACKING_COOKIES) localStorage.removeItem(name);
  } catch {
    /* Storage can be blocked. The reload still drops in-memory tags. */
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }, reload: boolean) {
  const next: ConsentChoice = { v: CONSENT_VERSION, ...choice, ts: Date.now() };
  currentChoice = next;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Keep the choice in memory for this page. A reload may ask again. */
  }
  reopen = null;
  emit();
  if (reload) window.location.reload();
}
