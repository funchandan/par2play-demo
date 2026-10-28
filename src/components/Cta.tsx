import type { ReactNode } from "react";
import { bookingHref, golfClockMembershipReady, membershipHref, type BookingOffer } from "../data/business";

/** Near-black inner ring (clears green and white) plus a white outer ring (clears dark grounds). */
export const buttonFocus = "aa-focus";

/** White inner ring for a near-black fill sitting on a light page. */
export const buttonFocusOnInk = "aa-focus-ink";

const base = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-center text-base font-semibold ${buttonFocus}`;

const tones = {
  brand: `${base} bg-[#14D45E] text-[#0A0F0B] hover:bg-[#3dff7c] hover:text-[#0A0F0B] active:bg-[#0fb852] active:text-[#0A0F0B] visited:bg-[#14D45E] visited:text-[#0A0F0B]`,
  line: `${base} border-2 border-[#0A0F0B] bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] hover:text-[#0A0F0B] active:bg-[#e6eee8] visited:bg-white visited:text-[#0A0F0B]`,
  dark: `${base} border-2 border-[#4b5563] bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] hover:text-[#0A0F0B] active:bg-[#e6eee8] visited:bg-white visited:text-[#0A0F0B]`,
  inverted: `${base} border-0 bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] hover:text-[#0A0F0B] active:bg-[#e6eee8] visited:bg-white visited:text-[#0A0F0B]`,
  solid: `${base.replace(buttonFocus, buttonFocusOnInk)} bg-[#0A0F0B] text-white hover:bg-[#1c2822] hover:text-white active:bg-[#000000] active:text-white visited:bg-[#0A0F0B] visited:text-white`,
  text: `inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 visited:text-[#0A0F0B] ${buttonFocus}`,
} as const;

type Tone = keyof typeof tones;

function externalProps(href: string) {
  if (!href.startsWith("http")) return {};
  return { target: "_blank", rel: "noopener noreferrer" } as const;
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

/**
 * Hero membership action. Opens the GolfClock membership URL when one is
 * configured, and otherwise scrolls to the practice section.
 */
export function HeroMembershipAction({
  onScrollToPractice,
  className = "",
}: {
  onScrollToPractice: () => void;
  className?: string;
}) {
  if (golfClockMembershipReady()) {
    const href = membershipHref();
    return (
      <a href={href} className={`${tones.inverted} ${className}`} {...externalProps(href)}>
        Become a Member
      </a>
    );
  }
  return (
    <button type="button" className={`${tones.inverted} ${className}`} onClick={onScrollToPractice}>
      Become a Member
    </button>
  );
}
