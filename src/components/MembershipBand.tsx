import { useState } from "react";
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

  const advance = () => {
    if (paused || reduce || count < 2) return;
    setIndex((current) => (current + 1) % count);
  };

  return (
    <section id="membership" className="scroll-mt-32 relative isolate min-h-[52rem] overflow-hidden text-white @3xl:min-h-[36rem]">
      <FilmCarousel index={index} paused={paused} reduce={reduce} onEnded={advance} />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#020806] from-20% via-[#020806]/94 via-70% to-transparent @3xl:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#020806] from-6% via-[#020806]/92 via-28% to-transparent to-46% @3xl:block"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-[52rem] flex-col justify-end px-6 pb-10 @3xl:min-h-[36rem] @3xl:justify-center @3xl:px-12 @3xl:py-20">
        <div className="h-[14rem] shrink-0 @3xl:hidden" aria-hidden="true" />
        <div className="max-w-lg">
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
          <ul className="mt-6 grid gap-4 @3xl:mt-8 @3xl:gap-5">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="flex gap-3">
                <MembershipStepIcon id={benefit.id} />
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{benefit.word}</h3>
                  <p className="mt-1 text-base leading-relaxed">{benefit.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <MembershipLink>Book a membership</MembershipLink>
            <BookLink offer="bay" tone="line">
              Try it out
            </BookLink>
          </div>
          {!reduce && count > 1 && (
            <button
              type="button"
              className={`mt-8 inline-flex min-h-11 items-center rounded-full border-2 border-white bg-[#020806] px-4 text-base font-semibold text-white hover:bg-white hover:text-[#0A0F0B] ${buttonFocus}`}
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
            >
              {paused ? "Play background films" : "Pause background films"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
