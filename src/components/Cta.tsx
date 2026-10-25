import type { ReactNode } from "react";
import { bookingHref, membershipHref, type BookingOffer } from "../data/business";

/** Near-black inner ring (clears green and white) plus a white outer ring (clears dark grounds). */
export const buttonFocus = "aa-focus";

/** White inner ring for a near-black fill sitting on a light page. */
export const buttonFocusOnInk = "aa-focus-ink";

const base = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-center text-base font-semibold ${buttonFocus}`;

const tones = {
  brand: `${base} bg-[#14D45E] text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852]`,
  line: `${base} border-2 border-[#0A0F0B] bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] active:bg-[#e6eee8]`,
  dark: `${base} border-2 border-[#4b5563] bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] active:bg-[#e6eee8]`,
  solid: `${base.replace(buttonFocus, buttonFocusOnInk)} bg-[#0A0F0B] text-white hover:bg-[#1c2822] active:bg-[#000000]`,
  text: `inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`,
} as const;

type Tone = keyof typeof tones;

function externalProps(href: string) {
  if (!href.startsWith("http")) return {};
  return { target: "_blank", rel: "noreferrer" } as const;
}

export function BookLink({
  offer,
  children,
  tone = "brand",
  className = "",
}: {
  offer: BookingOffer;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const href = bookingHref(offer);
  return (
    <a href={href} className={`${tones[tone]} ${className}`} {...externalProps(href)}>
      {children}
    </a>
  );
}

export function MembershipLink({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const href = membershipHref();
  return (
    <a href={href} className={`${tones[tone]} ${className}`} {...externalProps(href)}>
      {children}
    </a>
  );
}
