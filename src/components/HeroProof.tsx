import { useEffect, useState, type FocusEvent } from "react";
import { buttonFocus } from "./Cta";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_REVIEWS_URL,
  REVIEW_QUOTES,
} from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const ROTATE_MS = 6000;

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBC04]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className="h-4 w-4">
          <path
            fill="currentColor"
            d="M10 1.6 12.4 7l5.9.5-4.5 3.8 1.4 5.7L10 14.2 4.8 17l1.4-5.7L1.7 7.5 7.6 7 10 1.6Z"
          />
        </svg>
      ))}
    </span>
  );
}

export function HeroProof() {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const quotes = REVIEW_QUOTES;
  const count = quotes.length;
  const active = quotes[reduce ? 0 : index] ?? quotes[0];

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (reduce || held || hidden || count < 2 || navigator.webdriver) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduce, held, hidden, count]);

  if (!active) return null;

  const release = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setHeld(false);
  };

  return (
    <div
      className="mt-2 flex items-center gap-2 text-sm text-white"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={release}
    >
      <p className="font-display text-lg font-semibold leading-none">{GOOGLE_RATING}</p>
      <Stars />
      <span className="sr-only">5 stars on Google.</span>
      <p key={reduce ? "static" : active.id} className="quote-fade min-w-0 flex-1 truncate">
        {`${active.name}. ${active.line}`}
      </p>
      <a
        href={GOOGLE_REVIEWS_URL}
        className={`inline-flex min-h-11 shrink-0 items-center text-base font-semibold text-white underline decoration-2 underline-offset-4 ${buttonFocus}`}
        target="_blank"
        rel="noreferrer"
      >
        {`${GOOGLE_REVIEW_COUNT} Google reviews`}
      </a>
    </div>
  );
}
