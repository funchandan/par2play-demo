import { useEffect, useId, useRef, useState } from "react";
import { VideoSlot } from "./VideoSlot";
import { BookLink, buttonFocus } from "./Cta";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { TESTIMONIAL_FILMS } from "../data/films";
import {
  ANNUAL_PLAN_DISCOUNT,
  JUNIOR_TIER_QUOTE,
  HOURS_PER_WEEK_MAX,
  effectiveMonthlyFee,
  money,
  periodPaceTotal,
  quoteWeek,
  type BillingPeriod,
  type MemberTierId,
  type TierQuote,
} from "../data/membershipEstimate";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const FILM = TESTIMONIAL_FILMS[0];

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
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);

  return value;
}

function periodWord(period: BillingPeriod): string {
  switch (period) {
    case "month":
      return "a month";
    case "year":
      return "a year";
    default: {
      const exhaustive: never = period;
      return exhaustive;
    }
  }
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

function sticker(tier: TierQuote, period: BillingPeriod): { price: string; note: string | null } {
  const monthly = effectiveMonthlyFee(tier, period);
  if (period === "year") {
    const yearly = tier.yearlyFee ?? monthly * 12;
    return { price: `${money(yearly)}/yr`, note: `${money(monthly)}/mo` };
  }
  if (tier.yearlyFee != null) {
    return { price: `${money(tier.monthlyFee)}/mo`, note: `${money(tier.yearlyFee)}/yr, billed yearly` };
  }
  return { price: `${money(monthly)}/mo`, note: null };
}

function TierCard({
  tier,
  period,
  best,
  selected,
  onSelect,
}: {
  tier: TierQuote;
  period: BillingPeriod;
  best: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const label = sticker(tier, period);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`aa-focus rounded-3xl p-5 text-left ${
        best
          ? "order-first col-span-2 border border-[#14D45E]/50 bg-[#020806] text-white shadow-[0_18px_40px_rgb(10_15_11/0.18)] @3xl:order-none @3xl:col-span-1 @3xl:-translate-y-2"
          : "border-2 border-[#4b5563] bg-white text-[#0A0F0B] @3xl:order-none"
      } ${selected && !best ? "ring-2 ring-[#0A0F0B]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{tier.name}</h3>
        {best ? (
          <span className="rounded-full bg-[#14D45E] px-3 py-1 text-sm font-semibold text-[#0A0F0B]">Best for you</span>
        ) : null}
      </div>
      <p className={`mt-2 text-base font-semibold ${best ? "text-[#7DFFB0]" : "text-[#0A0F0B]"}`}>{label.price}</p>
      {label.note ? (
        <p className={`mt-1 text-base leading-snug ${best ? "text-white" : "text-[#0A0F0B]"}`}>{label.note}</p>
      ) : null}
      <p className="mt-3 font-display text-3xl font-semibold leading-none tabular-nums">{money(tier.total)}</p>
      <p className={`mt-1 text-base ${best ? "text-white" : "text-[#0A0F0B]"}`}>
        this {period === "year" ? "year" : "month"} at your pace
      </p>
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
  const [period, setPeriod] = useState<BillingPeriod>("month");
  const reduce = usePrefersReducedMotion();
  const sliderId = useId();
  const pace = quoteWeek(hoursPerWeek);
  const scale = period === "year" ? 12 : 1;
  const tiers = pace.tiers.map((tier) => ({ ...tier, total: periodPaceTotal(tier, pace.hours, period) }));
  const best = tiers.reduce((lowest, tier) => (tier.total < lowest.total ? tier : lowest));
  const normal = pace.normal * scale;
  const save = normal - best.total;
  const shownNormal = useAnimatedAmount(normal, reduce);
  const shownMember = useAnimatedAmount(best.total, reduce);
  const shownSave = useAnimatedAmount(Math.max(0, save), reduce);
  const shownFee = useAnimatedAmount(
    period === "year" ? (best.yearlyFee ?? effectiveMonthlyFee(best, "year") * 12) : effectiveMonthlyFee(best, "month"),
    reduce,
  );
  const weekWord = pace.hoursPerWeek === 1 ? "hour" : "hours";
  const setPace = (next: number) => {
    const quote = quoteWeek(next);
    setHoursPerWeek(quote.hoursPerWeek);
    const nextTiers = quote.tiers.map((tier) => ({ ...tier, total: periodPaceTotal(tier, quote.hours, period) }));
    const nextBest = nextTiers.reduce((lowest, tier) => (tier.total < lowest.total ? tier : lowest));
    setPicked(nextBest.id);
  };
  const paceFill = `${((pace.hoursPerWeek - 1) / (HOURS_PER_WEEK_MAX - 1)) * 100}%`;
  const feeSuffix = period === "year" ? "/yr" : "/mo";
  const feeNote =
    period === "year"
      ? `${money(effectiveMonthlyFee(best, "year"))}/mo`
      : best.yearlyFee != null
        ? `${money(best.yearlyFee)}/yr, billed yearly`
        : null;
  const live = `${best.name} ${money(shownFee)}${feeSuffix}. Booked normally ${money(normal)}. ${best.name} member ${money(best.total)}. ${save > 0 ? `You save ${money(save)} ${periodWord(period)}.` : "Booking normally is less at this pace."}`;

  return (
    <div className="grid gap-16 @3xl:gap-24">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="overflow-hidden rounded-3xl bg-[#020806] @3xl:grid @3xl:grid-cols-2">
        <div className="flex flex-col justify-center bg-[radial-gradient(120%_80%_at_0%_0%,rgb(20_212_94/0.16),transparent_52%)] px-8 py-10 @3xl:px-12 @3xl:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 id="why-membership-heading" className="font-display text-2xl font-semibold tracking-tight text-[#7DFFB0]">
              {best.name}
            </h1>
            <div className="inline-flex rounded-full bg-white/10 p-1" role="group" aria-label="Billing period">
              <button
                type="button"
                className={`aa-focus-ink min-h-11 rounded-full px-4 text-base font-semibold ${period === "month" ? "bg-white text-[#0A0F0B]" : "text-white"}`}
                aria-pressed={period === "month"}
                onClick={() => setPeriod("month")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`aa-focus-ink inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-base font-semibold ${period === "year" ? "bg-[#14D45E] text-[#0A0F0B]" : "text-white"}`}
                aria-pressed={period === "year"}
                onClick={() => setPeriod("year")}
              >
                Annual
                <span
                  className={`rounded-full px-2 py-0.5 text-sm font-semibold ${period === "year" ? "bg-[#0A0F0B] text-[#7DFFB0]" : "bg-[#14D45E] text-[#0A0F0B]"}`}
                >
                  {ANNUAL_PLAN_DISCOUNT == null ? "Best value" : `Save ${Math.round(ANNUAL_PLAN_DISCOUNT * 100)}%`}
                </span>
              </button>
            </div>
          </div>
          <div aria-live="polite" aria-atomic="true" className="mt-4">
            <p className="sr-only">{live}</p>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-6xl font-semibold leading-none tracking-tight text-white @3xl:text-8xl">
                {money(Math.round(shownFee))}
                {feeSuffix}
              </span>
              {feeNote ? <span className="text-xl font-semibold text-white">{feeNote}</span> : null}
            </p>
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
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/25 bg-white/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#E5E7EB]">Booked normally</p>
                <p className="mt-3 font-display text-3xl font-semibold leading-none text-[#E5E7EB] tabular-nums @3xl:text-4xl">{money(Math.round(shownNormal))}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#14D45E] bg-[#0c2416] p-4 shadow-[0_0_36px_rgb(20_212_94/0.22)]">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7DFFB0]">{best.name} member</p>
                <p className="mt-3 font-display text-3xl font-semibold leading-none text-[#7DFFB0] tabular-nums @3xl:text-4xl">{money(Math.round(shownMember))}</p>
              </div>
            </div>
            <p className="mt-3 border-t border-dashed border-white/40 pt-3 text-xl font-semibold text-white">
              {save > 0 ? (
                <>
                  You save <span className="text-[#7DFFB0]">{money(Math.round(shownSave))}</span> {periodWord(period)}
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
          Best for you: {best.name}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 @3xl:grid-cols-3 @3xl:items-start">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              period={period}
              best={tier.id === best.id}
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
