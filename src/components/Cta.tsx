import type { ReactNode } from "react";
import { bookingHref, membershipHref, type BookingOffer } from "../data/business";

const tones = {
  brand:
    "inline-flex h-11 items-center justify-center rounded-full bg-[#14D45E] px-5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#06210f] transition hover:bg-[#3dff7c]",
  line:
    "inline-flex h-11 items-center justify-center rounded-full border border-white/50 bg-white/10 px-5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white",
  dark:
    "inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-900",
  solid:
    "inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white",
  text:
    "inline-flex h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 underline-offset-4 hover:underline",
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
