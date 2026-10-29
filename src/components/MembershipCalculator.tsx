import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, Clock, SunMedium, Undo2, type LucideIcon } from "lucide-react";
import { BookLink, MembershipLink } from "./Cta";
import { VideoSlot } from "./VideoSlot";
import { NAP, PRICES, bookingHref, membershipHref } from "../data/business";
import { TESTIMONIAL_FILMS } from "../data/films";
import { COMPARE_HOURS_MAX, SESSIONS_PER_PACK, estimateMonth, money } from "../data/membershipEstimate";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** 30-minute bay slots show $35. The hour rate is PRICES.baySession. */
const HALF_HOUR = PRICES.baySession / 2;
const SCALE = COMPARE_HOURS_MAX * PRICES.baySession;
const FILM = TESTIMONIAL_FILMS[0];

const benefits: readonly { title: string; line: string; icon: LucideIcon }[] = [
  {
    title: "An hour a day",
    line: `Up to an hour each day you come in, instead of $${PRICES.baySession} an hour.`,
    icon: Clock,
  },
  {
    title: "First in line",
    line: "First in line for the times that suit you.",
    icon: CalendarDays,
  },
  {
    title: "Around your day",
    line: "Dentist visits and school pickup.",
    icon: SunMedium,
  },
  {
    title: "Cancel anytime",
    line: "par2play.com says you can cancel anytime.",
    icon: Undo2,
  },
];

const badge = "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#10281A] text-[#14D45E]";

function useAnimatedAmount(target: number, reduce: boolean): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    if (reduce || from === target) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 320;
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(from + (target - from) * eased);
      valueRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);

  return value;
}

function QuietLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="aa-focus-ink inline-flex min-h-11 items-center text-base font-semibold text-white underline decoration-2 underline-offset-4"
    >
      {children}
    </a>
  );
}

function CostBar({
  label,
  amount,
  width,
  fill,
  marker,
  thick = false,
  onDark = false,
}: {
  label: string;
  amount: number;
  width: string;
  fill: string;
  marker: string;
  thick?: boolean;
  onDark?: boolean;
}) {
  const ink = onDark ? "text-white" : "text-[#0A0F0B]";
  const line = onDark ? "bg-white" : "bg-[#0A0F0B]";
  const track = onDark ? "bg-white/15" : "bg-[#0A0F0B]/10";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-base font-semibold ${ink}`}>{label}</p>
        <p className={`text-base font-semibold tabular-nums ${ink}`}>{money(amount)}</p>
      </div>
      <div className={`relative mt-1 rounded-full ${track} ${thick ? "h-3.5" : "h-2"}`}>
        <div className={`pace-bar absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width }} />
        <div className={`absolute inset-y-[-7px] w-0.5 ${line}`} style={{ left: marker }} />
      </div>
    </div>
  );
}

export function MembershipCalculator() {
  const [hours, setHours] = useState(8);
  const reduce = usePrefersReducedMotion();
  const sliderId = useId();
  const pace = estimateMonth(hours);
  const wins = pace.saveVsPayg > 0;
  const shownPayg = useAnimatedAmount(pace.payg, reduce);
  const shownSave = useAnimatedAmount(Math.max(0, pace.saveVsPayg), reduce);
  const marker = `${(pace.membership / SCALE) * 100}%`;
  const breakAt = `${((pace.breakEvenHour - 1) / (COMPARE_HOURS_MAX - 1)) * 100}%`;
  const widthOf = (amount: number) => `${Math.min(100, (amount / SCALE) * 100)}%`;
  const hourWord = pace.hours === 1 ? "hour" : "hours";
  const setPace = (next: number) => setHours(estimateMonth(next).hours);
  const paceFill = `${((pace.hours - 1) / (COMPARE_HOURS_MAX - 1)) * 100}%`;
  const live = wins
    ? `Pay as you go ${money(pace.payg)}. Membership ${money(pace.membership)}. You save ${money(pace.saveVsPayg)} a month.`
    : `At ${pace.hours} ${hourWord}, pay as you go is ${money(pace.payg)}. Just come try it.`;

  return (
    <div className="grid gap-16 @3xl:gap-24">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="overflow-hidden rounded-3xl bg-[#020806] @3xl:grid @3xl:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-8 @3xl:px-10 @3xl:py-12">
          <h1 id="why-membership-heading" className="text-base font-semibold uppercase tracking-[0.14em] text-[#7DFFB0]">
            Membership
          </h1>
          <p className="mt-3 text-base font-semibold text-white">
            {money(PRICES.unlimitedMonthly)}/mo · up to 1 hour a day
          </p>
          <div aria-live="polite" aria-atomic="true" className="mt-6">
            <p className="sr-only">{live}</p>
            {wins ? (
              <p className="font-display text-6xl font-semibold leading-none tracking-tight text-white @5xl:text-7xl">
                <span className="mr-3 text-4xl text-[#E5E7EB] line-through decoration-2 @5xl:text-5xl">{money(shownPayg)}</span>
                {money(pace.membership)}
              </p>
            ) : (
              <p className="font-display text-6xl font-semibold leading-none tracking-tight text-white @5xl:text-7xl">
                {money(shownPayg)}
              </p>
            )}
            <p className="mt-3 text-xl font-semibold leading-snug text-white @5xl:text-2xl">
              {wins ? (
                <>
                  You save <span className="text-[#7DFFB0]">{money(shownSave)}</span> a month
                </>
              ) : (
                <>
                  At {pace.hours} {hourWord}, pay as you go is {money(pace.payg)}. Just come try it.
                </>
              )}
            </p>
          </div>
          <div className="mt-6">
            <label htmlFor={sliderId} className="text-base font-semibold text-white">
              Hours you play a month
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="Fewer hours"
                onClick={() => setPace(pace.hours - 1)}
              >
                −
              </button>
              <div className="relative min-w-0 flex-1">
                <input
                  id={sliderId}
                  className="pace-slider pace-slider-on-dark"
                  type="range"
                  min={1}
                  max={COMPARE_HOURS_MAX}
                  step={1}
                  value={pace.hours}
                  style={{ ["--pace" as string]: paceFill }}
                  aria-valuetext={`${pace.hours} ${hourWord} you play a month`}
                  onChange={(event) => setPace(Number(event.target.value))}
                />
                <span
                  className="pointer-events-none absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-[#7DFFB0]"
                  style={{ left: breakAt }}
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute top-full -translate-x-1/2 text-sm font-semibold text-[#7DFFB0]"
                  style={{ left: breakAt }}
                  aria-hidden="true"
                >
                  {pace.breakEvenHour}
                </span>
              </div>
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="More hours"
                onClick={() => setPace(pace.hours + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-7">
            {wins ? (
              <MembershipLink className="w-full @3xl:w-fit">
                Become a Member, save {money(pace.saveVsPayg)}
              </MembershipLink>
            ) : (
              <BookLink offer="bay" className="w-full @3xl:w-fit">
                Try it out
              </BookLink>
            )}
            <div className="mt-2">
              {wins ? (
                <QuietLink href={bookingHref("bay")}>Try it out</QuietLink>
              ) : (
                <QuietLink href={membershipHref()}>Become a Member</QuietLink>
              )}
            </div>
          </div>
        </div>
        <VideoSlot
          src={FILM.src}
          srcMobile={FILM.srcMobile}
          poster={FILM.poster}
          className="min-h-56 @3xl:min-h-full"
          pausable
        />
      </section>

      <section aria-label="Monthly cost">
        <div className="grid gap-4">
          <CostBar label="Pay as you go" amount={pace.payg} width={widthOf(pace.payg)} fill="bg-[#4b5563]" marker={marker} />
          <CostBar label="10 Practice Pack" amount={pace.pack} width={widthOf(pace.pack)} fill="bg-[#5C6560]" marker={marker} />
          <CostBar
            label="Practice Unlimited"
            amount={pace.membership}
            width={widthOf(pace.membership)}
            fill="bg-[#14D45E]"
            marker={marker}
            thick
          />
        </div>
      </section>

      <section aria-labelledby="perk-heading">
        <h2 id="perk-heading" className="font-display text-3xl font-semibold tracking-tight @5xl:text-4xl">
          What ${PRICES.unlimitedMonthly} a month covers
        </h2>
        <ul className="mt-6 grid gap-4 @3xl:grid-cols-4">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="rounded-2xl border-2 border-[#4b5563] bg-white p-4">
              <span className={badge}>
                <benefit.icon className="size-6" aria-hidden="true" strokeWidth={2} />
              </span>
              <h3 className="mt-3 text-xl font-semibold leading-tight text-[#0A0F0B]">{benefit.title}</h3>
              <p className="mt-1 text-base leading-snug text-[#0A0F0B]">{benefit.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rates-heading">
        <h2 id="rates-heading" className="font-display text-3xl font-semibold tracking-tight @5xl:text-4xl">
          At this pace
        </h2>
        <div className="mt-6 grid gap-3 @3xl:hidden">
          <article className="rounded-2xl bg-[#020806] p-4 text-white">
            <h3 className="text-base font-semibold">Practice Unlimited</h3>
            <p className="mt-2 text-base leading-snug">Up to 1 hour a day.</p>
            <p className="mt-1 font-display text-3xl font-semibold text-[#7DFFB0]">{money(pace.perHourMembership)} an hour</p>
          </article>
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-2xl border-2 border-[#4b5563] bg-white p-4">
              <h3 className="text-base font-semibold text-[#0A0F0B]">Pay as you go</h3>
              <p className="mt-2 text-base leading-snug text-[#0A0F0B]">30, 60, 120, or 180 minutes a booking.</p>
              <p className="mt-1 text-base font-semibold text-[#0A0F0B]">{money(pace.perHourPayg)} an hour</p>
            </article>
            <article className="rounded-2xl border-2 border-[#4b5563] bg-white p-4">
              <h3 className="text-base font-semibold text-[#0A0F0B]">10 Practice Pack</h3>
              <p className="mt-2 text-base leading-snug text-[#0A0F0B]">{SESSIONS_PER_PACK} sessions of 60 minutes.</p>
              <p className="mt-1 text-base font-semibold text-[#0A0F0B]">{money(pace.perHourPack)} an hour</p>
            </article>
          </div>
        </div>
        <div className="mt-6 hidden overflow-x-auto rounded-2xl border-2 border-[#0A0F0B] bg-white @3xl:block">
          <table className="w-full border-collapse text-left text-base">
            <caption className="sr-only">Bay time and the hourly cost at the selected hours</caption>
            <thead>
              <tr className="border-b-2 border-[#0A0F0B]">
                <th scope="col" className="px-4 py-3 font-semibold">
                  <span className="sr-only">Question</span>
                </th>
                <th scope="col" className="bg-[#020806] px-4 py-3 font-semibold text-white">
                  Practice Unlimited
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pay as you go
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  10 Practice Pack
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#0A0F0B]/15">
                <th scope="row" className="px-4 py-4 font-semibold">
                  Bay time
                </th>
                <td className="bg-[#020806] px-4 py-4 font-semibold text-white">Up to 1 hour a day.</td>
                <td className="px-4 py-4">30, 60, 120, or 180 minutes a booking.</td>
                <td className="px-4 py-4">{SESSIONS_PER_PACK} sessions of 60 minutes.</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-4 font-semibold">
                  Per hour now
                </th>
                <td className="bg-[#020806] px-4 py-4 font-semibold text-[#7DFFB0]">{money(pace.perHourMembership)}</td>
                <td className="px-4 py-4">{money(pace.perHourPayg)}</td>
                <td className="px-4 py-4">{money(pace.perHourPack)} to cover these hours</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-snug text-[#0A0F0B]">
          The pack figure is what it costs to cover these hours, not a monthly fee. {pace.packs}{" "}
          {pace.packs === 1 ? "pack" : "packs"} at {money(PRICES.tenPack)}. The ten sessions never expire. A 30-minute bay is $
          {HALF_HOUR}. Estimates; final price confirmed at GolfClock checkout.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <BookLink offer="ten-pack" tone="line">
            Buy the pack
          </BookLink>
          <p className="text-base text-[#0A0F0B]">10 sessions of 60 minutes, {money(pace.pack)} for this pace.</p>
        </div>
      </section>

      <section className="rounded-3xl bg-[#020806] px-6 py-12 text-center text-white @3xl:px-12" aria-labelledby="join-heading">
        <h2 id="join-heading" className="font-display text-4xl font-semibold tracking-tight">
          Join Practice Unlimited
        </h2>
        <div className="mt-6 flex justify-center">
          <MembershipLink>Become a Member</MembershipLink>
        </div>
        <p className="mt-6 text-base leading-snug">
          {NAP.street}
          <br />
          {NAP.city}, {NAP.region} {NAP.postalCode}
          <br />
          <a className="aa-focus-ink underline decoration-2 underline-offset-4" href={NAP.phoneTel}>
            {NAP.phoneDisplay}
          </a>
        </p>
        <p className="mt-3 text-base leading-snug">The hour count stays on this page. GolfClock opens the product itself.</p>
      </section>
    </div>
  );
}
