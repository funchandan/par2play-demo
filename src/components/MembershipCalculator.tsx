import { useId, useState } from "react";
import { CalendarDays, Clock, SunMedium, Undo2, type LucideIcon } from "lucide-react";
import { BookLink, MembershipLink } from "./Cta";
import { PRICES } from "../data/business";
import {
  COMPARE_HOURS_MAX,
  SESSIONS_PER_PACK,
  estimateMonth,
  money,
} from "../data/membershipEstimate";

/** 30-minute bay slots show $35. The hour rate is PRICES.baySession. */
const HALF_HOUR = PRICES.baySession / 2;
const SCALE = COMPARE_HOURS_MAX * PRICES.baySession;

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

type Answer = { text: string; confirmed: boolean };

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

function AnswerCell({ answer, hero = false }: { answer: Answer; hero?: boolean }) {
  if (!answer.confirmed) {
    return <p className="text-base leading-snug text-[#374151]">Not confirmed</p>;
  }
  if (hero) {
    return (
      <p className="rounded-xl bg-[#020806] px-3 py-3 text-base font-semibold leading-snug text-white">{answer.text}</p>
    );
  }
  return (
    <p className="flex items-start gap-2 text-base leading-snug text-[#0A0F0B]">
      <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
        <path
          d="M4 10.5 8 14.5 16 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{answer.text}</span>
    </p>
  );
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
        <p className="text-base font-semibold leading-tight text-[#0A0F0B]">{label}</p>
        <p className="text-base font-semibold text-[#0A0F0B] tabular-nums">{money(amount)}</p>
      </div>
      <div className={`relative mt-1 rounded-full bg-[#0A0F0B]/10 ${thick ? "h-4" : "h-2.5"}`}>
        <div className={`pace-bar absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width }} />
        <div className="absolute inset-y-[-8px] w-0.5 bg-[#0A0F0B]" style={{ left: marker }} />
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
  const headline = `Membership pays for itself by your ${ordinal(pace.breakEvenHour)} hour each month.`;
  const callout = wins
    ? `At your pace you'd pay ${money(pace.payg)} pay-as-you-go. Members pay ${money(pace.membership)} and save ${money(pace.saveVsPayg)}.`
    : `At your pace you'd pay ${money(pace.payg)} pay-as-you-go. Members pay ${money(pace.membership)}.`;
  const setPace = (next: number) => setHours(estimateMonth(next).hours);
  const paceFill = `${((pace.hours - 1) / (COMPARE_HOURS_MAX - 1)) * 100}%`;

  const rows: { question: string; member: Answer; payg: Answer; pack: Answer }[] = [
    {
      question: "How much bay time do I get?",
      member: { text: "Up to 1 hour a day.", confirmed: true },
      pack: { text: `${SESSIONS_PER_PACK} sessions of 60 minutes.`, confirmed: true },
      payg: { text: "30, 60, 120, or 180 minutes a booking.", confirmed: true },
    },
    {
      question: "What does it cost per hour at my pace?",
      member: { text: `${money(pace.perHourMembership)} an hour`, confirmed: true },
      pack: { text: `${money(pace.perHourPack)} an hour to cover these hours`, confirmed: true },
      payg: { text: `${money(pace.perHourPayg)} an hour`, confirmed: true },
    },
    {
      question: "Does it expire?",
      member: { text: "Not confirmed", confirmed: false },
      pack: { text: "The ten sessions never expire.", confirmed: true },
      payg: { text: "Not confirmed", confirmed: false },
    },
    {
      question: "Is there a commitment, and can I cancel?",
      member: { text: "par2play.com says you can cancel anytime.", confirmed: true },
      pack: { text: "Not confirmed", confirmed: false },
      payg: { text: "Not confirmed", confirmed: false },
    },
    {
      question: "How do I book a bay?",
      member: { text: "Not confirmed", confirmed: false },
      pack: { text: "Not confirmed", confirmed: false },
      payg: { text: "GolfClock bay rental.", confirmed: true },
    },
    {
      question: "Can I bring a friend or guest?",
      member: { text: "Not confirmed", confirmed: false },
      pack: { text: "Not confirmed", confirmed: false },
      payg: { text: "Not confirmed", confirmed: false },
    },
    {
      question: "Is there member priority or are there perks?",
      member: { text: "First in line for the times that suit you.", confirmed: true },
      pack: { text: "Not confirmed", confirmed: false },
      payg: { text: "Not confirmed", confirmed: false },
    },
  ];

  const live = [
    headline,
    `${pace.hours} ${hourWord} this month.`,
    callout,
    `Pay as you go ${money(pace.payg)}.`,
    `10 Practice Pack ${money(pace.pack)} to cover these hours.`,
    `Practice Unlimited ${money(pace.membership)}.`,
    `Per hour, membership ${money(pace.perHourMembership)}, pack ${money(pace.perHourPack)}, pay as you go ${money(pace.perHourPayg)}.`,
  ].join(" ");

  return (
    <>
      <section id="why-membership" aria-labelledby="why-membership-heading" className="mt-8">
        <div className="grid items-start gap-10 @3xl:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] @3xl:gap-16">
          <div>
            <h1 className="text-base font-semibold uppercase tracking-[0.14em] text-[#10281A]">Membership</h1>
            <h2
              id="why-membership-heading"
              className="mt-3 max-w-xl font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-5xl"
            >
              What ${PRICES.unlimitedMonthly} a month covers
            </h2>
            <ul className="mt-8 grid gap-5">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="flex gap-3">
                  <span className={badge}>
                    <benefit.icon className="size-6" aria-hidden="true" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold leading-tight text-[#0A0F0B]">{benefit.title}</h3>
                    <p className="mt-1 text-base leading-snug text-[#0A0F0B]">{benefit.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-2xl border-2 border-[#0A0F0B] bg-white p-6 shadow-[0_18px_40px_rgb(10_15_11/0.14)] @3xl:p-8">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-[#0A0F0B]">Practice Unlimited</h3>
            <p className="mt-4 font-display text-5xl font-semibold leading-none tracking-tight text-[#0A0F0B]">
              {money(PRICES.unlimitedMonthly)}
              <span className="text-2xl font-semibold">/mo</span>
            </p>
            <MembershipLink className="mt-6 w-full">Become a Member</MembershipLink>
            <p className="mt-3 text-base leading-snug text-[#0A0F0B]">Opens Practice Unlimited on GolfClock.</p>
          </aside>
        </div>
      </section>

      <section id="compare-visits" aria-labelledby="compare-heading" className="mt-16 @3xl:mt-24">
        <h2
          id="compare-heading"
          className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-5xl"
        >
          {headline}
        </h2>
        <div className="mt-8 max-w-3xl">
          <div className="flex items-end justify-between gap-4">
            <label htmlFor={sliderId} className="text-base font-semibold text-[#0A0F0B]">
              Hours this month
            </label>
            <output htmlFor={sliderId} className="font-display text-4xl font-semibold leading-none text-[#0A0F0B] tabular-nums">
              {pace.hours}
            </output>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="aa-focus inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#0A0F0B] bg-white text-2xl font-semibold text-[#0A0F0B]"
              aria-label="Fewer hours"
              onClick={() => setPace(pace.hours - 1)}
            >
              −
            </button>
            <input
              id={sliderId}
              className="pace-slider"
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
              className="aa-focus inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#0A0F0B] bg-white text-2xl font-semibold text-[#0A0F0B]"
              aria-label="More hours"
              onClick={() => setPace(pace.hours + 1)}
            >
              +
            </button>
          </div>
          <p className="mt-2 text-base leading-snug text-[#0A0F0B]">
            One hour is one visit. The slider stops at {COMPARE_HOURS_MAX}. Membership still allows up to an hour a day.
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true" className="mt-8">
          <p className="sr-only">{live}</p>
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
          <p className="relative mt-2 h-6 text-sm font-semibold text-[#0A0F0B]">
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: marker }}>
              {ordinal(pace.breakEvenHour)} hour
            </span>
          </p>
          <p className="text-base leading-snug text-[#0A0F0B]">
            The line is {money(pace.membership)}. The pack price is what it costs to cover these hours, not a monthly fee. A
            30-minute bay is ${HALF_HOUR}.
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-3 @3xl:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.7fr)]">
          <article className="relative overflow-hidden rounded-3xl bg-[#020806] p-6 text-white @3xl:p-8">
            {wins ? (
              <p className="w-fit rounded-full bg-[#14D45E] px-3 py-1 text-sm font-semibold text-[#0A0F0B]">Best value</p>
            ) : (
              <p className="w-fit rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#0A0F0B]">
                From the {ordinal(pace.breakEvenHour)} hour
              </p>
            )}
            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight @5xl:text-4xl">Practice Unlimited</h3>
            <p className="mt-4 font-display text-6xl font-semibold leading-none tracking-tight">
              {money(pace.membership)}
              <span className="text-2xl font-semibold text-white">/mo</span>
            </p>
            <p className="mt-4 max-w-xl text-xl font-semibold leading-snug @5xl:text-2xl">
              {wins ? (
                <>
                  At {pace.hours} {hourWord} you'd pay {money(pace.payg)} pay-as-you-go. Members pay {money(pace.membership)} and save{" "}
                  <span className="text-[#7DFFB0]">{money(pace.saveVsPayg)}</span>.
                </>
              ) : (
                <>
                  At {pace.hours} {hourWord} you'd pay {money(pace.payg)} pay-as-you-go. Members pay {money(pace.membership)}.
                </>
              )}
            </p>
            <MembershipLink className="mt-6 w-full @3xl:w-fit">Become a Member</MembershipLink>
            <p className="mt-3 max-w-md text-base leading-snug text-white">
              The hour count stays on this page. GolfClock opens Practice Unlimited itself.
            </p>
          </article>
          <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-1">
            <article className="flex flex-col rounded-2xl border-2 border-[#4b5563] bg-white p-4">
              <h3 className="text-base font-semibold text-[#0A0F0B]">Pay as you go</h3>
              <p className="mt-1 font-display text-2xl font-semibold text-[#0A0F0B] tabular-nums">{money(pace.payg)}</p>
              <p className="mt-2 text-base leading-snug text-[#0A0F0B]">You're welcome to just come try it.</p>
              <BookLink offer="bay" tone="line" className="mt-auto w-full pt-4">
                Try it out
              </BookLink>
            </article>
            <article className="flex flex-col rounded-2xl border-2 border-[#4b5563] bg-white p-4">
              <h3 className="text-base font-semibold text-[#0A0F0B]">10 Practice Pack</h3>
              <p className="mt-1 font-display text-2xl font-semibold text-[#0A0F0B] tabular-nums">{money(pace.pack)}</p>
              <p className="mt-2 text-base leading-snug text-[#0A0F0B]">
                {pace.packs} {pace.packs === 1 ? "pack" : "packs"} to cover these hours. They do not expire.
              </p>
              <BookLink offer="ten-pack" tone="line" className="mt-auto w-full pt-4">
                Buy the pack
              </BookLink>
            </article>
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          {rows.map((row) => (
            <div
              key={row.question}
              className="grid gap-3 border-t border-[#0A0F0B]/15 pt-4 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,0.85fr)] @3xl:items-start"
            >
              <h3 className="text-base font-semibold leading-snug text-[#0A0F0B]">{row.question}</h3>
              <div>
                <p className="text-sm font-semibold text-[#0A0F0B] @3xl:sr-only">Practice Unlimited</p>
                <AnswerCell answer={row.member} hero={row.member.confirmed} />
              </div>
              <div className="grid grid-cols-2 gap-3 @3xl:contents">
                <div>
                  <p className="text-sm font-semibold text-[#374151]">Pay as you go</p>
                  <AnswerCell answer={row.payg} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#374151]">10 Practice Pack</p>
                  <AnswerCell answer={row.pack} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-base leading-snug text-[#0A0F0B]">
          Estimates; final price confirmed at GolfClock checkout.
        </p>
      </section>
    </>
  );
}
