import { useEffect, useState } from "react";
import { buttonFocus } from "./Cta";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_REVIEWS_URL,
  REVIEW_QUOTES,
} from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const control = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white px-4 text-base font-semibold text-[#0A0F0B] hover:bg-[#f3f6f1] active:bg-[#e6eee8] ${buttonFocus}`;

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBC04]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M10 1.6 12.4 7l5.9.5-4.5 3.8 1.4 5.7L10 14.2 4.8 17l1.4-5.7L1.7 7.5 7.6 7 10 1.6Z"
          />
        </svg>
      ))}
    </span>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.26a12 12 0 0 0 0 10.76l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.62l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function HeroProof() {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const quotes = REVIEW_QUOTES;
  const count = quotes.length;
  const active = quotes[index] ?? quotes[0];

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reduce, paused, count]);

  if (!active) return null;

  const go = (next: number) => {
    setIndex((next + count) % count);
  };

  const hold = (event: { currentTarget: Node; relatedTarget: EventTarget | null }) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setPaused(false);
  };

  return (
    <div className="@container">
    <div className="grid gap-6 @min-[36rem]:grid-cols-[11rem_minmax(0,1fr)] @min-[36rem]:items-center @min-[36rem]:gap-8">
      <div>
        <p className="font-display text-6xl font-semibold leading-none text-white">{GOOGLE_RATING}</p>
        <div className="mt-3 flex items-center gap-2">
          <Stars />
          <GoogleMark />
          <span className="sr-only">5 stars on Google</span>
        </div>
        <a
          href={GOOGLE_REVIEWS_URL}
          className={`mt-3 inline-flex min-h-11 items-center text-base font-semibold text-white underline decoration-2 underline-offset-4 ${buttonFocus}`}
          target="_blank"
          rel="noreferrer"
        >
          from {GOOGLE_REVIEW_COUNT} Google reviews
        </a>
      </div>
      <div
        className="border-t border-white/80 pt-5 @min-[36rem]:border-t-0 @min-[36rem]:border-l @min-[36rem]:pl-8 @min-[36rem]:pt-0" /* taste-skill-ignore */
        role="region"
        aria-roledescription="carousel"
        aria-label="Member reviews"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={hold}
      >
        <div aria-live="polite" aria-atomic="true">
          <p className="text-base font-semibold text-white">
            {active.name}
            <span className="sr-only">, 5 stars.</span>
          </p>
          <Stars />
          <p className="mt-2 text-base leading-snug text-white">{active.line}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" className={control} onClick={() => go(index - 1)}>
            Previous
          </button>
          <button type="button" className={control} onClick={() => go(index + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
