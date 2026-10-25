import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import {
  Activity,
  Armchair,
  CalendarDays,
  Clock,
  Infinity as InfinityIcon,
  MapPin,
  Monitor,
  Target,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { bindHeroWatch } from "../audio/soundtrack";
import { Mark } from "../components/Chrome";
import { BookLink, MembershipLink, buttonFocus } from "../components/Cta";
import { EnquiryForm } from "../components/EnquiryForm";
import { HeroProof } from "../components/HeroProof";
import { HeroVideo, Photo } from "../components/Media";
import { SoundToggle } from "../components/SoundToggle";
import { Stat, ValuePoint } from "../components/ValuePoint";
import { NAP, golfClockBookingReady } from "../data/business";
import type { PhotoAsset } from "../data/photos";
import { PHOTOS } from "../data/photos";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS_URL, REVIEW_QUOTES } from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFlow } from "../state/flow";

const links = [
  ["practice", "Practice"],
  ["coaching", "Coaching"],
  ["juniors", "Juniors"],
  ["venue", "Venue"],
] as const;

const tracks = [
  { id: "carry", word: "Carry", line: "Carry, on every swing.", photo: PHOTOS.launchData },
  { id: "speed", word: "Ball speed", line: "Ball speed, on every swing.", photo: PHOTOS.range },
  { id: "spin", word: "Spin", line: "Spin, on every swing.", photo: PHOTOS.bays },
] as const;

const navButton = `inline-flex min-h-11 min-w-11 items-center text-base font-semibold text-[#0A0F0B] ${buttonFocus}`;

function Headline({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word-in inline-block" style={{ animationDelay: `${index * 70}ms` }}>
                {word}
                {index < words.length - 1 && !word.endsWith(".") ? "\u00a0" : ""}
              </span>
            </span>
            {word.endsWith(".") && index < words.length - 1 ? <br /> : null}
          </Fragment>
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

  const wordButton = `inline-flex min-h-11 min-w-11 items-center text-left text-base font-semibold text-[#0A0F0B] ${buttonFocus}`;

  return (
    <section id="practice" className="scroll-mt-6 px-6 py-24 @3xl:px-12 @3xl:py-28">
      <h2 className="max-w-3xl font-display text-4xl font-semibold leading-none tracking-tight @4xl:text-6xl">
        Add 10 yards in 90 days.
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed">
        Unlimited practice, no minimum. Track carry, ball speed and spin on every swing and watch the trend move.
      </p>
      <div className="mt-12 grid gap-10 @3xl:grid-cols-2 @3xl:gap-16">
        <div className="sticky top-0 hidden h-dvh flex-col justify-center @3xl:flex">
          <p className="text-base font-semibold">What members track</p>
          <p className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight @4xl:text-6xl">
            {tracks[active]?.word}
          </p>
          <div className="mt-6 flex flex-col items-start gap-1">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                aria-current={active === index ? "true" : undefined}
                className={`${wordButton} ${active === index ? "underline decoration-2 underline-offset-4" : ""}`}
                onClick={() => go(track.id)}
              >
                {track.word}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-5">
            <ValuePoint
              icon={InfinityIcon}
              label="Unlimited bays"
              line="Practice as often as you want, with no minimum term."
            />
            <ValuePoint
              icon={Activity}
              label="Shot data"
              line="Carry, ball speed and spin on every swing."
            />
          </div>
          <div className="mt-8">
            <MembershipLink>Book unlimited practice</MembershipLink>
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="grid gap-5 @3xl:hidden">
            <p className="text-base font-semibold">What members track</p>
            <ValuePoint
              icon={InfinityIcon}
              label="Unlimited bays"
              line="Practice as often as you want, with no minimum term."
            />
            <ValuePoint icon={Activity} label="Shot data" line="Carry, ball speed and spin on every swing." />
            <MembershipLink>Book unlimited practice</MembershipLink>
          </div>
          {tracks.map((track, index) => (
            <article
              key={track.id}
              id={track.id}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              className="scroll-mt-6 @3xl:min-h-[64vh]"
            >
              <Frame photo={track.photo} className="aspect-[4/3]" />
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{track.word}</h3>
              <p className="mt-2 text-base leading-relaxed">{track.line}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-20 grid gap-10 @3xl:grid-cols-3">
        <div>
          <Frame photo={PHOTOS.groupWave} className="mb-4 aspect-[4/3]" />
          <Stat value="4" label="Players in a bay" />
          <div className="mt-4">
            <ValuePoint icon={Users} label="Up to 4 friends" line="Play with up to four friends in one bay." />
          </div>
          <div className="mt-4">
            <BookLink offer="bay">Book a bay</BookLink>
          </div>
        </div>
        <div>
          <Frame photo={PHOTOS.lounge} className="mb-4 aspect-[4/3]" />
          <ValuePoint icon={CalendarDays} label="Ten sessions" line="Ten bay sessions as a monthly routine." />
          <div className="mt-4">
            <BookLink offer="ten-pack">Book ten sessions</BookLink>
          </div>
        </div>
        <div>
          <Frame photo={PHOTOS.clubRack} className="mb-4 aspect-[4/3]" />
          <ValuePoint icon={Clock} label="Regular sessions" line="Book one bay when you want a single session." />
          <div className="mt-4">
            <BookLink offer="bay" tone="dark">
              Book a session
            </BookLink>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <ValuePoint icon={Trophy} label="Tournament spot" line="Reserve your place when you want to play." />
        <div className="mt-4">
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
            <button key={id} className={navButton} type="button" onClick={() => jump(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SoundToggle />
          <BookLink offer="bay" className="hidden @3xl:inline-flex">
            Book
          </BookLink>
          <button
            type="button"
            className={`inline-flex min-h-11 min-w-11 items-center px-4 text-base font-semibold text-[#0A0F0B] @3xl:hidden ${buttonFocus}`}
            aria-expanded={menu}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="flex flex-col items-start gap-2 px-6 py-4 @3xl:hidden" aria-label="Page">
          {links.map(([id, label]) => (
            <button key={id} type="button" className={navButton} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <BookLink offer="bay" className="w-fit">
            Book
          </BookLink>
        </nav>
      )}

      <section id="hero" className="grid @3xl:min-h-[760px] @3xl:grid-cols-2 @3xl:items-stretch">
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col justify-center px-6 py-14 @3xl:px-12 @3xl:py-16">
            <Headline
              text="Get better at golf. All year."
              className="max-w-xl font-display text-[2rem] font-semibold leading-[1.02] tracking-tight @3xl:text-[2.15rem] @5xl:text-5xl"
            />
            <p className="mt-6 max-w-md text-base leading-relaxed">
              Unlimited bays, PGA coaching and real shot data on Hamilton Street, Somerset.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BookLink offer="bay">Book</BookLink>
              <button
                type="button"
                className={`inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`}
                onClick={() => jump("venue")}
              >
                See the venue
              </button>
            </div>
          </div>
          <div className="mt-auto bg-[#06210f] px-6 py-8 text-white @3xl:px-12">
            <HeroProof />
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
            <h2 className="font-display text-3xl font-semibold leading-none tracking-tight @5xl:text-5xl">
              PGA coaches to improve your game.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">
              Nick and Sean find the one fix that matters, then build your practice around it.
            </p>
            <div className="mt-8">
              <Stat value="2" label="PGA pros" />
            </div>
            <div className="mt-8 grid gap-5">
              <ValuePoint icon={UserRound} label="PGA pros" line="Nick and Sean coach here." />
              <ValuePoint icon={Target} label="1:1 lessons" line="A plan you can track month to month." />
              <ValuePoint icon={Activity} label="Swing evaluation" line="Once per golfer." />
            </div>
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
            <div className="mt-6">
              <ValuePoint icon={Users} label="Group lessons" line="A place held when you sign up." />
            </div>
            <p className="mt-4 max-w-md text-base leading-relaxed">The weekly schedule is not published yet.</p>
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
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Junior coaching.</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">
              One or two 1:1 lessons a week with a PGA pro, plus unlimited practice between them.
            </p>
            <div className="mt-8 grid gap-5">
              <ValuePoint icon={UserRound} label="One lesson a week" line="A weekly 1:1 with a PGA pro." />
              <ValuePoint icon={Users} label="Two lessons a week" line="Two 1:1 lessons with the same coach." />
              <ValuePoint icon={InfinityIcon} label="Unlimited practice" line="Supervised bay time between lessons." />
            </div>
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
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Hamilton Street</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed">
            {NAP.street}, {NAP.city}, {NAP.region} {NAP.postalCode}. Simulator bays, a lounge, and clubs on the rack.
          </p>
          <div className="mt-8 grid gap-5 @3xl:grid-cols-3">
            <ValuePoint icon={MapPin} label="Hamilton Street" line="695 Hamilton Street, Suite G, Somerset, NJ." />
            <ValuePoint icon={Monitor} label="Simulator bays" line="Launch-monitor data on every swing." />
            <ValuePoint icon={Armchair} label="The lounge" line="A place to sit after the session." />
          </div>
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
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">
              {GOOGLE_RATING} on Google
            </h2>
            <a
              href={GOOGLE_REVIEWS_URL}
              className={`mt-4 inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`}
              target="_blank"
              rel="noreferrer"
            >
              from {GOOGLE_REVIEW_COUNT} Google reviews
            </a>
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
                          className={`inline-flex min-h-11 items-center font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`}
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
            <a
              className={`mt-3 inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`}
              href={NAP.phoneTel}
            >
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
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {links.map(([id, label]) => (
              <button key={id} type="button" className={navButton} onClick={() => jump(id)}>
                {label}
              </button>
            ))}
            <a
              className={`inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] ${buttonFocus}`}
              href={NAP.phoneTel}
            >
              {NAP.phoneDisplay}
            </a>
          </nav>
        </div>
        <p className="mt-10 text-base">© 2026 Par2Play</p>
        {!golfClockBookingReady() && (
          <p className="mt-2 text-base text-slate-700">
            GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
          </p>
        )}
      </footer>
    </div>
  );
}
