import { useEffect, useRef, useState, type RefObject } from "react";
import { bindHeroWatch } from "../audio/soundtrack";
import { Mark } from "../components/Chrome";
import { BookLink, MembershipLink } from "../components/Cta";
import { EnquiryForm } from "../components/EnquiryForm";
import { HeroVideo, Photo } from "../components/Media";
import { SoundToggle } from "../components/SoundToggle";
import { NAP, golfClockBookingReady } from "../data/business";
import type { PhotoAsset } from "../data/photos";
import { PHOTOS } from "../data/photos";
import { GOOGLE_RATING, REVIEW_QUOTES } from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFlow } from "../state/flow";

const links = [
  ["practice", "Practice"],
  ["coaching", "Coaching"],
  ["juniors", "Juniors"],
  ["venue", "Venue"],
] as const;

type PanelId = "friends" | "routine" | "unlimited";

type Panel = {
  id: PanelId;
  word: string;
  title: string;
  line: string;
  outcomes: readonly string[];
  photo: PhotoAsset;
};

const panels: readonly Panel[] = [
  {
    id: "friends",
    word: "Carry",
    title: "Bring four friends",
    line: "See carry on every swing.",
    outcomes: ["Play with up to four friends.", "Launch-monitor shot data on every swing."],
    photo: PHOTOS.groupWave,
  },
  {
    id: "routine",
    word: "Ball speed",
    title: "Ten sessions, one routine",
    line: "See ball speed on every swing.",
    outcomes: [
      "Ten bay sessions you can book as a monthly routine.",
      "Compare the same numbers from session to session.",
    ],
    photo: PHOTOS.range,
  },
  {
    id: "unlimited",
    word: "Spin",
    title: "No minimum term",
    line: "See spin on every swing.",
    outcomes: ["Practice as often as you want.", "Unlimited practice, with no minimum term."],
    photo: PHOTOS.lounge,
  },
];

function panelAction(id: PanelId) {
  switch (id) {
    case "friends":
      return <BookLink offer="bay">Book a bay</BookLink>;
    case "routine":
      return <BookLink offer="ten-pack">Book ten sessions</BookLink>;
    case "unlimited":
      return <MembershipLink>Book unlimited practice</MembershipLink>;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function Headline({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
            <span className="word-in inline-block" style={{ animationDelay: `${index * 70}ms` }}>
              {word}
              {index < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}

function Outcomes({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-2 text-base leading-relaxed">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Frame({ photo, className = "" }: { photo: PhotoAsset; className?: string }) {
  return (
    <div className={`frame-in overflow-hidden bg-slate-100 ${className}`}>
      <Photo photo={photo} />
    </div>
  );
}

function Practice({
  scrollRef,
  mobile,
  reduce,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  mobile: boolean;
  reduce: boolean;
}) {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = mobile ? scrollRef.current : null;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = panelRefs.current.indexOf(best.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { root, rootMargin: "-30% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const node of panelRefs.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [mobile, scrollRef]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <section id="practice" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-28">
      <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @4xl:text-6xl">Every swing</h2>
      <p className="mt-6 max-w-md text-base leading-relaxed">See ball speed, carry and spin on every swing.</p>
      <div className="mt-14 grid @3xl:grid-cols-2 @3xl:gap-16">
        <div className="sticky top-0 hidden h-dvh flex-col justify-center @3xl:flex">
          <p className="font-display text-5xl font-semibold leading-none tracking-tight @4xl:text-6xl">{panels[active]?.word}</p>
          <div className="mt-8 flex flex-col gap-3">
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                type="button"
                aria-current={active === index ? "true" : undefined}
                className={`w-fit text-left font-display text-2xl tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14D45E] ${
                  active === index ? "font-semibold" : ""
                }`}
                onClick={() => go(panel.id)}
              >
                {panel.word}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-20">
          {panels.map((panel, index) => (
            <article
              key={panel.id}
              id={panel.id}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              className="scroll-mt-6 @3xl:min-h-[64vh] @3xl:py-6"
            >
              <Frame photo={panel.photo} className="aspect-[4/3]" />
              <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">{panel.title}</h3>
              <p className="mt-3 text-base leading-relaxed">{panel.line}</p>
              <Outcomes items={panel.outcomes} />
              <div className="mt-6">{panelAction(panel.id)}</div>
            </article>
          ))}
          <BookLink offer="tournament" tone="text">
            Reserve your tournament spot
          </BookLink>
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const flow = useFlow();
  const reduce = usePrefersReducedMotion();
  const [menu, setMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobile = flow.layout === "mobile";
  const scroll = mobile ? "h-full overflow-y-auto" : "";

  useEffect(() => bindHeroWatch("hero", mobile ? scrollRef.current : null), [mobile]);

  const jump = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={scrollRef} className={`@container bg-white text-base text-slate-950 ${scroll}`}>
      <header className="flex items-center justify-between gap-4 px-6 py-4 @3xl:px-12">
        <Mark />
        <nav className="hidden items-center gap-7 @3xl:flex" aria-label="Page">
          {links.map(([id, label]) => (
            <button
              key={id}
              className="text-base text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14D45E]"
              type="button"
              onClick={() => jump(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SoundToggle />
          <BookLink offer="bay" className="hidden h-10 px-4 @3xl:inline-flex">
            Book
          </BookLink>
          <button
            type="button"
            className="h-10 px-2 text-base font-medium @3xl:hidden"
            aria-expanded={menu}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="flex flex-col gap-4 px-6 py-4 text-base @3xl:hidden" aria-label="Page">
          {links.map(([id, label]) => (
            <button key={id} type="button" className="text-left" onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <BookLink offer="bay" className="w-fit">
            Book
          </BookLink>
        </nav>
      )}

      <section id="hero" className="grid px-6 @3xl:min-h-[720px] @3xl:grid-cols-2 @3xl:items-stretch @3xl:gap-12 @3xl:px-12">
        <div className="flex flex-col justify-center py-14 @3xl:py-20">
          <Headline
            text="Indoor golf in Somerset"
            className="max-w-xl font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight @4xl:text-6xl"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed">
            Simulator bays on Hamilton Street, year-round. Nick and Sean are the PGA pros.
          </p>
          <p className="mt-8 max-w-md text-base leading-relaxed">
            {GOOGLE_RATING} on Google. {REVIEW_QUOTES[2]?.name}: {REVIEW_QUOTES[2]?.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BookLink offer="bay">Book</BookLink>
            <button
              type="button"
              className="inline-flex h-11 items-center text-base font-medium underline decoration-slate-300 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14D45E]"
              onClick={() => jump("venue")}
            >
              See the venue
            </button>
          </div>
        </div>
        <div className="relative min-h-[280px] @3xl:min-h-full">
          <HeroVideo />
        </div>
      </section>

      <Practice scrollRef={scrollRef} mobile={mobile} reduce={reduce} />

      <section id="coaching" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-40">
        <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <Frame photo={PHOTOS.coachAndPlayer} className="aspect-[4/3]" />
          <div>
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @3xl:text-6xl">See the swing</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">
              A 1:1 plan with a PGA pro, with progress you can track month to month.
            </p>
            <Outcomes
              items={[
                "Private lessons with PGA pros Nick and Sean.",
                "Lesson packs when you want a run of sessions.",
                "A swing evaluation, once per golfer.",
              ]}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <BookLink offer="lesson">Book a lesson</BookLink>
              <BookLink offer="swing-evaluation" tone="dark">
                Book a swing evaluation
              </BookLink>
            </div>
          </div>
        </div>
        <div className="mt-24 grid items-center gap-10 @3xl:mt-32 @3xl:grid-cols-2 @3xl:gap-16">
          <div>
            <h3 className="font-display text-3xl font-semibold tracking-tight">Group lessons</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed">
              A coach with the group, and a place held when you sign up. The weekly schedule is not published yet.
            </p>
            <div className="mt-8">
              <BookLink offer="group">Sign up</BookLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Frame photo={PHOTOS.launchData} className="aspect-[3/4]" />
            <Frame photo={PHOTOS.gripLesson} className="aspect-[3/4]" />
          </div>
        </div>
        <Frame photo={PHOTOS.ladiesClinic} className="mt-3 aspect-[16/8]" />
      </section>

      <section id="juniors" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-40">
        <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <div className="@3xl:order-2">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @3xl:text-6xl">A lesson every week</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">
              Juniors build fundamentals every week with a coach who tracks their progress.
            </p>
            <Outcomes
              items={[
                "One weekly 1:1, plus supervised unlimited practice.",
                "Or two lessons a week, with the same supervised access.",
              ]}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <BookLink offer="junior">One lesson a week</BookLink>
              <BookLink offer="junior-plus" tone="dark">
                Two lessons a week
              </BookLink>
            </div>
          </div>
          <Frame photo={PHOTOS.juniorGroup} className="aspect-[4/3] @3xl:order-1" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Frame photo={PHOTOS.juniorSetup} className="aspect-[4/3]" />
          <Frame photo={PHOTOS.juniorScreen} className="aspect-[4/3]" />
        </div>
      </section>

      <section id="venue" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-40">
        <div>
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @3xl:text-6xl">Hamilton Street</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed">
            {NAP.street}, {NAP.city}, {NAP.region} {NAP.postalCode}. Simulator bays, a lounge, and clubs on the rack.
          </p>
          <Outcomes
            items={[
              "Full Swing bays with launch-monitor shot data.",
              "A lounge for the group after the session.",
              "Play here year-round.",
            ]}
          />
          <div className="mt-8">
            <BookLink offer="bay">Book a bay</BookLink>
          </div>
          <Frame photo={PHOTOS.storefront} className="mt-12 aspect-[16/8]" />
          <div className="mt-3 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            {[PHOTOS.bays, PHOTOS.lounge, PHOTOS.clubRack, PHOTOS.logoWall].map((photo) => (
              <Frame key={photo.id} photo={photo} className="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-40">
        <div className="grid items-start gap-12 @3xl:grid-cols-2 @3xl:gap-16">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @3xl:text-6xl">
              {GOOGLE_RATING} on Google
            </h2>
            <ul className="mt-10 space-y-8">
              {REVIEW_QUOTES.map((quote) => (
                <li key={quote.id}>
                  <p className="text-lg leading-relaxed">{quote.excerpt}</p>
                  <p className="mt-2 text-base">
                    {quote.name}
                    {quote.sourceUrl && (
                      <>
                        {" "}
                        <a
                          href={quote.sourceUrl}
                          className="underline decoration-slate-300 underline-offset-4"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <BookLink offer="bay">Book a bay</BookLink>
            </div>
          </div>
          <Frame photo={PHOTOS.birthdayGroup} className="aspect-[4/5]" />
        </div>
      </section>

      <section id="book" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-40">
        <div className="grid gap-16 @3xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <h2 className="font-display text-5xl font-semibold leading-none tracking-tight @3xl:text-7xl">Book a bay</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">Tell us what you want to play, or book a bay now.</p>
            <Outcomes items={["A bay for up to four friends.", "A note here if you would rather we call you."]} />
            <div className="mt-8">
              <BookLink offer="bay">Book</BookLink>
            </div>
            <Frame photo={PHOTOS.holidayLounge} className="mt-12 aspect-[16/9]" />
            <div className="mt-12">
              <EnquiryForm />
            </div>
          </div>
          <address className="not-italic text-base leading-relaxed">
            <span className="font-display text-2xl tracking-tight">Par2Play</span>
            <br />
            {NAP.street}
            <br />
            {NAP.city}, {NAP.region} {NAP.postalCode}
            <br />
            <a className="mt-3 inline-block underline decoration-slate-300 underline-offset-4" href={NAP.phoneTel}>
              {NAP.phoneDisplay}
            </a>
          </address>
        </div>
      </section>

      <footer className="px-6 py-16 @3xl:px-12">
        <div className="flex flex-col gap-8 @3xl:flex-row @3xl:items-end @3xl:justify-between">
          <div>
            <p className="font-display text-3xl tracking-tight">Par2Play</p>
            <p className="mt-2 text-base">Somerset, NJ</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base" aria-label="Footer">
            {links.map(([id, label]) => (
              <button key={id} type="button" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
            <a href={NAP.phoneTel}>{NAP.phoneDisplay}</a>
          </nav>
        </div>
        <p className="mt-10 text-base">© 2026 Par2Play</p>
        {!golfClockBookingReady() && (
          <p className="mt-2 text-sm text-slate-700">
            GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
          </p>
        )}
      </footer>
    </div>
  );
}
