import { useEffect, useRef, useState } from "react";
import { BookLink, CtaPair, MembershipLink } from "./Cta";
import { MembershipStepIcon, type MembershipStepId } from "./MembershipIcons";
import { MEMBERSHIP_MONTAGE } from "../data/films";
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

function MontageFilm({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = ref.current;
    const node = box.current;
    if (!video || !node || reduce) return;
    // Hydration does not restore media element properties from prerendered HTML.
    video.muted = true;
    video.defaultMuted = true;
    if (paused) {
      video.pause();
      return;
    }
    let visible = false;
    const start = () => {
      if (!visible) return;
      void video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (!visible) {
          video.pause();
          return;
        }
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });
      },
      { rootMargin: "0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", start);
      video.pause();
    };
  }, [paused, reduce]);

  return (
    <div ref={box} className="absolute inset-0">
      <img
        src={MEMBERSHIP_MONTAGE.poster}
        alt="Golfers on a simulator at Par2Play"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {reduce ? null : (
    <video
      ref={ref}
      className="hero-video absolute inset-0 h-full w-full object-cover object-center"
      muted
      playsInline
      loop
      preload="none"
    >
      <source src={MEMBERSHIP_MONTAGE.srcMobile} type="video/mp4" media="(max-width: 767px)" />
      <source src={MEMBERSHIP_MONTAGE.src} type="video/mp4" />
    </video>
      )}
    </div>
  );
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
      <CtaPair className="mt-6">
        <MembershipLink className="w-full">Become a Member</MembershipLink>
        <BookLink className="w-full" offer="bay" tone="line">
          Try it out
        </BookLink>
      </CtaPair>
      <ul className="mt-6 grid gap-4 @3xl:mt-8 @3xl:gap-5">
        {benefits.map((benefit) => (
          <li key={benefit.id} className="flex gap-3">
            <MembershipStepIcon id={benefit.id} />
            <div>
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[#7DFFB0]">{benefit.word}</h3>
              <p className="mt-1 text-base leading-relaxed text-white">{benefit.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MembershipBand() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const toggle = () => setPaused((value) => !value);
  const showControl = !reduce;

  return (
    <section id="membership" className="@container scroll-mt-32 bg-[#020806] text-white">
      <div className="relative overflow-hidden @3xl:min-h-[36rem]">
        <div className="relative aspect-video w-full overflow-hidden @3xl:absolute @3xl:inset-0 @3xl:aspect-auto @3xl:h-full">
          <MontageFilm paused={paused} reduce={reduce} />
          {showControl ? <FilmToggle paused={paused} onToggle={toggle} /> : null}
        </div>
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#020806] via-[#020806]/90 to-transparent @3xl:block"
          aria-hidden="true"
        />
        <div className="pointer-events-none relative z-20 px-6 pt-6 pb-10 @3xl:flex @3xl:min-h-[36rem] @3xl:items-center @3xl:px-12 @3xl:py-16">
          <div className="pointer-events-auto max-w-lg">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
            <Benefits />
          </div>
        </div>
      </div>
    </section>
  );
}
