import { useState, type ReactNode } from "react";
import { Mark } from "../components/Chrome";
import { BookLink, MembershipLink } from "../components/Cta";
import { ClipTile, HeroVideo, Photo } from "../components/Media";
import { Icon } from "../components/Icons";
import {
  ADDRESS_LINE,
  BAY_WINDOWS,
  COACH_LINE,
  HOURS_PLACEHOLDER,
  NAP,
  PRICES,
  golfClockBookingReady,
  golfClockMembershipReady,
} from "../data/business";
import { money } from "../data/catalog";
import { CLIPS } from "../data/media";
import { PHOTOS } from "../data/photos";
import { useFlow } from "../state/flow";

const navButton =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 hover:text-[#14D45E]";

function priceOrTbd(amount: number | null): string {
  return amount === null ? "TBD" : money(amount);
}

function GolfClockNote() {
  if (golfClockBookingReady() && golfClockMembershipReady()) return null;
  return (
    <p className="max-w-xl text-sm leading-relaxed text-white/75">
      GolfClock booking link: TODO. Until that URL is connected, these buttons call {NAP.phoneDisplay}.
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${light ? "text-[#14D45E]" : "text-[#0c8f3e]"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 font-display text-4xl font-semibold tracking-tight @3xl:text-5xl ${light ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-slate-600"}`}>{copy}</p>
      )}
    </div>
  );
}

export function Landing() {
  const flow = useFlow();
  const [menu, setMenu] = useState(false);
  const scroll = flow.layout === "mobile" ? "h-full overflow-y-auto" : "";

  const jump = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = [
    ["practice", "Practice"],
    ["swing-lab", "Swing lab"],
    ["lessons", "Lessons"],
    ["juniors", "Juniors"],
    ["pricing", "Pricing"],
    ["visit", "Visit"],
  ] as const;

  return (
    <div className={`@container bg-white text-slate-900 ${scroll}`}>
      <section className="relative flex min-h-[640px] flex-col overflow-hidden bg-slate-950 text-white @3xl:min-h-[760px]">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-5 @3xl:px-12">
          <Mark light />
          <nav className="hidden items-center gap-7 @3xl:flex" aria-label="Page">
            {links.map(([id, label]) => (
              <button key={id} className={navButton} type="button" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
            <BookLink offer="bay" tone="line" className="h-10 px-4 text-[10px]">
              Book a bay
            </BookLink>
          </nav>
          <button
            type="button"
            className="h-11 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white @3xl:hidden"
            aria-expanded={menu}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
        {menu && (
          <nav className="relative z-10 flex flex-col gap-3 px-5 pb-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white @3xl:hidden" aria-label="Page">
            {links.map(([id, label]) => (
              <button key={id} type="button" className="text-left" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
          </nav>
        )}
        <div className="relative z-10 mt-auto flex flex-col gap-6 px-6 pb-12 @3xl:px-12 @3xl:pb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">Somerset, NJ</p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight @3xl:text-6xl">
            Your range never closes.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/90">
            Indoor golf at {ADDRESS_LINE}. Full Swing bays, a putting green, and a lounge. Unlimited practice is {money(PRICES.unlimitedMonthly)} a month, tax included, with no minimum term.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookLink offer="bay">Book a bay</BookLink>
            <MembershipLink tone="line">Join for {money(PRICES.unlimitedMonthly)}/mo</MembershipLink>
            <a
              href={NAP.phoneTel}
              className="inline-flex h-11 items-center rounded-full px-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white underline-offset-4 hover:underline"
            >
              {NAP.phoneDisplay}
            </a>
          </div>
          <GolfClockNote />
        </div>
      </section>

      <section className="bg-white px-6 py-16 @3xl:px-12 @3xl:py-20" aria-labelledby="inside-heading">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Inside Par2Play"
            title="Come for the game. Stay for the crew."
            copy="Photographs are from our own events. The short loops underneath are illustrations, not members."
          />
          <div className="mt-10 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
            {(
              [
                [PHOTOS.bays, "Come for the game"],
                [PHOTOS.groupWave, "Stay for the crew"],
                [PHOTOS.juniorGroup, "Juniors welcome"],
                [PHOTOS.gripLesson, "Coaching by PGA pros"],
              ] as const
            ).map(([photo, caption]) => (
              <figure key={caption} className="overflow-hidden rounded-2xl bg-slate-100">
                <div className="aspect-[4/3]">
                  <Photo photo={photo} />
                </div>
                <figcaption className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {CLIPS.map((clip) => (
              <ClipTile key={clip.id} clip={clip} />
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Loops are the clean opening of each clip, about two seconds, with the sound removed.
          </p>
        </div>
      </section>

      <section id="practice" className="scroll-mt-6 bg-slate-950 px-6 py-16 text-white @3xl:px-12 @3xl:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 @3xl:grid-cols-2">
          <div>
            <SectionHeading
              light
              eyebrow="Practice and membership"
              title={`${money(PRICES.unlimitedMonthly)} a month. No minimum term.`}
              copy="Unlimited practice on the Full Swing bays, plus the putting green and the lounge. Book, walk in, and swing. The price includes tax."
            />
            <ul className="mt-8 space-y-3 text-sm leading-relaxed text-white/80">
              <li>A single bay is {money(PRICES.baySession)} a session, tax included. Three sessions is {money(PRICES.baySession * 3)}, so the membership covers itself from the third visit.</li>
              <li>{BAY_WINDOWS.offPeak}</li>
              <li>{BAY_WINDOWS.onPeak} The session price is the same.</li>
              <li>
                Ten sessions are {money(PRICES.tenPack)}, tax included, against {money(PRICES.tenPackRack)} booked one at a time.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <MembershipLink>Join unlimited</MembershipLink>
              <BookLink offer="bay" tone="line">Book a bay · {money(PRICES.baySession)}</BookLink>
              <BookLink offer="ten-pack" tone="line">10 sessions · {money(PRICES.tenPack)}</BookLink>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.bays} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.range} />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.lounge} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="swing-lab" className="scroll-mt-6 px-6 py-16 @3xl:px-12 @3xl:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 @3xl:grid-cols-[1.1fr_0.9fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 @3xl:order-2">
            <Photo photo={PHOTOS.launchData} />
          </div>
          <div>
            <SectionHeading
              eyebrow="Swing lab"
              title="See the swing before you buy another lesson."
              copy="Swing analysis is the way in. A 50-minute evaluation with our coaches is $100, tax included, once per golfer. Full Swing data, then a plan you can follow."
            />
            <div className="mt-8 grid gap-4 @3xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0c8f3e]">Evaluation</p>
                <p className="mt-2 font-display text-3xl font-semibold">{money(PRICES.swingEvaluation)}</p>
                <p className="mt-2 text-sm text-slate-600">{PRICES.swingEvaluationMinutes} minutes · once per golfer · tax included</p>
              </article>
              <article className="rounded-2xl border border-slate-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0c8f3e]">Group swing lab</p>
                <p className="mt-2 font-display text-3xl font-semibold">{money(PRICES.swingLabMember)}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Members {money(PRICES.swingLabMember)}. Non-members {money(PRICES.swingLabGuest)}. Small group, one theme, data on every swing. Tax included.
                </p>
              </article>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookLink offer="swing-evaluation" tone="solid">Book a swing evaluation</BookLink>
              <BookLink offer="swing-lab" tone="dark">Book swing lab</BookLink>
            </div>
          </div>
        </div>
      </section>

      <section id="lessons" className="scroll-mt-6 bg-[#f4f7f4] px-6 py-16 @3xl:px-12 @3xl:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 @3xl:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Training"
              title={COACH_LINE}
              copy="Thirty-minute lessons, after a swing evaluation if you want a place to start. We do not publish surnames."
            />
            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <Icon name="coach" className="mt-0.5 text-[#0c8f3e]" />
                <span>30-minute lesson: {priceOrTbd(PRICES.lessonSingle)}. Price includes tax when it is set.</span>
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 text-[#0c8f3e]" />
                <span>3-lesson pack: {money(PRICES.lessonPack3)}, tax included.</span>
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 text-[#0c8f3e]" />
                <span>5, 10, and 20 lesson packs: TBD.</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookLink offer="lesson" tone="solid">Book a lesson</BookLink>
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full border border-slate-300 px-5 text-[12px] font-semibold uppercase tracking-[0.14em]"
                onClick={() => flow.startJoin()}
              >
                Help me choose
              </button>
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-500">
              The short quiz stays in this browser. Saving it to a GolfClock profile is still TODO — nothing is sent.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.gripLesson} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.coachAndPlayer} />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.ladiesClinic} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="juniors" className="scroll-mt-6 px-6 py-16 @3xl:px-12 @3xl:py-20">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Juniors"
            title="Supervised unlimited access. No age range."
            copy="A coach is in the lesson. Between lessons, juniors have supervised access to the facility. We do not publish an age bracket."
          />
          <div className="mt-10 grid gap-4 @3xl:grid-cols-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl @3xl:col-span-2">
              <Photo photo={PHOTOS.juniorGroup} />
            </div>
            <div className="grid gap-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.juniorSetup} />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Photo photo={PHOTOS.juniorScreen} />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 @3xl:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0c8f3e]">One lesson a week</p>
              <p className="mt-3 font-display text-4xl font-semibold">{money(PRICES.juniorOneLessonWeekly)}<span className="text-lg text-slate-500">/mo</span></p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">One 1:1 lesson a week and supervised unlimited facility access. Tax included.</p>
            </article>
            <article className="rounded-3xl border border-slate-200 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0c8f3e]">Two lessons a week</p>
              <p className="mt-3 font-display text-4xl font-semibold">{money(PRICES.juniorTwoLessonsWeekly)}<span className="text-lg text-slate-500">/mo</span></p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Two 1:1 lessons a week and supervised unlimited facility access. Tax included.</p>
            </article>
          </div>
          <div className="mt-6">
            <BookLink offer="junior" tone="solid">Enrol a junior</BookLink>
          </div>
        </div>
      </section>

      <section id="visit" className="scroll-mt-6 bg-slate-950 px-6 py-16 text-white @3xl:px-12 @3xl:py-20">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            light
            eyebrow="The venue"
            title="Bays, lounge, clubs, and the front door."
            copy={`${ADDRESS_LINE}. ${HOURS_PLACEHOLDER}`}
          />
          <ul className="mt-8 grid gap-4 text-sm text-white/80 @3xl:grid-cols-3">
            {(
              [
                ["screen", "Full Swing bays", "Book on your phone, walk in, and play. Midday is the quieter window."],
                ["room", "Lounge and events", "Birthdays and team nights use the lounge. Event packages are TBD — call with a date and a headcount."],
                ["coach", "Putting green and club rack", "Warm up on the green. Clubs are in the building if you did not bring yours."],
              ] as const
            ).map(([icon, title, copy]) => (
              <li key={title} className="rounded-2xl border border-white/10 p-5">
                <Icon name={icon} className="text-[#14D45E]" />
                <p className="mt-3 font-display text-xl font-semibold text-white">{title}</p>
                <p className="mt-2 leading-relaxed">{copy}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 @3xl:grid-cols-4">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl @3xl:col-span-2 @3xl:aspect-[16/9]">
              <Photo photo={PHOTOS.storefront} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.logoWall} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.lounge} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.clubRack} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.holidayLounge} />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={NAP.phoneTel} className="inline-flex h-11 items-center rounded-full bg-[#14D45E] px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#06210f]">
              Call {NAP.phoneDisplay}
            </a>
            <BookLink offer="bay" tone="line">Book a bay</BookLink>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 @3xl:px-12" aria-labelledby="community-heading">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="community-heading" className="font-display text-4xl font-semibold tracking-tight">
            The room after the round
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Birthdays, clinics, and nights when the whole group ends up in front of the screen. These are our photographs.
          </p>
          <div className="mt-8 grid gap-4 @3xl:grid-cols-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.birthdayGroup} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.groupWave} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <Photo photo={PHOTOS.ladiesClinic} />
            </div>
          </div>
        </div>
      </section>

      <section id="league" className="scroll-mt-6 border-y border-slate-200 bg-[#f7faf7] px-6 py-14 @3xl:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 @3xl:flex-row @3xl:items-end @3xl:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c8f3e]">Coming soon</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">February league</h2>
            <p className="mt-3 text-slate-600">
              Format, dates, and price are not set. This is a note, not a signup. Call if you want to hear when it opens.
            </p>
          </div>
          <a href={NAP.phoneTel} className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
            Call about the league
          </a>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-6 px-6 py-16 @3xl:px-12 @3xl:py-20">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Pricing"
            title="Tax included. What we know, and what is still TBD."
            copy="Bay time, membership, the 10-pack, swing analysis, the 3-lesson pack, and junior memberships are set. A single 30-minute lesson and the larger lesson packs are not."
          />
          <div className="mt-10 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">
            <PriceCard
              name="Bay session"
              price={money(PRICES.baySession)}
              detail={`${BAY_WINDOWS.offPeak} ${BAY_WINDOWS.onPeak}`}
              action={<BookLink offer="bay" tone="solid" className="w-full">Book a bay</BookLink>}
            />
            <PriceCard
              name="10 sessions"
              price={money(PRICES.tenPack)}
              detail={`${PRICES.tenPackSessions} sessions, tax included, against ${money(PRICES.tenPackRack)} one at a time.`}
              action={<BookLink offer="ten-pack" tone="solid" className="w-full">Get the 10-pack</BookLink>}
            />
            <PriceCard
              name="Unlimited practice"
              price={`${money(PRICES.unlimitedMonthly)}/mo`}
              detail="No minimum term. Bays, putting green, and lounge. Tax included."
              action={<MembershipLink tone="solid" className="w-full">Join</MembershipLink>}
              featured
            />
            <PriceCard
              name="Swing evaluation"
              price={money(PRICES.swingEvaluation)}
              detail={`${PRICES.swingEvaluationMinutes} minutes, once per golfer, tax included.`}
              action={<BookLink offer="swing-evaluation" tone="solid" className="w-full">Book an evaluation</BookLink>}
            />
            <PriceCard
              name="Lessons"
              price={priceOrTbd(PRICES.lessonSingle)}
              detail={`30 minutes with ${COACH_LINE}. 3-pack ${money(PRICES.lessonPack3)}, tax included. Packs of 5, 10, and 20: TBD.`}
              action={<BookLink offer="lesson" tone="solid" className="w-full">Book a lesson</BookLink>}
            />
            <PriceCard
              name="Juniors"
              price={`${money(PRICES.juniorOneLessonWeekly)} / ${money(PRICES.juniorTwoLessonsWeekly)}`}
              detail="Per month, tax included. One or two weekly 1:1 lessons, plus supervised unlimited access. No age range."
              action={<BookLink offer="junior" tone="solid" className="w-full">Enrol a junior</BookLink>}
            />
            <PriceCard
              name="Swing lab"
              price={`${money(PRICES.swingLabMember)} / ${money(PRICES.swingLabGuest)}`}
              detail="Members / non-members. Monthly small-group lab. Tax included."
              action={<BookLink offer="swing-lab" tone="solid" className="w-full">Book swing lab</BookLink>}
            />
          </div>
        </div>
      </section>

      <section id="stories" className="scroll-mt-6 bg-slate-50 px-6 py-16 @3xl:px-12">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Member stories"
            title="Quotes are not on the site yet."
            copy="TODO: publish member stories once the wording and the credit line are confirmed. Players, including one member we know as the doctor, have said they may appear. No quote is invented here."
          />
        </div>
      </section>

      <footer id="about" className="scroll-mt-6 border-t border-slate-200 px-6 py-14 @3xl:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-10 @3xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">Par2Play</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              Indoor golf in Somerset, founded by {NAP.founder}. Full Swing simulators, coaching, and a lounge.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">Visit</p>
            <p className="mt-2">{NAP.street}</p>
            <p>{NAP.city}, {NAP.region} {NAP.postalCode}</p>
            <p className="mt-2">
              <a className="underline decoration-[#14D45E] underline-offset-4" href={NAP.phoneTel}>{NAP.phoneDisplay}</a>
            </p>
            <p className="mt-2">{HOURS_PLACEHOLDER}</p>
          </div>
          <div className="text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">Book</p>
            <p className="mt-2">Bays, lessons, swing lab, and junior signup use one GolfClock calendar. Membership checkout is a separate GolfClock link.</p>
            <p className="mt-2">GolfClock URLs: TODO.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Par2Play. Somerset, NJ.</p>
          <p>Prices include tax.</p>
        </div>
      </footer>
    </div>
  );
}

function PriceCard({
  name,
  price,
  detail,
  action,
  featured = false,
}: {
  name: string;
  price: string;
  detail: string;
  action: ReactNode;
  featured?: boolean;
}) {
  return (
    <article className={`flex flex-col rounded-3xl border p-6 ${featured ? "border-[#14D45E] bg-[#f3fff6]" : "border-slate-200"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{name}</p>
      <p className="mt-3 font-display text-4xl font-semibold tracking-tight">{price}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{detail}</p>
      <div className="mt-6">{action}</div>
    </article>
  );
}
