import type { ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { bookingHref, membershipHref, NAP, type BookingOffer } from "../data/business";

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

/** Equal-width pair. Stacked full width in a narrow container, side by side once the container is wide. */
export function CtaPair({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container w-full max-w-full ${className}`}>
      <div className="grid w-full grid-cols-1 gap-3 @3xl:w-fit @3xl:max-w-full @3xl:grid-cols-2">{children}</div>
    </div>
  );
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
    <a
      href={href}
      className={`${tones[tone]} ${className}`}
      {...externalProps(href)}
      data-offer={offer}
      onClick={(event) => trackAnchor(event.currentTarget)}
    >
      {children}
    </a>
  );
}

export function MembershipLink({
  children,
  tone = "brand",
  className = "",
  href,
  tier,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Overrides the on-site membership page. The membership page passes GolfClock. */
  href?: string;
  tier?: string;
}) {
  const target = href ?? membershipHref();
  return (
    <a
      href={target}
      className={`${tones[tone]} ${className}`}
      {...externalProps(target)}
      data-membership="true"
      onClick={(event) => trackAnchor(event.currentTarget, tier ? { membership_tier: tier as "silver" | "gold" | "platinum" } : {})}
    >
      {children}
    </a>
  );
}

export function PhoneLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a className={className} href={NAP.phoneTel} onClick={(event) => trackAnchor(event.currentTarget)}>
      {children}
    </a>
  );
}

/**
 * Home hero. Opens the on-site membership page so the visit sells Silver, Gold, and Platinum.
 */
export function HeroMembershipAction({ className = "" }: { className?: string }) {
  return <MembershipLink tone="inverted" className={className}>Become a Member</MembershipLink>;
}
