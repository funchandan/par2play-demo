import { useEffect, useState } from "react";
import { BookLink, MembershipLink, buttonFocus } from "./Cta";
import { FilmCarousel } from "./FilmCarousel";
import { MembershipStepIcon, type MembershipStepId } from "./MembershipIcons";
import { TESTIMONIAL_FILMS } from "../data/films";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const benefits: readonly { id: MembershipStepId; word: string; line: string }[] = [
  {
    id: "availability",
    word: "Preferred bay availability",
    line: "Members are first in line for the times that suit them.",
  },
  {
    id: "progress",
    word: "Track your progress",
    line: "Carry, ball speed and spin on every swing, so the change shows from session to session.",
  },
  {
    id: "day",
    word: "Fit it around your day",
    line: "We’ve got you covered whether you’re at the dentist or picking up kids from school.",
  },
];

export function MembershipBand() {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIAL_FILMS.length;

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [count, paused, reduce]);

  return (
    <section id="membership" className="scroll-mt-32 relative isolate min-h-[40rem] overflow-hidden text-white">
      <FilmCarousel index={reduce ? 0 : index} />
      <div className="absolute inset-0 bg-[#020806]/80" aria-hidden="true" />
      <div className="relative z-10 px-6 py-20 @3xl:px-12 @3xl:py-24">
        <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
        <ul className="mt-10 grid max-w-xl gap-6">
          {benefits.map((benefit) => (
            <li key={benefit.id} className="flex gap-3">
              <MembershipStepIcon id={benefit.id} />
              <div>
                <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{benefit.word}</h3>
                <p className="mt-1 max-w-md text-base leading-relaxed">{benefit.line}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <MembershipLink>Book a membership</MembershipLink>
          <BookLink offer="bay" tone="line">
            Try it out
          </BookLink>
        </div>
        {!reduce && count > 1 && (
          <button
            type="button"
            className={`mt-8 inline-flex min-h-11 items-center rounded-full border-2 border-white px-4 text-base font-semibold text-white hover:bg-white hover:text-[#0A0F0B] ${buttonFocus}`}
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            {paused ? "Play background films" : "Pause background films"}
          </button>
        )}
      </div>
    </section>
  );
}
