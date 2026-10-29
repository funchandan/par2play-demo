import { useId, useState } from "react";
import { CalendarDays, Clock, SunMedium, Undo2, type LucideIcon } from "lucide-react";
import { BookLink, MembershipLink } from "./Cta";
import { PRICES } from "../data/business";
import {
  PERIOD_MONTHS,
  SESSIONS_PER_PACK,
  VISITS_PER_WEEK,
  WEEKS_PER_MONTH,
  estimateMembership,
  money,
  monthLabel,
  type EstimateColumn,
  type PeriodMonths,
  type VisitsPerWeek,
} from "../data/membershipEstimate";

/** 30-minute bay slots show $35. The hour rate is PRICES.baySession. */
const HALF_HOUR = PRICES.baySession / 2;

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

const pill =
  "flex min-h-11 w-full items-center justify-center rounded-full border-2 border-[#4b5563] bg-white px-2 text-center text-base font-semibold text-[#0A0F0B] peer-checked:border-[#0A0F0B] peer-checked:bg-[#0A0F0B] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0A0F0B]";

const badge = "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#10281A] text-[#14D45E]";

function Choice({
  name,
  value,
  checked,
  label,
  onSelect,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <label className="min-w-0 flex-1">
      <input type="radio" name={name} value={value} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span className={pill}>{label}</span>
    </label>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2 text-base leading-snug text-[#0A0F0B]">
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
      <span>{children}</span>
    </li>
  );
}

function PriceCard({
  column,
  checks,
  message,
  href,
  cta,
  tone,
  raised,
  best,
  summary,
  className = "",
}: {
  column: EstimateColumn;
  checks: readonly string[];
  message?: string;
  href: "membership" | "bay" | "pack";
  cta: string;
  tone: "brand" | "line";
  raised: boolean;
  best: boolean;
  summary?: string;
  className?: string;
}) {
  const link =
    href === "membership" ? (
      <MembershipLink tone={tone} className="mt-6 w-full">
        {cta}
      </MembershipLink>
    ) : (
      <BookLink offer={href === "bay" ? "bay" : "ten-pack"} tone={tone} className="mt-6 w-full">
        {cta}
      </BookLink>
    );

  return (
    <article
      className={`flex h-full flex-col rounded-2xl bg-white p-5 text-left @3xl:p-6 ${
        raised
          ? "relative z-10 border-2 border-[#0A0F0B] shadow-[0_18px_40px_rgb(10_15_11/0.14)] @3xl:-translate-y-3 @3xl:py-8"
          : "border-2 border-[#4b5563]"
      } ${className}`}
    >
      {best ? (
        <p className="w-fit rounded-full bg-[#14D45E] px-3 py-1 text-sm font-semibold text-[#0A0F0B]">Best value</p>
      ) : (
        <p className="invisible hidden py-1 text-sm @3xl:block" aria-hidden="true">
          Best value
        </p>
      )}
      <h3 className="font-display text-2xl font-semibold tracking-tight text-[#0A0F0B]">{column.name}</h3>
      <p className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight text-[#0A0F0B]">
        {money(column.total)}
      </p>
      <p className="mt-2 text-base text-[#0A0F0B]">{money(column.perSession)} a session</p>
      {message ? <p className="mt-3 text-base leading-snug text-[#0A0F0B]">{message}</p> : null}
      <ul className="mt-4 grid gap-2">
        {checks.map((item) => (
          <CheckItem key={item}>{item}</CheckItem>
        ))}
      </ul>
      <div className="mt-auto">{link}</div>
      {summary ? <p className="mt-3 text-base leading-snug text-[#0A0F0B]">{summary}</p> : null}
    </article>
  );
}

export function MembershipCalculator() {
  const [months, setMonths] = useState<PeriodMonths>(1);
  const [visits, setVisits] = useState<VisitsPerWeek>(1);
  const periodName = useId();
  const visitName = useId();
  const estimate = estimateMembership(months, visits);
  const period = monthLabel(months);
  const visitWords = visits === 4 ? "4 or more visits a week" : `${visits} ${visits === 1 ? "visit" : "visits"} a week`;
  const summary = `${period}, ${visitWords}, ${estimate.sessions} hour-long visits. GolfClock opens the product itself.`;
  const best = estimate.saveOverMonths > 0;
  const alternativeName = estimate.cheapestAlternative === "payg" ? estimate.payg.name : estimate.pack.name;
  let honest = "";
  if (!best && estimate.saveOverMonths === 0) {
    honest = `Same total as ${alternativeName} over ${period}.`;
  } else if (!best) {
    honest = `At this pace, ${alternativeName} is ${money(Math.abs(estimate.saveOverMonths))} less over ${period}. Membership costs the same however often you come.`;
  }
  const live = [
    summary,
    `${estimate.membership.name} ${money(estimate.membership.total)}, ${money(estimate.membership.perSession)} a session.`,
    `${estimate.payg.name} ${money(estimate.payg.total)}, ${money(estimate.payg.perSession)} a session.`,
    `${estimate.pack.name} ${money(estimate.pack.total)}, ${money(estimate.pack.perSession)} a session.`,
    best ? `Save ${money(estimate.saveOverMonths)} over ${period}.` : honest,
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
            <p className="mt-3 text-base leading-snug text-[#0A0F0B]">{summary}</p>
          </aside>
        </div>
        <div className="mt-10 grid gap-6 @3xl:max-w-xl">
          <fieldset>
            <legend className="text-base font-semibold text-[#0A0F0B]">How many months</legend>
            <div className="mt-2 flex gap-2">
              {PERIOD_MONTHS.map((option) => (
                <Choice
                  key={option}
                  name={periodName}
                  value={String(option)}
                  checked={months === option}
                  label={option === 1 ? "1 mo" : `${option} mo`}
                  onSelect={() => setMonths(option)}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-base font-semibold text-[#0A0F0B]">How often you play</legend>
            <div className="mt-2 flex gap-2">
              {VISITS_PER_WEEK.map((option) => (
                <Choice
                  key={option}
                  name={visitName}
                  value={String(option)}
                  checked={visits === option}
                  label={option === 4 ? "4+" : String(option)}
                  onSelect={() => setVisits(option)}
                />
              ))}
            </div>
            <p className="mt-2 text-base leading-snug text-[#0A0F0B]">
              Each visit is up to 1 hour. 4+ is counted as 4 visits a week.
            </p>
          </fieldset>
        </div>
      </section>

      <section id="compare-visits" aria-labelledby="compare-heading" className="mt-16 @3xl:mt-24">
        <h2
          id="compare-heading"
          className="text-center font-display text-3xl font-semibold tracking-tight @5xl:text-5xl"
        >
          What these visits cost
        </h2>
        <div aria-live="polite" aria-atomic="true" className="mt-8">
          <p className="sr-only">{live}</p>
          <div className="grid items-stretch gap-4 @3xl:grid-cols-3 @3xl:items-center @3xl:gap-5 @3xl:pt-4">
            <PriceCard
              className="order-2 @3xl:order-1"
              column={estimate.payg}
              message="You're welcome to just come try it."
              checks={[`$${HALF_HOUR} for 30 minutes`, `$${PRICES.baySession} an hour`]}
              href="bay"
              cta="Try it out"
              tone="line"
              raised={false}
              best={false}
            />
            <PriceCard
              className="order-1 @3xl:order-2"
              column={estimate.membership}
              message={best ? `Save ${money(estimate.saveOverMonths)} over ${period}.` : undefined}
              checks={[
                `${estimate.sessions} hour-long visits in this total`,
                `$${PRICES.unlimitedMonthly} a month, however often you come`,
              ]}
              href="membership"
              cta="Become a Member"
              tone="brand"
              raised
              best={best}
              summary={summary}
            />
            <PriceCard
              className="order-3"
              column={estimate.pack}
              message={estimate.pack.detail}
              checks={[`${SESSIONS_PER_PACK} sessions of 60 minutes`, "They do not expire"]}
              href="pack"
              cta="Buy the pack"
              tone="line"
              raised={false}
              best={false}
            />
          </div>
          {honest ? <p className="mt-6 text-center text-base leading-snug text-[#0A0F0B]">{honest}</p> : null}
        </div>
        <p className="mt-6 text-center text-base leading-snug text-[#0A0F0B]">
          A month is {WEEKS_PER_MONTH} weeks. Estimates; final price confirmed at GolfClock checkout.
        </p>
      </section>
    </>
  );
}
