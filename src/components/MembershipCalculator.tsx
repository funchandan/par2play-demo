import { useId, useState } from "react";
import { VideoSlot } from "./VideoSlot";
import { BookLink, buttonFocus } from "./Cta";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { TESTIMONIAL_FILMS } from "../data/films";
import {
  JUNIOR_TIER_QUOTE,
  WEEKS_PER_MONTH,
  HOURS_PER_WEEK_MAX,
  money,
  quoteWeek,
  type MemberTierId,
  type TierQuote,
} from "../data/membershipEstimate";
const FILM = TESTIMONIAL_FILMS[0];

function paceLine(tier: TierQuote, monthHours: number): string {
  const extra = Math.max(0, monthHours - tier.includedHours);
  const fee = money(tier.monthlyFee);
  if (extra === 0) return fee;
  const hourWord = extra === 1 ? "hour" : "hours";
  return `${fee} + ${extra} ${hourWord} at ${Math.round(tier.bayDiscount * 100)}% off`;
}

function MemberLink({ children, className = "" }: { children: string; className?: string }) {
  return (
    <a
      href={OCLOCK.liveMembership}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-[#14D45E] px-5 text-center text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852] ${buttonFocus} ${className}`}
    >
      {children}
    </a>
  );
}

function TierCard({
  tier,
  best,
  selected,
  onSelect,
}: {
  tier: TierQuote;
  best: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`aa-focus rounded-2xl p-4 text-left ${
        best
          ? "order-first col-span-2 bg-[#020806] text-white shadow-[0_18px_40px_rgb(10_15_11/0.18)] @3xl:order-none @3xl:col-span-1 @3xl:-translate-y-2"
          : "border-2 border-[#4b5563] bg-white text-[#0A0F0B] @3xl:order-none"
      } ${selected && !best ? "ring-2 ring-[#0A0F0B]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{tier.name}</h3>
        {best ? (
          <span className="rounded-full bg-[#14D45E] px-3 py-1 text-sm font-semibold text-[#0A0F0B]">Best for you</span>
        ) : null}
      </div>
      <p className={`mt-2 text-base font-semibold ${best ? "text-[#7DFFB0]" : "text-[#0A0F0B]"}`}>{tier.priceLabel}</p>
      {tier.yearlyFee != null ? (
        <p className={`mt-1 text-base leading-snug ${best ? "text-white" : "text-[#0A0F0B]"}`}>
          Yearly commitment. Counted as {money(tier.monthlyFee)}/month here.
        </p>
      ) : null}
      <p className="mt-3 font-display text-3xl font-semibold leading-none tabular-nums">{money(tier.total)}</p>
      <p className={`mt-1 text-base ${best ? "text-white" : "text-[#0A0F0B]"}`}>this month at your pace</p>
      {best ? (
        <ul className="mt-4 grid gap-1 text-base leading-snug text-white">
          {tier.perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-base leading-snug text-[#0A0F0B]">{tier.perks[0]}</p>
      )}
    </button>
  );
}

export function MembershipCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(2);
  const [picked, setPicked] = useState<MemberTierId>("gold");
  const sliderId = useId();
  const pace = quoteWeek(hoursPerWeek);
  const save = pace.normal - pace.best.total;
  const weekWord = pace.hoursPerWeek === 1 ? "hour" : "hours";
  const includeLine = `${pace.best.includedHours} bay hours + ${Math.round(pace.best.bayDiscount * 100)}% off extra hours`;
  const setPace = (next: number) => {
    const quote = quoteWeek(next);
    setHoursPerWeek(quote.hoursPerWeek);
    setPicked(quote.best.id);
  };
  const paceFill = `${((pace.hoursPerWeek - 1) / (HOURS_PER_WEEK_MAX - 1)) * 100}%`;
  const live = `${pace.best.name} ${pace.best.priceLabel}. ${includeLine}. ${money(pace.normal)} booked normally. You save ${money(save)} a month.`;

  return (
    <div className="grid gap-16 @3xl:gap-24">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="overflow-hidden rounded-3xl bg-[#020806] @3xl:grid @3xl:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-8 @3xl:px-10 @3xl:py-12">
          <h1 id="why-membership-heading" className="font-display text-2xl font-semibold tracking-tight text-[#7DFFB0]">
            {pace.best.name}
          </h1>
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            <p className="sr-only">{live}</p>
            {pace.best.yearlyFee != null ? (
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-6xl font-semibold leading-none tracking-tight text-white @5xl:text-7xl">
                  {money(pace.best.yearlyFee)}/yr
                </span>
                <span className="text-xl font-semibold text-white">{money(pace.best.monthlyFee)}/mo</span>
              </p>
            ) : (
              <p className="font-display text-7xl font-semibold leading-none tracking-tight text-white @5xl:text-8xl">
                {money(pace.best.monthlyFee)}/mo
              </p>
            )}
            <p className="mt-3 text-base font-semibold leading-snug text-white">{includeLine}</p>
          </div>
          <div className="mt-6">
            <label htmlFor={sliderId} className="flex items-baseline gap-3 text-base font-semibold text-white">
              Hours you play per week:
              <output htmlFor={sliderId} className="font-display text-5xl font-semibold leading-none text-[#7DFFB0] tabular-nums">
                {pace.hoursPerWeek}
              </output>
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="Fewer hours"
                onClick={() => setPace(pace.hoursPerWeek - 1)}
              >
                −
              </button>
              <input
                id={sliderId}
                className="pace-slider pace-slider-on-dark min-w-0 flex-1"
                type="range"
                min={1}
                max={HOURS_PER_WEEK_MAX}
                step={1}
                value={pace.hoursPerWeek}
                style={{ ["--pace" as string]: paceFill }}
                aria-valuetext={`${pace.hoursPerWeek} ${weekWord} per week`}
                onChange={(event) => setPace(Number(event.target.value))}
              />
              <button
                type="button"
                className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
                aria-label="More hours"
                onClick={() => setPace(pace.hoursPerWeek + 1)}
              >
                +
              </button>
            </div>
            <p className="mt-2 text-sm leading-snug text-white">A month is {WEEKS_PER_MONTH} weeks. Rollover is not in these totals.</p>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/35 p-3">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#E5E7EB]">Booked normally</p>
                <p className="mt-2 text-base leading-snug text-[#E5E7EB]">
                  {pace.hours} × {money(PRICES.baySession)}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold leading-none text-[#E5E7EB]">{money(pace.normal)}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#14D45E] bg-[#10281A] p-3">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7DFFB0]">{pace.best.name} member</p>
                <p className="mt-2 text-base leading-snug text-white">{paceLine(pace.best, pace.hours)}</p>
                <p className="mt-2 font-display text-3xl font-semibold leading-none text-[#7DFFB0]">{money(pace.best.total)}</p>
              </div>
            </div>
            <p className="mt-3 border-t border-dashed border-white/40 pt-3 text-xl font-semibold text-white">
              {save > 0 ? (
                <>
                  You save <span className="text-[#7DFFB0]">{money(save)}</span> a month
                </>
              ) : (
                "Booking normally is less at this pace."
              )}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <MemberLink>Become a Member</MemberLink>
            <BookLink offer="bay" tone="inverted">
              Try it out
            </BookLink>
          </div>
        </div>
        <VideoSlot src={FILM.src} srcMobile={FILM.srcMobile} poster={FILM.poster} className="min-h-56 @3xl:min-h-full" pausable />
      </section>

      <section aria-labelledby="tiers-heading">
        <h2 id="tiers-heading" className="font-display text-3xl font-semibold tracking-tight @5xl:text-4xl">
          Best for you: {pace.best.name}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 @3xl:grid-cols-3 @3xl:items-start">
          {pace.tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              best={tier.id === pace.best.id}
              selected={tier.id === picked}
              onSelect={() => setPicked(tier.id)}
            />
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-snug text-[#374151]">{JUNIOR_TIER_QUOTE}</p>
        <p className="mt-3 text-sm leading-snug text-[#374151]">
          A 30-minute bay is ${PRICES.baySession / 2}. Swing evaluation, club fitting, the event, and the lesson pack are included as listed. Estimates for bay hours only.
        </p>
      </section>

      <section className="rounded-3xl bg-[#020806] px-6 py-12 text-center text-white @3xl:px-12" aria-labelledby="join-heading">
        <h2 id="join-heading" className="font-display text-4xl font-semibold tracking-tight">
          See the memberships
        </h2>
        <div className="mt-6 flex justify-center">
          <MemberLink>Become a Member</MemberLink>
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
      </section>
    </div>
  );
}
