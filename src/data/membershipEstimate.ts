import { PRICES } from "./business";

/** A month in this estimate is four weeks, so the totals stay easy to check. */
export const WEEKS_PER_MONTH = 4;
export const SESSIONS_PER_PACK = 10;

export const PERIOD_MONTHS = [1, 2, 3, 6] as const;
export const VISITS_PER_WEEK = [1, 2, 3, 4] as const;

export type PeriodMonths = (typeof PERIOD_MONTHS)[number];
export type VisitsPerWeek = (typeof VISITS_PER_WEEK)[number];

export type EstimateColumn = {
  id: "membership" | "payg" | "pack";
  name: string;
  total: number;
  perSession: number;
  detail: string;
};

export type MembershipEstimate = {
  months: PeriodMonths;
  visitsPerWeek: VisitsPerWeek;
  sessions: number;
  membership: EstimateColumn;
  payg: EstimateColumn;
  pack: EstimateColumn;
  /** Positive when membership costs less than the cheaper alternative. */
  saveOverMonths: number;
  cheapestAlternative: "payg" | "pack";
};

function perSession(total: number, sessions: number): number {
  if (sessions <= 0) return 0;
  return total / sessions;
}

export function estimateMembership(months: PeriodMonths, visitsPerWeek: VisitsPerWeek): MembershipEstimate {
  const sessions = visitsPerWeek * WEEKS_PER_MONTH * months;
  const packs = Math.ceil(sessions / SESSIONS_PER_PACK);
  const unused = packs * SESSIONS_PER_PACK - sessions;
  const paygTotal = sessions * PRICES.baySession;
  const packTotal = packs * PRICES.tenPack;
  const memberTotal = months * PRICES.unlimitedMonthly;
  const packDetail =
    unused === 0
      ? `${packs} ${packs === 1 ? "pack" : "packs"} · $${PRICES.tenPack / SESSIONS_PER_PACK} a session`
      : `${packs} ${packs === 1 ? "pack" : "packs"} · ${unused} sessions left over`;

  const payg: EstimateColumn = {
    id: "payg",
    name: "Pay as you go",
    total: paygTotal,
    perSession: perSession(paygTotal, sessions),
    detail: `${sessions} sessions at $${PRICES.baySession}`,
  };
  const pack: EstimateColumn = {
    id: "pack",
    name: "10 Practice Pack",
    total: packTotal,
    perSession: perSession(packTotal, sessions),
    detail: packDetail,
  };
  const membership: EstimateColumn = {
    id: "membership",
    name: "Practice Unlimited",
    total: memberTotal,
    perSession: perSession(memberTotal, sessions),
    detail: "Up to 1 hour a day",
  };
  const cheapestAlternative = payg.total <= pack.total ? "payg" : "pack";
  const cheapestTotal = cheapestAlternative === "payg" ? payg.total : pack.total;

  return {
    months,
    visitsPerWeek,
    sessions,
    membership,
    payg,
    pack,
    saveOverMonths: cheapestTotal - memberTotal,
    cheapestAlternative,
  };
}

export function money(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.abs(rounded - Math.round(rounded)) < 0.001;
  return rounded.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
}

export function monthLabel(months: number): string {
  return months === 1 ? "1 month" : `${months} months`;
}
