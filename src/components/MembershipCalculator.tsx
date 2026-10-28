import { useId, useState } from "react";
import { buttonFocus } from "./Cta";
import { OCLOCK, PRICES } from "../data/business";
import {
  PERIOD_MONTHS,
  VISITS_PER_WEEK,
  WEEKS_PER_MONTH,
  estimateMembership,
  money,
  monthLabel,
  type PeriodMonths,
  type VisitsPerWeek,
} from "../data/membershipEstimate";

const pill =
  "flex min-h-11 w-full items-center justify-center rounded-full border-2 border-[#4b5563] bg-white px-2 text-center text-base font-semibold text-[#0A0F0B] peer-checked:border-[#0A0F0B] peer-checked:bg-[#0A0F0B] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0A0F0B]";

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

function Column({
  name,
  total,
  perSession,
  detail,
  href,
  cta,
  summary,
  featured,
  callout,
}: {
  name: string;
  total: number;
  perSession: number;
  detail: string;
  href: string;
  cta: string;
  summary?: string;
  featured: boolean;
  callout?: { amount: string; period: string };
}) {
  return (
    <article
      className={`flex flex-col border-2 p-5 ${featured ? "border-[#0A0F0B] bg-[#e7f8ee]" : "border-[#4b5563] bg-white"}`}
    >
      {featured ? <p className="text-base font-semibold text-[#0A0F0B]">Best value</p> : null}
      <h3 className="mt-1 font-display text-2xl font-semibold text-[#0A0F0B]">{name}</h3>
      {callout ? (
        <p className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight text-[#0A0F0B]">
          Save {callout.amount}
          <span className="mt-2 block text-xl">over {callout.period}</span>
        </p>
      ) : null}
      <p className="mt-3 text-base text-[#0A0F0B]">
        <span className="font-semibold">{money(total)}</span> over this period
      </p>
      <p className="text-base text-[#0A0F0B]">{money(perSession)} a session</p>
      <p className="mt-2 text-base leading-relaxed text-[#0A0F0B]">{detail}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-center text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852] visited:text-[#0A0F0B] ${buttonFocus} ${featured ? "bg-[#14D45E] visited:bg-[#14D45E]" : "border-2 border-[#0A0F0B] bg-white visited:bg-white"}`}
      >
        {cta}
      </a>
      {summary ? <p className="mt-3 text-base leading-relaxed text-[#0A0F0B]">{summary}</p> : null}
    </article>
  );
}

export function MembershipCalculator() {
  const [months, setMonths] = useState<PeriodMonths>(1);
  const [visits, setVisits] = useState<VisitsPerWeek>(1);
  const periodName = useId();
  const visitName = useId();
  const estimate = estimateMembership(months, visits);
  const alternativeName = estimate.cheapestAlternative === "payg" ? estimate.payg.name : estimate.pack.name;
  const period = monthLabel(months);
  const visitWords = visits === 4 ? "4 or more visits a week" : `${visits} ${visits === 1 ? "visit" : "visits"} a week`;
  const summary = `${period}, ${visitWords}, ${estimate.sessions} hour-long visits.`;
  let callout = "";
  let honest = "";
  if (estimate.saveOverMonths > 0) {
    callout = `Save ${money(estimate.saveOverMonths)} over ${period}`;
  } else if (estimate.saveOverMonths === 0) {
    honest = `Same total as ${alternativeName} over ${period}.`;
  } else {
    honest = `At this pace, ${alternativeName} is ${money(Math.abs(estimate.saveOverMonths))} less over ${period}. Membership costs the same however often you come.`;
  }
  const live = [
    summary,
    `${estimate.payg.name} ${money(estimate.payg.total)}, ${money(estimate.payg.perSession)} a session.`,
    `${estimate.pack.name} ${money(estimate.pack.total)}, ${money(estimate.pack.perSession)} a session.`,
    `${estimate.membership.name} ${money(estimate.membership.total)}, ${money(estimate.membership.perSession)} a session.`,
    callout || honest,
  ].join(" ");

  return (
    <section id="membership-calculator" aria-labelledby="calculator-heading" className="mt-10">
      <h2 id="calculator-heading" className="font-display text-3xl font-semibold tracking-tight">
        What a run of visits costs
      </h2>
      <div className="mt-6 grid gap-6">
        <fieldset>
          <legend className="text-base font-semibold">How many months</legend>
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
          <legend className="text-base font-semibold">How often you play</legend>
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
          <p className="mt-2 text-base leading-relaxed">Each visit is up to 1 hour. 4+ is counted as 4 visits a week.</p>
        </fieldset>
      </div>
      <div aria-live="polite" aria-atomic="true" className="mt-8 grid gap-4 @3xl:grid-cols-3">
        <p className="sr-only">{live}</p>
        <Column
          name={estimate.membership.name}
          total={estimate.membership.total}
          perSession={estimate.membership.perSession}
          detail={estimate.membership.detail}
          href={OCLOCK.practiceUnlimited}
          cta="Book a membership"
          summary={summary}
          featured={estimate.saveOverMonths > 0}
          callout={
            estimate.saveOverMonths > 0
              ? { amount: money(estimate.saveOverMonths), period }
              : undefined
          }
        />
        <Column
          name={estimate.payg.name}
          total={estimate.payg.total}
          perSession={estimate.payg.perSession}
          detail={estimate.payg.detail}
          href={OCLOCK.bayRental}
          cta="Book a bay"
          featured={false}
        />
        <Column
          name={estimate.pack.name}
          total={estimate.pack.total}
          perSession={estimate.pack.perSession}
          detail={estimate.pack.detail}
          href={OCLOCK.tenPracticePack}
          cta="Buy the pack"
          featured={false}
        />
        {honest ? <p className="text-base leading-relaxed text-[#0A0F0B] @3xl:col-span-3">{honest}</p> : null}
      </div>
      <p className="mt-4 text-base leading-relaxed text-[#0A0F0B]">
        A month is {WEEKS_PER_MONTH} weeks. Bay time is ${PRICES.baySession} an hour on the GolfClock bay rental flow.
        Estimates; final price confirmed at GolfClock checkout.
      </p>
    </section>
  );
}
