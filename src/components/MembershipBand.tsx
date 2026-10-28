import { useEffect, useState } from "react";
import { BookLink, MembershipLink } from "./Cta";
import { FilmCarousel } from "./FilmCarousel";
import { MembershipStepIcon, type MembershipStepId } from "./MembershipIcons";
import { TESTIMONIAL_FILMS } from "../data/films";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const benefits: readonly { id: MembershipStepId; word: string; line: string }[] = [
  {
    id: "availability",
    word: "Member benefits",
    line: "First in line for the times that suit you.",
  },
  {
    id: "progress",
    word: "Track your progress",
    line: "Carry, ball speed, and spin.",
  },
  {
    id: "day",
    word: "Fit it around your day",
    line: "Dentist visits and school pickup.",
  },
];

function useWideScreen() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return wide;
}

function FilmToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="absolute inset-0 z-10 cursor-default bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
      aria-pressed={paused}
      aria-label={paused ? "Play video" : "Pause video"}
      onClick={onToggle}
    />
  );
}

function Benefits() {
  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <MembershipLink>Become a Member</MembershipLink>
        <BookLink offer="bay" tone="line">
          Try it out
        </BookLink>
      </div>
      <ul className="mt-6 grid gap-4 @3xl:mt-8 @3xl:gap-5">
        {benefits.map((benefit) => (
          <li key={benefit.id} className="flex gap-3">
            <MembershipStepIcon id={benefit.id} />
            <div>
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">{benefit.word}</h3>
              <p className="mt-1 text-base leading-snug">{benefit.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MembershipBand() {
  const reduce = usePrefersReducedMotion();
  const wide = useWideScreen();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIAL_FILMS.length;

  const advance = () => {
    if (paused || reduce || count < 2) return;
    setIndex((current) => (current + 1) % count);
  };
  const toggle = () => setPaused((value) => !value);
  const showControl = !reduce && count > 1;

  return (
    <section id="membership" className="scroll-mt-32">
      {!wide ? (
      <div className="bg-[#020806] text-white">
        <div className="relative aspect-video w-full overflow-hidden">
          <FilmCarousel index={index} paused={paused} reduce={reduce} onEnded={advance} />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020806] to-transparent"
            aria-hidden="true"
          />
          {showControl ? <FilmToggle paused={paused} onToggle={toggle} /> : null}
        </div>
        <div className="px-6 pt-2 pb-10">
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight">Membership</h2>
          <Benefits />
        </div>
      </div>
      ) : (
      <div className="relative min-h-[36rem] overflow-hidden text-white">
        <FilmCarousel index={index} paused={paused} reduce={reduce} onEnded={advance} />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020806] from-6% via-[#020806]/92 via-28% to-transparent to-46%"
          aria-hidden="true"
        />
        {showControl ? <FilmToggle paused={paused} onToggle={toggle} /> : null}
        <div className="pointer-events-none relative z-20 flex min-h-[36rem] items-center px-12 py-20">
          <div className="pointer-events-auto max-w-lg">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
            <Benefits />
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
