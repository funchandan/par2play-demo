import { GTM_CONTAINER_ID, META_PIXEL_ID } from "../data/analytics";
import { cookieChoice, globalPrivacyControl, hasConsent, isProductionHost } from "./consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __gtmLoaded?: boolean;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  const current = window.gtag;
  if (current && current !== gtag) {
    current(...args);
    return;
  }
  window.dataLayer.push(args);
  window.gtag = gtag;
}

let defaultsInstalled = false;

/** Consent Mode v2 defaults. Safe on every host: it does not load a tag. */
export function installConsentDefaults() {
  if (defaultsInstalled) return;
  defaultsInstalled = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", false);
}

function effectiveChoice() {
  const stored = cookieChoice();
  if (!stored) return null;
  const marketing = globalPrivacyControl() ? false : stored.marketing;
  return { analytics: stored.analytics, marketing };
}

export function applyStoredConsent() {
  installConsentDefaults();
  const choice = effectiveChoice();
  if (!choice) return;
  gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.marketing ? "granted" : "denied",
    ad_user_data: choice.marketing ? "granted" : "denied",
    ad_personalization: choice.marketing ? "granted" : "denied",
  });
  if (!isProductionHost()) return;
  if ((choice.analytics || choice.marketing) && !window.__gtmLoaded) {
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
    const append = () => document.head.appendChild(script);
    const idle = window.requestIdleCallback?.bind(window);
    if (idle) idle(append, { timeout: 3000 });
    else window.addEventListener("load", append, { once: true });
  }
  if (choice.marketing && typeof window.fbq !== "function") {
    const loader = document.createElement("script");
    loader.text =
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');";
    document.head.appendChild(loader);
    initMetaPixel();
  }
}

function initMetaPixel() {
  const pixel = window.fbq;
  if (!pixel) return;
  pixel("init", META_PIXEL_ID);
  pixel("track", "PageView");
}

export function updateConsent(choice: { analytics: boolean; marketing: boolean }) {
  gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.marketing ? "granted" : "denied",
    ad_user_data: choice.marketing ? "granted" : "denied",
    ad_personalization: choice.marketing ? "granted" : "denied",
  });
  if (!choice.marketing && typeof window.fbq === "function") {
    window.fbq("consent", "revoke");
  }
  const hadTags = window.__gtmLoaded === true || typeof window.fbq === "function";
  if (!choice.analytics && !choice.marketing && hadTags) return;
  if (isProductionHost() && (choice.analytics || choice.marketing)) applyStoredConsent();
}

export { hasConsent };
