import { useState, type ReactNode } from "react";
import { Mark } from "../components/Chrome";
import { BookLink, MembershipLink } from "../components/Cta";
import { EnquiryForm } from "../components/EnquiryForm";
import { HeroVideo, Photo } from "../components/Media";
import { NAP, PRICES, golfClockBookingReady } from "../data/business";
import { money } from "../data/catalog";
import { GROUP_LESSONS } from "../data/groupLessons";
import { PHOTOS } from "../data/photos";
import { GOOGLE_RATING, REVIEW_QUOTES } from "../data/reviews";
import { useFlow } from "../state/flow";

const links = [
  ["practice", "Practice"],
  ["lessons", "Lessons"],
  ["juniors", "Juniors"],
  ["venue", "Venue"],
] as const;

const navButton = "text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 hover:text-slate-950";

const review = REVIEW_QUOTES.find((item) => item.id === "tristan");

function Readout({ kicker, value, action }: { kicker: string; value: string; action: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-6">
      <div>
        <p className="font-display text-2xl tracking-tight text-slate-950 @3xl:text-3xl">{value}</p>
        <p className="mt-1 text-sm text-slate-600">{kicker}</p>
      </div>
      {action}
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

  return (
    <div className={`@container bg-white text-slate-950 ${scroll}`}>
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 @3xl:px-12">
        <Mark />
        <nav className="hidden items-center gap-7 @3xl:flex" aria-label="Page">
          {links.map(([id, label]) => (
            <button key={id} className={navButton} type="button" onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <BookLink offer="bay" className="h-10 px-4 text-[10px]">
            Book
          </BookLink>
        </nav>
        <button
          type="button"
          className="h-11 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] @3xl:hidden"
          aria-expanded={menu}
          onClick={() => setMenu((open) => !open)}
        >
          {menu ? "Close" : "Menu"}
        </button>
      </header>
      {menu && (
        <nav className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 text-[12px] font-medium uppercase tracking-[0.16em] @3xl:hidden" aria-label="Page">
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

      <section className="grid @3xl:grid-cols-2">
        <div className="order-2 yardage px-6 py-16 @3xl:order-1 @3xl:px-12 @3xl:py-24">
          <p className="font-display text-sm tracking-[0.2em] text-[#0c8f3e]">SOMERSET, NJ</p>
          <h1 className="mt-4 max-w-md font-display text-5xl font-semibold leading-[0.95] tracking-tight @3xl:text-6xl">
            Indoor golf on Hamilton Street.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-700">
            An indoor golf club in Somerset, NJ. Simulator bays, year-round. PGA pros Nick and Sean. Juniors. Unlimited practice is {money(PRICES.unlimitedMonthly)} a month. Book online.
          </p>
          <p className="mt-8 font-display text-sm tracking-[0.14em]">
            {GOOGLE_RATING} ★ GOOGLE
          </p>
          {review && (
            <p className="mt-2 max-w-md text-sm text-slate-500">
              {review.name} · {review.excerpt}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BookLink offer="bay">Book</BookLink>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-full border border-slate-300 px-5 text-[12px] font-semibold uppercase tracking-[0.14em]"
              onClick={() => jump("venue")}
            >
              See the venue
            </button>
          </div>
        </div>
        <div className="relative order-1 min-h-[280px] @3xl:order-2 @3xl:min-h-[680px]">
          <HeroVideo />
        </div>
      </section>

      <nav className="mx-auto max-w-5xl px-6 py-8 @3xl:px-12" aria-label="Offers">
        {(
          [
            ["practice", "Practice", "Up to four friends. $70 a session."],
            ["lessons", "Lessons", "Nick and Sean, PGA. 3-pack $240."],
            ["juniors", "Juniors", "$249 or $399 a month. Unlimited access."],
          ] as const
        ).map(([id, label, line]) => (
          <button
            key={id}
            type="button"
            className="flex w-full items-baseline justify-between gap-6 border-b border-slate-200 py-7 text-left"
            onClick={() => jump(id)}
          >
            <span>
              <span className="block font-display text-2xl tracking-tight">{label}</span>
              <span className="mt-1 block text-sm text-slate-600">{line}</span>
            </span>
            <span className="font-display text-sm tracking-[0.16em] text-[#0c8f3e]" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </nav>

      <section id="practice" className="scroll-mt-6 mx-auto max-w-5xl px-6 py-20 @3xl:px-12 @3xl:py-28">
        <h2 className="font-display text-4xl font-semibold tracking-tight">Practice</h2>
        <div className="mt-8">
          <Readout
            value={`${money(PRICES.baySession)} / SESSION`}
            kicker="Up to 4 friends."
            action={<BookLink offer="bay">Book</BookLink>}
          />
          <Readout
            value="10-PACK"
            kicker="Price TODO."
            action={<BookLink offer="ten-pack">Book</BookLink>}
          />
          <Readout
            value={`${money(PRICES.unlimitedMonthly)} / MO · UNLIMITED`}
            kicker="No minimum."
            action={<MembershipLink>Book</MembershipLink>}
          />
        </div>
        <BookLink offer="tournament" tone="text" className="mt-6">
          Reserve your tournament spot
        </BookLink>
      </section>

      <section id="lessons" className="scroll-mt-6 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 @3xl:px-12 @3xl:py-28">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Lessons</h2>
          <p className="mt-4 font-display text-sm tracking-[0.16em] text-[#0c8f3e]">PGA PROS · NICK & SEAN</p>
          <div className="mt-8">
            <Readout
              value={`${money(PRICES.lessonPack3)} / 3-PACK`}
              kicker="30-minute lessons."
              action={<BookLink offer="lesson">Book</BookLink>}
            />
            <Readout
              value={`${money(PRICES.swingEvaluation)} / EVAL`}
              kicker={`${PRICES.swingEvaluationMinutes} minutes. Once per golfer.`}
              action={<BookLink offer="swing-evaluation">Book</BookLink>}
            />
          </div>
          <div className="mt-14">
            <h3 className="font-display text-2xl tracking-tight">Group lessons</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0c8f3e]">TODO · sample rows, not a live schedule</p>
            <ul className="mt-4">
              {GROUP_LESSONS.map((lesson) => (
                <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 py-4 text-sm">
                  <p>
                    <span className="font-display tracking-wide">{lesson.day}</span>
                    <span className="mx-2 text-slate-300">·</span>
                    {lesson.time}
                    <span className="mx-2 text-slate-300">·</span>
                    Spots {lesson.spotsLeft}
                  </p>
                  <BookLink offer="group" tone="solid" className="h-10 px-4 text-[10px]">
                    Sign up
                  </BookLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="juniors" className="scroll-mt-6 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 @3xl:px-12 @3xl:py-28">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Juniors</h2>
          <div className="mt-8">
            <Readout
              value={`${money(PRICES.juniorOneLessonWeekly)} / MO`}
              kicker="1 weekly 1:1. Unlimited access."
              action={<BookLink offer="junior">Book</BookLink>}
            />
            <Readout
              value={`${money(PRICES.juniorTwoLessonsWeekly)} / MO`}
              kicker="2 weekly lessons. Unlimited access."
              action={<BookLink offer="junior-plus">Book</BookLink>}
            />
          </div>
        </div>
      </section>

      <section id="venue" className="scroll-mt-6 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 @3xl:px-12 @3xl:py-28">
          <h2 className="font-display text-4xl font-semibold tracking-tight">
            {NAP.street}, {NAP.city}.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-1 @3xl:grid-cols-4">
            {[PHOTOS.bays, PHOTOS.storefront, PHOTOS.lounge, PHOTOS.range].map((photo) => (
              <div key={photo.id} className="aspect-[4/3] overflow-hidden bg-slate-100">
                <Photo photo={photo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="scroll-mt-6 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 @3xl:px-12 @3xl:py-28">
          <h2 className="font-display text-5xl font-semibold tracking-tight">Book a bay.</h2>
          <div className="mt-8">
            <BookLink offer="bay">Book</BookLink>
          </div>
          <div className="mt-20 grid gap-16 @3xl:grid-cols-[minmax(0,1fr)_16rem]">
            <EnquiryForm />
            <address className="not-italic text-sm leading-relaxed text-slate-700">
              <span className="font-display text-lg tracking-tight text-slate-950">Par2Play</span>
              <br />
              {NAP.street}
              <br />
              {NAP.city}, {NAP.region} {NAP.postalCode}
              <br />
              <a className="mt-2 inline-block text-slate-950 underline-offset-4 hover:underline" href={NAP.phoneTel}>
                {NAP.phoneDisplay}
              </a>
            </address>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-10 @3xl:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 @3xl:flex-row @3xl:items-center @3xl:justify-between">
          <p className="font-display tracking-[0.14em]">PAR2PLAY · SOMERSET, NJ</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500" aria-label="Footer">
            {links.map(([id, label]) => (
              <button key={id} type="button" className="hover:text-slate-950" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-5xl text-xs text-slate-400">© 2026 Par2Play</p>
        {!golfClockBookingReady() && (
          <p className="mx-auto mt-2 max-w-5xl text-xs text-slate-400">
            GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
          </p>
        )}
      </footer>
    </div>
  );
}
