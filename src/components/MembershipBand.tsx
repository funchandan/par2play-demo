import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
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

function FilmControl({ paused, onToggle, className }: { paused: boolean; onToggle: () => void; className: string }) {
  return (
    <button
      type="button"
      className={`inline-flex size-11 items-center justify-center rounded-full bg-[#020806] text-white hover:bg-white hover:text-[#0A0F0B] ${buttonFocus} ${className}`}
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? "Play video" : "Pause video"}
    >
      {paused ? <Play className="size-5" aria-hidden="true" /> : <Pause className="size-5" aria-hidden="true" />}
    </button>
  );
}

function Benefits() {
  return (
    <>
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
          {showControl ? <FilmControl paused={paused} onToggle={toggle} className="absolute top-3 right-3 z-20" /> : null}
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
        <div className="relative z-10 flex min-h-[36rem] items-center px-12 py-20">
          <div className="max-w-lg">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
            <Benefits />
          </div>
        </div>
        {showControl ? <FilmControl paused={paused} onToggle={toggle} className="absolute top-6 right-6 z-20" /> : null}
      </div>
      )}
    </section>
  );
}
