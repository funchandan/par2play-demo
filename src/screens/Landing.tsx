import { useState } from "react";
import { Mark } from "../components/Chrome";
import { BookLink, MembershipLink } from "../components/Cta";
import { EnquiryForm } from "../components/EnquiryForm";
import { ClipTile, HeroVideo, Photo } from "../components/Media";
import { ReviewCarousel } from "../components/ReviewCarousel";
import {
  ADDRESS_LINE,
  COACH_LINE,
  NAP,
  PRICES,
  golfClockBookingReady,
} from "../data/business";
import { money } from "../data/catalog";
import { GROUP_LESSONS } from "../data/groupLessons";
import { CLIPS } from "../data/media";
import { PHOTOS } from "../data/photos";
import { useFlow } from "../state/flow";

const navButton =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 hover:text-[#14D45E]";

const links = [
  ["practice", "Practice"],
  ["coaching", "Coaching"],
  ["venue", "Venue"],
  ["enquire", "Enquire"],
] as const;

function priceOrTodo(amount: number | null): string {
  return amount === null ? "TODO" : money(amount);
}

export function Landing() {
  const flow = useFlow();
  const [menu, setMenu] = useState(false);
  const scroll = flow.layout === "mobile" ? "h-full overflow-y-auto" : "";
  const venueClip = CLIPS.find((clip) => clip.id === "venue");
  const coachingClip = CLIPS.find((clip) => clip.id === "coaching");
  const juniorClip = CLIPS.find((clip) => clip.id === "junior");

  const jump = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`@container bg-white text-slate-950 ${scroll}`}>
      <section className="relative flex min-h-[720px] flex-col overflow-hidden bg-slate-950 text-white @3xl:min-h-[860px]">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 @3xl:px-14">
          <Mark light />
          <nav className="hidden items-center gap-8 @3xl:flex" aria-label="Page">
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
            className="h-11 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white @3xl:hidden"
            aria-expanded={menu}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
        {menu && (
          <nav
            className="relative z-10 flex flex-col gap-4 px-6 pb-4 text-[12px] font-medium uppercase tracking-[0.16em] text-white @3xl:hidden"
            aria-label="Page"
          >
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
        <div className="relative z-10 mt-auto flex flex-col gap-8 px-6 pb-16 @3xl:px-14 @3xl:pb-20">
          <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight @3xl:text-7xl">
            Your range never closes.
          </h1>
          <ReviewCarousel />
          <BookLink offer="bay" className="w-fit">
            Book a bay
          </BookLink>
        </div>
      </section>

      <section id="practice" className="scroll-mt-8 px-6 py-24 @3xl:px-14 @3xl:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-5xl font-semibold tracking-tight @3xl:text-6xl">Practice.</h2>
          <div className="mt-16 grid gap-6 @3xl:grid-cols-3">
            <article className="flex flex-col rounded-3xl border border-slate-200 p-8">
              <h3 className="font-display text-3xl font-semibold">Play with friends</h3>
              <p className="mt-4 text-slate-600">Bring up to four friends. Book a bay.</p>
              <p className="mt-10 font-display text-5xl font-semibold">{money(PRICES.baySession)}</p>
              <p className="mt-1 text-sm text-slate-500">per session</p>
              <BookLink offer="bay" tone="solid" className="mt-8 w-fit">
                Book
              </BookLink>
            </article>
            <article className="flex flex-col rounded-3xl border border-slate-200 p-8">
              <h3 className="font-display text-3xl font-semibold">Monthly routine</h3>
              <p className="mt-4 text-slate-600">Commit monthly. Save with a 10-pack.</p>
              <p className="mt-10 font-display text-5xl font-semibold">{priceOrTodo(PRICES.tenPack)}</p>
              <p className="mt-1 text-sm text-slate-500">10-pack price</p>
              <BookLink offer="ten-pack" tone="solid" className="mt-8 w-fit">
                Book
              </BookLink>
            </article>
            <article className="flex flex-col rounded-3xl border border-slate-200 p-8">
              <h3 className="font-display text-3xl font-semibold">Regular sessions</h3>
              <p className="mt-4 text-slate-600">Book bays as you go. Unlimited practice when it sticks.</p>
              <p className="mt-10 font-display text-5xl font-semibold">{money(PRICES.unlimitedMonthly)}</p>
              <p className="mt-1 text-sm text-slate-500">per month · no minimum term</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <BookLink offer="bay" tone="solid">
                  Book
                </BookLink>
                <MembershipLink tone="dark">Join</MembershipLink>
              </div>
            </article>
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <BookLink offer="bay">Book a bay</BookLink>
            <BookLink offer="tournament" tone="dark">
              Reserve your tournament spot
            </BookLink>
          </div>
        </div>
      </section>

      <section id="coaching" className="scroll-mt-8 bg-[#f6f7f4] px-6 py-24 @3xl:px-14 @3xl:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c8f3e]">Coaching</p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight @3xl:text-6xl">
            {COACH_LINE}.
          </h2>
          <div className="mt-14 grid gap-10 @3xl:grid-cols-[1.1fr_0.9fr] @3xl:items-center">
            <ul className="grid gap-4 @3xl:grid-cols-3">
              <li className="rounded-3xl bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Evaluation</p>
                <p className="mt-4 font-display text-4xl font-semibold">{money(PRICES.swingEvaluation)}</p>
                <p className="mt-2 text-sm text-slate-600">{PRICES.swingEvaluationMinutes} min · once</p>
              </li>
              <li className="rounded-3xl bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">3-pack</p>
                <p className="mt-4 font-display text-4xl font-semibold">{money(PRICES.lessonPack3)}</p>
                <p className="mt-2 text-sm text-slate-600">30 min lessons</p>
              </li>
              <li className="rounded-3xl bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Swing lab</p>
                <p className="mt-4 font-display text-4xl font-semibold">{money(PRICES.swingLabMember)}</p>
                <p className="mt-2 text-sm text-slate-600">Members · group</p>
              </li>
            </ul>
            <div className="grid gap-4">
              <div className="aspect-[16/10] overflow-hidden rounded-3xl">
                <Photo photo={PHOTOS.gripLesson} />
              </div>
              {coachingClip && <ClipTile clip={coachingClip} caption="Illustration" />}
            </div>
          </div>

          <div className="mt-20 grid gap-8 @3xl:grid-cols-[0.8fr_1.2fr] @3xl:items-end">
            <div>
              <h3 className="font-display text-4xl font-semibold">Juniors.</h3>
              <p className="mt-3 text-slate-600">Unlimited access. No age range.</p>
            </div>
            <div className="grid gap-4 @3xl:grid-cols-2">
              <article className="rounded-3xl bg-white p-7">
                <p className="font-display text-4xl font-semibold">
                  {money(PRICES.juniorOneLessonWeekly)}
                  <span className="text-lg text-slate-500">/mo</span>
                </p>
                <p className="mt-3 text-slate-600">Once a week. 1:1 lesson. Unlimited access.</p>
                <BookLink offer="junior" tone="solid" className="mt-6 w-fit">
                  Book
                </BookLink>
              </article>
              <article className="rounded-3xl bg-white p-7">
                <p className="font-display text-4xl font-semibold">
                  {money(PRICES.juniorTwoLessonsWeekly)}
                  <span className="text-lg text-slate-500">/mo</span>
                </p>
                <p className="mt-3 text-slate-600">Twice a week. Lessons. Unlimited access.</p>
                <BookLink offer="junior-plus" tone="solid" className="mt-6 w-fit">
                  Book
                </BookLink>
              </article>
            </div>
          </div>

          <div className="mt-16 grid gap-6 @3xl:grid-cols-[1fr_1fr]">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl">
                <Photo photo={PHOTOS.juniorGroup} />
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl">
                <Photo photo={PHOTOS.juniorSetup} />
              </div>
            </div>
            {juniorClip && <ClipTile clip={juniorClip} caption="Illustration" className="self-stretch" />}
          </div>

          <div className="mt-20">
            <h3 className="font-display text-4xl font-semibold">Group lessons.</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[#0c8f3e]">TODO · schedule not confirmed</p>
            <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {GROUP_LESSONS.map((lesson) => (
                <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <p className="text-lg">
                    <span className="font-semibold">{lesson.day}</span>
                    <span className="mx-3 text-slate-300">/</span>
                    {lesson.time}
                    <span className="mx-3 text-slate-300">/</span>
                    <span className="text-slate-600">Spots {lesson.spotsLeft}</span>
                  </p>
                  <BookLink offer="group" tone="solid">
                    Sign up
                  </BookLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="venue" className="scroll-mt-8 px-6 py-24 @3xl:px-14 @3xl:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl font-display text-5xl font-semibold tracking-tight @3xl:text-6xl">
            The range is indoors.
          </h2>
          <ul className="mt-10 grid gap-6 text-lg @3xl:grid-cols-3">
            <li>{ADDRESS_LINE}</li>
            <li>Full Swing bays</li>
            <li>Lounge and club rack</li>
          </ul>
          <div className="mt-12 grid gap-4 @3xl:grid-cols-4">
            <div className="aspect-[16/10] overflow-hidden rounded-3xl @3xl:col-span-2 @3xl:aspect-auto @3xl:min-h-[420px]">
              <Photo photo={PHOTOS.bays} priority />
            </div>
            {venueClip && (
              <div className="@3xl:col-span-2">
                <ClipTile clip={venueClip} caption="Illustration" />
              </div>
            )}
            <div className="aspect-[4/3] overflow-hidden rounded-3xl @3xl:col-span-1">
              <Photo photo={PHOTOS.lounge} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl @3xl:col-span-1">
              <Photo photo={PHOTOS.storefront} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl @3xl:col-span-2">
              <Photo photo={PHOTOS.groupWave} />
            </div>
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-8 border-t border-slate-200 px-6 py-24 @3xl:px-14 @3xl:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 @3xl:grid-cols-2">
          <div>
            <h2 className="font-display text-5xl font-semibold tracking-tight @3xl:text-6xl">Say hello.</h2>
            <p className="mt-4 max-w-sm text-slate-600">Bays, membership, lessons, juniors, events, tournaments.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-16 text-white @3xl:px-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 @3xl:flex-row @3xl:items-end @3xl:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold">Par2Play</p>
            <p className="mt-4 text-white/80">{NAP.street}</p>
            <p className="text-white/80">
              {NAP.city}, {NAP.region} {NAP.postalCode}
            </p>
            <a className="mt-3 inline-block text-white underline-offset-4 hover:underline" href={NAP.phoneTel}>
              {NAP.phoneDisplay}
            </a>
            <p className="mt-3 text-sm text-white/60">{NAP.founder}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.16em]" aria-label="Footer">
            {links.map(([id, label]) => (
              <button key={id} type="button" className="text-white/80 hover:text-white" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        {!golfClockBookingReady() && (
          <p className="mx-auto mt-10 max-w-6xl text-xs text-white/50">
            GolfClock booking link: TODO. Buttons call {NAP.phoneDisplay}.
          </p>
        )}
        <p className="mx-auto mt-6 max-w-6xl text-xs text-white/40">© 2026 Par2Play</p>
      </footer>
    </div>
  );
}
