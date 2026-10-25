import { Fragment, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  Activity,
  CalendarDays,
  Clock,
  Infinity as InfinityIcon,
  Shield,
  Target,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { bindHeroWatch } from "../audio/soundtrack";
import { Mark } from "../components/Chrome";
import { BookLink, HeroMembershipAction, MembershipLink, buttonFocus } from "../components/Cta";
import { HeroProof } from "../components/HeroProof";
import { HeroVideo, Photo } from "../components/Media";
import { SoundToggle } from "../components/SoundToggle";
import { Stat, ValuePoint } from "../components/ValuePoint";
import { ENQUIRY, NAP, golfClockBookingReady } from "../data/business";
import type { PhotoAsset } from "../data/photos";
import { PHOTOS } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFlow } from "../state/flow";

const links = [
  ["practice", "Practice"],
  ["coaching", "Coaching"],
  ["juniors", "Juniors"],
  ["tournament", "Tournament"],
] as const;

const tracks: readonly {
  id: string;
  word: string;
  line: string;
  photo: PhotoAsset;
  icon: LucideIcon;
}[] = [
  {
    id: "often",
    word: "Practice as often as you want",
    line: "Unlimited bay time, with no minimum commitment.",
    photo: PHOTOS.range,
    icon: InfinityIcon,
  },
  {
    id: "progress",
    word: "Track your progress",
    line: "Carry, ball speed and spin on every swing, so the change shows from session to session.",
    photo: PHOTOS.launchData,
    icon: Activity,
  },
  {
    id: "day",
    word: "Fit it around your day",
    line: "Book any open bay through GolfClock. Midday is the quieter off-peak.",
    photo: PHOTOS.bays,
    icon: Clock,
  },
];

const sectionSpace = "scroll-mt-32 px-6 py-20 @3xl:px-12 @3xl:py-24";

const navButton = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-[#0A0F0B] ${buttonFocus}`;

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
    <section id="practice" className={sectionSpace}>
      <h2 className="max-w-3xl font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-5xl">
        Save up to 30% with unlimited practice membership
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed">
        Unlimited practice, no minimum. The bay is yours when you want it.
      </p>
      <div className="mt-12 grid gap-10 @3xl:grid-cols-2 @3xl:gap-16">
        <div className="flex flex-col justify-center @3xl:sticky @3xl:top-28 @3xl:h-[calc(100dvh-8rem)]">
          <p className="text-base font-semibold">Membership</p>
          <p className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight @4xl:text-4xl">
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
          {tracks[active] && (
            <p className="mt-4 max-w-md text-base leading-relaxed">{tracks[active].line}</p>
          )}
          <div className="mt-8">
            <MembershipLink>Book unlimited practice</MembershipLink>
          </div>
        </div>
        <div className="flex flex-col gap-16">
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
            </article>
          ))}
        </div>
      </div>
      <div className="mt-16 grid gap-8 @3xl:grid-cols-3">
        <ValuePoint icon={Users} label="Up to 4 friends" line="Play with up to four friends in one bay." />
        <ValuePoint icon={CalendarDays} label="Ten sessions" line="Ten bay sessions as a monthly routine." />
        <ValuePoint icon={Clock} label="Regular sessions" line="One bay when you want a single session." />
      </div>
    </section>
  );
}

function TournamentForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "held" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Add a valid email.");
      return;
    }
    setError("");
    const payload = { email: value, interest: "tournament" };

    if (ENQUIRY.endpoint.trim()) {
      setStatus("sending");
      try {
        const response = await fetch(ENQUIRY.endpoint.trim(), {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setStatus(response.ok ? "sent" : "error");
      } catch {
        setStatus("error");
      }
      return;
    }

    if (ENQUIRY.email.trim()) {
      const body = encodeURIComponent(`Email: ${payload.email}\nInterest: tournament\n`);
      window.location.href = `mailto:${ENQUIRY.email.trim()}?subject=${encodeURIComponent("Par2Play tournament")}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("held");
  }

  if (status === "sent" || status === "held") {
    return (
      <p className="text-base text-[#0A0F0B]" role="status">
        {status === "sent" ? "Sent. We’ll reply soon." : "Noted here. Enquiry inbox: TODO. Nothing was sent."}
      </p>
    );
  }

  return (
    <form className="mx-auto grid max-w-md gap-3 text-left" onSubmit={onSubmit} noValidate>
      <label className="block text-base font-semibold text-[#0A0F0B]" htmlFor="tournament-email">
        Email
        <input
          id="tournament-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "tournament-email-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
          className="aa-focus mt-2 w-full border-2 border-[#4b5563] bg-white px-3 py-3 text-base font-normal text-[#0A0F0B] outline-none placeholder:text-[#4b5563] focus-visible:border-[#0A0F0B]"
        />
      </label>
      {error && (
        <p id="tournament-email-error" className="text-base text-red-700">
          {error}
        </p>
      )}
      {status === "error" && (
        <p className="text-base text-red-700" role="alert">
          Could not send. Call {NAP.phoneDisplay}.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-2 inline-flex min-h-11 w-fit items-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852] disabled:bg-[#c8f5d8] disabled:text-[#0A0F0B] ${buttonFocus}`}
      >
        {status === "sending" ? "Sending" : "Reserve your tournament spot"}
      </button>
    </form>
  );
}

export function Landing() {
  const flow = useFlow();
  const reduce = usePrefersReducedMotion();
  const [menu, setMenu] = useState(false);
  const [onFilm, setOnFilm] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobile = flow.layout === "mobile";
  const scroll = mobile ? "h-full overflow-y-auto" : "";

  useEffect(() => bindHeroWatch("hero", mobile ? scrollRef.current : null), [mobile]);

  useEffect(() => {
    const root = mobile ? scrollRef.current : null;
    const read = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      setOnFilm(hero.getBoundingClientRect().bottom > 72);
    };
    read();
    const target = root ?? window;
    target.addEventListener("scroll", read, { passive: true });
    const nodes = links
      .map(([id]) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best?.target.id) setActive(best.target.id);
      },
      { root, rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const node of nodes) observer.observe(node);
    return () => {
      target.removeEventListener("scroll", read);
      observer.disconnect();
    };
  }, [mobile]);

  const filmLink = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold ${buttonFocus} ${
    onFilm ? "text-white" : "text-[#0A0F0B]"
  }`;

  const jump = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={scrollRef} className={`@container page-grid text-base text-[#0A0F0B] ${scroll}`}>
      <header
        className={`sticky z-30 px-6 py-3 @3xl:px-12 ${mobile ? "top-0" : "top-[4.25rem]"} ${onFilm ? "" : "header-bar"}`}
      >
        <div className="flex items-center justify-between gap-4">
          <Mark light={onFilm} />
          <nav className="hidden items-center gap-6 @3xl:flex" aria-label="Page">
            {links.map(([id, label]) => (
              <button
                key={id}
                className={`${filmLink} ${active === id ? "is-active" : ""}`}
                type="button"
                aria-current={active === id ? "true" : undefined}
                onClick={() => jump(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SoundToggle className={onFilm ? "text-white" : "text-[#0A0F0B]"} />
            <BookLink offer="bay" className="hidden @3xl:inline-flex">
              Book a bay
            </BookLink>
            <button
              type="button"
              className={`${filmLink} @3xl:hidden`}
              aria-expanded={menu}
              onClick={() => setMenu((open) => !open)}
            >
              {menu ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            className={`mt-2 flex flex-col items-start gap-1 @3xl:hidden ${onFilm ? "hero-panel rounded-2xl px-3 py-2" : ""}`}
            aria-label="Page"
          >
            {links.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`${filmLink} ${active === id ? "is-active" : ""}`}
                aria-current={active === id ? "true" : undefined}
                onClick={() => jump(id)}
              >
                {label}
              </button>
            ))}
            <BookLink offer="bay" className="mt-2 w-fit">
              Book a bay
            </BookLink>
          </nav>
        )}
      </header>
      <section
        id="hero"
        className={`relative -mt-[4.5rem] overflow-hidden bg-[#06210f] ${mobile ? "h-full" : "h-[calc(100svh-4.25rem)]"}`}
      >
        <HeroVideo />
        <div className="hero-top-shade pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end px-6 pt-24 @3xl:px-12 @3xl:pt-28">
          <div className="hero-panel pointer-events-auto w-full max-w-[32rem] rounded-2xl px-4 py-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Headline
                text="Get better at golf. All year."
                className="max-w-[16rem] font-display text-[1.35rem] font-semibold leading-[1.05] tracking-tight text-white @3xl:max-w-none @3xl:text-[2rem]"
              />
              <HeroMembershipAction onScrollToPractice={() => jump("practice")} />
            </div>
            <HeroProof />
          </div>
        </div>
      </section>

      <Practice scrollRef={scrollRef} mobile={mobile} reduce={reduce} />

      <section id="coaching" className={sectionSpace}>
        <div className="grid items-start gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <Frame photo={PHOTOS.coachAndPlayer} className="aspect-[4/3]" />
          <div>
            <h2 className="font-display text-3xl font-semibold leading-none tracking-tight @5xl:text-5xl">
              PGA coaches to improve your game.
            </h2>
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
            <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
              <ValuePoint icon={Users} label="Group lessons" line="A shared session with a PGA pro." />
              <BookLink offer="group">Sign up</BookLink>
            </div>
          </div>
        </div>
      </section>

      <section id="juniors" className={sectionSpace}>
        <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <div className="@3xl:order-2">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Junior coaching.</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">Building the golfers of tomorrow.</p>
            <div className="mt-8 grid gap-5">
              <ValuePoint
                icon={UserRound}
                label="Future pros"
                line="1:1 coaching with PGA pros Nick and Sean, once or twice a week."
              />
              <ValuePoint
                icon={Shield}
                label="Supervised care"
                line="Juniors practise under staff supervision in a safe, friendly bay."
              />
              <ValuePoint
                icon={Activity}
                label="Technology-assisted development"
                line="Shot data on every swing shows progress week to week."
              />
            </div>
            <div className="mt-8">
              <BookLink offer="junior">Book junior coaching</BookLink>
            </div>
          </div>
          <Frame photo={PHOTOS.juniorGroup} className="aspect-[4/3] @3xl:order-1" />
        </div>
      </section>

      <section id="tournament" className={`${sectionSpace} text-center`}>
        <h2 className="mx-auto max-w-xl font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-5xl">
          Reserve your tournament spot
        </h2>
        <div className="mt-10">
          <TournamentForm />
        </div>
      </section>

      <footer className="px-6 py-20 @3xl:px-12 @3xl:py-24">
        <div className="grid items-start gap-x-12 gap-y-8 @3xl:grid-cols-2 @5xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="font-display text-3xl tracking-tight">Par2Play</p>
            <address className="mt-3 not-italic text-base leading-relaxed">
              {NAP.street}
              <br />
              {NAP.city}, {NAP.region} {NAP.postalCode}
            </address>
          </div>
          <nav className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
            {links.map(([id, label]) => (
              <button key={id} type="button" className={navButton} onClick={() => jump(id)}>
                {label}
              </button>
            ))}
          </nav>
          <a
            className={`inline-flex min-h-11 w-fit items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 ${buttonFocus}`}
            href={NAP.phoneTel}
          >
            {NAP.phoneDisplay}
          </a>
        </div>
        <p className="mt-10 text-base">© 2026 Par2Play</p>
        {!golfClockBookingReady() && (
          <p className="mt-2 max-w-xl text-base text-slate-700">
            GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
          </p>
        )}
      </footer>
    </div>
  );
}
