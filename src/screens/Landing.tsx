import { useEffect, useRef, useState } from "react";
import { Activity, Shield, Target, UserRound } from "lucide-react";
import { bindHeroWatch } from "../audio/soundtrack";
import { Mark } from "../components/Chrome";
import { trackAnchor } from "../analytics/track";
import { BookLink, CtaPair, HeroMembershipAction, MembershipLink, buttonFocus } from "../components/Cta";
import { HeroProof } from "../components/HeroProof";
import { MembershipBand } from "../components/MembershipBand";
import { HeroVideo } from "../components/Media";
import { SoundToggle } from "../components/SoundToggle";
import { TournamentForm } from "../components/TournamentForm";
import { EventTypeList } from "../components/EventTypeList";
import { CommunityStrip, EventGallery } from "../components/PhotoStrips";
import { OfferTicker } from "../components/OfferTicker";
import { VideoSlot } from "../components/VideoSlot";
import { ValuePoint } from "../components/ValuePoint";
import { NAP, OCLOCK, golfClockBookingReady } from "../data/business";
import { HERO_TICKER } from "../data/heroTicker";
import { JsonLd } from "../components/JsonLd";
import { FaqSection } from "../components/FaqSection";
import { VisitLine } from "../components/VisitLine";
import { faqGraph, homeGraph } from "../data/schema";
import { COACHING_FILM, JUNIORS_FILM } from "../data/films";
import { SITE_NAV, pageHref } from "../data/routes";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFlow } from "../state/flow";

const sectionSpace = "scroll-mt-32 px-6 py-20 @3xl:px-12 @3xl:py-24";

const navButton = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-[#0A0F0B] ${buttonFocus}`;

type HeroConcept = "a" | "b" | "c" | "d";

function heroConcept(): HeroConcept {
  const value = new URLSearchParams(window.location.search).get("hero");
  if (value === "b" || value === "c" || value === "d") return value;
  return "a";
}

const accentWord = "font-accent text-[1.45em] leading-none text-white";

function Tagline({ concept }: { concept: HeroConcept }) {
  const line = "max-w-[16rem] font-display text-[1.35rem] font-semibold leading-[1.05] tracking-tight text-white @3xl:max-w-none @3xl:text-[2rem]";
  if (concept === "b") {
    return (
      <p className={line}>
        {"A home for all golfers. "}
        <span className={accentWord}>All year.</span>
      </p>
    );
  }
  if (concept === "c") {
    return (
      <p className={line}>
        {"A home for "}
        <span className={accentWord}>all golfers.</span>{" "}
        <span className={accentWord}>All year.</span>
      </p>
    );
  }
  if (concept === "d") {
    return <p className={line}>A home for all golfers. All year.</p>;
  }
  return (
    <p className={line}>
      {"A home for "}
      <span className={accentWord}>all golfers.</span>
      {" All year."}
    </p>
  );
}

export function Landing() {
  const flow = useFlow();
  const reduce = usePrefersReducedMotion();
  const concept = heroConcept();
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
    const nodes = SITE_NAV.map((item) => document.getElementById(item.slug))
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
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />
      <header
        className={`sticky z-30 px-6 py-3 @5xl:px-12 ${mobile ? "top-0" : "top-[4.25rem]"} ${onFilm ? "" : "header-bar"}`}
      >
        <div className="flex items-center justify-between gap-4">
          <Mark light={onFilm} />
          <nav className="hidden items-center gap-3 @3xl:flex @5xl:gap-6" aria-label="Page">
            {SITE_NAV.map((item) => (
              <a
                key={item.slug}
                href={pageHref(item.slug)}
                className={`${filmLink} ${active === item.slug ? "is-active" : ""}`}
                aria-current={active === item.slug ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SoundToggle className={onFilm ? "text-white" : "text-[#0A0F0B]"} />
            <span className="hidden @3xl:contents">
              <MembershipLink className="shrink-0">Become a Member</MembershipLink>
            </span>
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
            {SITE_NAV.map((item) => (
              <a
                key={item.slug}
                href={pageHref(item.slug)}
                className={`${filmLink} ${active === item.slug ? "is-active" : ""}`}
                aria-current={active === item.slug ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <MembershipLink className="mt-2 w-fit">Become a Member</MembershipLink>
          </nav>
        )}
      </header>
      <section
        id="hero"
        className={`relative -mt-[4.5rem] flex flex-col overflow-hidden bg-[#06210f] ${mobile ? "h-full" : "h-[calc(100svh-5rem)]"}`}
      >
        <HeroVideo />
        <div className="hero-top-shade pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
        <div data-hero-offer className="relative z-10 flex flex-1 items-end justify-end px-6 pb-4 @3xl:px-12 @3xl:pb-6">
          <div className="hero-panel pointer-events-auto w-full max-w-[32rem] rounded-2xl px-4 py-3">
            <h1 className="font-display text-xl font-semibold leading-tight tracking-tight text-white @3xl:text-3xl">
              {concept === "d" ? (
                <>
                  {"Indoor golf in "}
                  <span className={accentWord}>Somerset</span>
                  {", NJ"}
                </>
              ) : (
                "Indoor golf in Somerset, NJ"
              )}
            </h1>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <Tagline concept={concept} />
              <HeroMembershipAction onScrollToPractice={() => jump("membership")} />
            </div>
            <HeroProof />
          </div>
        </div>
        <div className="relative z-20 shrink-0">
          <OfferTicker items={HERO_TICKER} />
        </div>
      </section>

      <MembershipBand />

      <section id="coaching" className={sectionSpace}>
        <div className="grid items-start gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <VideoSlot
            src={COACHING_FILM.src}
            srcMobile={COACHING_FILM.srcMobile}
            poster={COACHING_FILM.poster}
            posterAlt="A golfer hitting a shot in a Par2Play simulator bay"
            className="aspect-video"
            pausable
          />
          <div>
            <h2 className="font-display text-3xl font-semibold leading-none tracking-tight @5xl:text-5xl">Coaching</h2>
            <p className="mt-8 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
              {"Two PGA professional coaches, "}
              <a className="underline decoration-2 underline-offset-4" href={`${pageHref("coaching")}#nick-schiavo`}>
                Nick Schiavo
              </a>
              {" and "}
              <a className="underline decoration-2 underline-offset-4" href={`${pageHref("coaching")}#nick-monticello`}>
                Nick Monticello
              </a>
            </p>
            <div className="mt-8 grid gap-5">
              <ValuePoint icon={Target} label="1:1 lessons" line="A plan you can track month to month." />
              <ValuePoint
                icon={Activity}
                label="Swing evaluation"
                line="Swing your way to your first hole in one with drill down analysis and personalised 1:1 coaching."
              />
            </div>
            <CtaPair className="mt-8">
              <BookLink className="w-full" offer="swing-evaluation">
                Analyze my swing
              </BookLink>
              <BookLink className="w-full" offer="lesson" tone="line">
                Schedule a lesson
              </BookLink>
            </CtaPair>
          </div>
        </div>
      </section>

      <CommunityStrip />

      <section id="juniors" className={sectionSpace}>
        <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <div className="@3xl:order-2">
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Junior coaching.</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">Building the golfers of tomorrow.</p>
            <div className="mt-8 grid gap-5">
              <ValuePoint
                icon={UserRound}
                label="Future pros"
                line="1:1 coaching with PGA pros Nick Schiavo and Nick Monticello, once or twice a week."
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
              <BookLink offer="junior">Schedule junior coaching</BookLink>
            </div>
          </div>
          <VideoSlot
            src={JUNIORS_FILM.src}
            srcMobile={JUNIORS_FILM.srcMobile}
            poster={JUNIORS_FILM.poster}
            posterAlt="A junior golfer swinging in a Par2Play simulator bay"
            className="aspect-video @3xl:order-1"
            pausable
          />
        </div>
      </section>

      <section id="events" className={sectionSpace}>
        <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Events</h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed">
          Four enclosed bays, with a golf pro for mini-lessons and casual games.
        </p>
        <div className="mt-6">
          <EventTypeList />
        </div>
        <div className="mt-8">
          <EventGallery />
        </div>
        <CtaPair className="mt-8">
          <a
            href={pageHref("events")}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] ${buttonFocus}`}
          >
            See events
          </a>
          <a
            href={OCLOCK.events}
            target="_blank"
            rel="noopener noreferrer"
            data-offer="group"
            onClick={(event) => trackAnchor(event.currentTarget)}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-[#0A0F0B] bg-white px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#f3f6f1] ${buttonFocus}`}
          >
            Check availability
          </a>
        </CtaPair>
      </section>

      <section id="tournament" className={`${sectionSpace} text-center`}>
        <h2 className="mx-auto max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-5xl">
          Par2Play Fall League Coming Soon!
        </h2>
        <div className="mt-10">
          <TournamentForm />
        </div>
      </section>

      <nav aria-label="Services" className="px-6 pb-4 text-base leading-relaxed @3xl:px-12">
        <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("coaching")}>
          Golf lessons in Somerset
        </a>
        {" · "}
        <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("membership")}>
          Indoor golf membership
        </a>
        {" · "}
        <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("juniors")}>
          Junior golf
        </a>
        {" · "}
        <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("events")}>
          Golf simulator parties
        </a>
        {" · "}
        <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("tournament")}>
          Fall League
        </a>
      </nav>
      <FaqSection />

      <footer className="px-6 py-20 @3xl:px-12 @3xl:py-24">
        <div className="grid items-start gap-x-12 gap-y-8 @3xl:grid-cols-2 @5xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
          <VisitLine />
          <nav className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
            {SITE_NAV.map((item) => (
              <a key={item.slug} href={pageHref(item.slug)} className={navButton}>
                {item.label}
              </a>
            ))}
          </nav>
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
