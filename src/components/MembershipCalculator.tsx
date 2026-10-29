import { useId, useState } from "react";
import { CalendarDays, Clock, SunMedium, Undo2, type LucideIcon } from "lucide-react";
import { BookLink, MembershipLink } from "./Cta";
import { VideoSlot } from "./VideoSlot";
import { NAP, PRICES } from "../data/business";
import { TESTIMONIAL_FILMS } from "../data/films";
import { COMPARE_HOURS_MAX, SESSIONS_PER_PACK, estimateMonth, money } from "../data/membershipEstimate";

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

function ordinal(hour: number): string {
  const mod = hour % 100;
  if (mod >= 11 && mod <= 13) return `${hour}th`;
  switch (hour % 10) {
    case 1:
      return `${hour}st`;
    case 2:
      return `${hour}nd`;
    case 3:
      return `${hour}rd`;
    default:
      return `${hour}th`;
  }
}

function CostBar({
  label,
  amount,
  width,
  fill,
  marker,
  thick = false,
}: {
  label: string;
  amount: number;
  width: string;
  fill: string;
  marker: string;
  thick?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-base font-semibold text-white">{label}</p>
        <p className="text-base font-semibold text-white tabular-nums">{money(amount)}</p>
      </div>
      <div className={`relative mt-1 rounded-full bg-white/15 ${thick ? "h-3.5" : "h-2"}`}>
        <div className={`pace-bar absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width }} />
        <div className="absolute inset-y-[-7px] w-0.5 bg-white" style={{ left: marker }} />
      </div>
    </div>
  );
}

export function MembershipCalculator() {
  const [hours, setHours] = useState(8);
  const sliderId = useId();
  const pace = estimateMonth(hours);
  const wins = pace.saveVsPayg > 0;
  const marker = `${(pace.membership / SCALE) * 100}%`;
  const widthOf = (amount: number) => `${Math.min(100, (amount / SCALE) * 100)}%`;
  const hourWord = pace.hours === 1 ? "hour" : "hours";
  const callout = wins
    ? `At ${pace.hours} ${hourWord} you'd pay ${money(pace.payg)} pay-as-you-go. Members pay ${money(pace.membership)} and save ${money(pace.saveVsPayg)}.`
    : `At ${pace.hours} ${hourWord} you'd pay ${money(pace.payg)} pay-as-you-go. Members pay ${money(pace.membership)}.`;
  const setPace = (next: number) => setHours(estimateMonth(next).hours);
  const paceFill = `${((pace.hours - 1) / (COMPARE_HOURS_MAX - 1)) * 100}%`;
  const live = `${callout} Bay time: up to 1 hour a day, or ${money(pace.perHourPayg)} an hour, or ${SESSIONS_PER_PACK} sessions in a pack. Per hour now: membership ${money(pace.perHourMembership)}, pack ${money(pace.perHourPack)}.`;

  return (
    <div className="grid gap-16 @3xl:gap-24">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="overflow-hidden rounded-3xl bg-[#020806] @3xl:grid @3xl:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-8 @3xl:px-10 @3xl:py-12">
          <h1 id="why-membership-heading" className="font-display text-4xl font-semibold leading-none tracking-tight text-white @5xl:text-6xl">
            Membership
          </h1>
          <p className="mt-4 text-base font-semibold text-[#7DFFB0]">Practice Unlimited</p>
          <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight text-white">
            {money(PRICES.unlimitedMonthly)}
            <span className="text-2xl">/mo</span>
          </p>
          <p className="mt-4 max-w-md text-base leading-snug text-white">
            Up to 1 hour a day. It pays for itself by the {ordinal(pace.breakEvenHour)} hour, against ${PRICES.baySession} an hour.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MembershipLink>Become a Member</MembershipLink>
            <BookLink offer="bay" tone="inverted">
              Try it out
            </BookLink>
          </div>
          <p className="mt-3 max-w-md text-base leading-snug text-white">You're welcome to just come try it.</p>

          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={sliderId} className="text-base font-semibold text-white">
                Hours this month
              </label>
              <output htmlFor={sliderId} className="font-display text-4xl font-semibold leading-none text-[#7DFFB0] tabular-nums">
                {pace.hours}
              </output>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="Fewer hours"
                onClick={() => setPace(pace.hours - 1)}
              >
                −
              </button>
              <input
                id={sliderId}
                className="pace-slider pace-slider-on-dark"
                type="range"
                min={1}
                max={COMPARE_HOURS_MAX}
                step={1}
                value={pace.hours}
                style={{ ["--pace" as string]: paceFill }}
                aria-valuetext={`${pace.hours} ${hourWord} this month`}
                onChange={(event) => setPace(Number(event.target.value))}
              />
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="More hours"
                onClick={() => setPace(pace.hours + 1)}
              >
                +
              </button>
            </div>
            <div aria-live="polite" aria-atomic="true" className="mt-5">
              <p className="sr-only">{live}</p>
              <p className="max-w-xl text-xl font-semibold leading-snug text-white">
                {wins ? (
                  <>
                    At {pace.hours} {hourWord} you'd pay {money(pace.payg)} pay-as-you-go. Members pay {money(pace.membership)} and save{" "}
                    <span className="text-[#7DFFB0]">{money(pace.saveVsPayg)}</span>.
                  </>
                ) : (
                  callout
                )}
              </p>
              {wins ? <p className="mt-2 w-fit rounded-full bg-[#14D45E] px-3 py-1 text-sm font-semibold text-[#0A0F0B]">Best value</p> : null}
            </div>
            <div className="mt-5 grid gap-3">
              <CostBar label="Pay as you go" amount={pace.payg} width={widthOf(pace.payg)} fill="bg-[#9CA3AF]" marker={marker} />
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
            <p className="relative mt-2 h-6 text-sm font-semibold text-white">
              <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: marker }}>
                {ordinal(pace.breakEvenHour)} hour
              </span>
            </p>
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
