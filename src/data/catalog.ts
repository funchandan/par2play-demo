export type PlanId = "social" | "golfer" | "elite" | "junior";
export type Term = 1 | 3 | 6 | 12;
export type Billing = "monthly" | "annual";
export type Intent = "play" | "learn" | "socialize" | "compete";
export type Experience = "new" | "casual" | "competitive";
export type Place = "outdoor" | "simulator" | "both";
export type Cadence = "occasional" | "weekly" | "live";
export type Party = "1" | "2" | "4";
export type Product = "round" | "simulator" | "coaching";

export type Answers = {
  intent: Intent | null;
  experience: Experience | null;
  place: Place | null;
  cadence: Cadence | null;
  party: Party | null;
};

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  includes: string[];
  popular: boolean;
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "social",
    name: "Social",
    monthly: 99,
    popular: false,
    cta: "Get started",
    includes: ["Access to the clubhouse", "2 rounds a month", "Social events"],
  },
  {
    id: "golfer",
    name: "Golfer",
    monthly: 199,
    popular: true,
    cta: "Join now",
    includes: ["Unlimited course access", "Priority tee times", "Simulator access"],
  },
  {
    id: "elite",
    name: "Elite",
    monthly: 349,
    popular: false,
    cta: "Join Elite",
    includes: ["All Golfer benefits", "Personal locker", "1 coaching hour a week"],
  },
  {
    id: "junior",
    name: "Junior",
    monthly: 49,
    popular: false,
    cta: "Join Junior",
    includes: ["Junior class included", "A bay with an adult", "Simulator access"],
  },
];

export const TERMS: Term[] = [1, 3, 6, 12];

export const CLASSES = [
  {
    id: "swing-lab",
    when: "Sat, Oct 24",
    time: "10:00",
    name: "Swing lab",
    instructor: "Nick Schiavo",
    filled: 6,
    spots: 8,
  },
  {
    id: "junior-hour",
    when: "Sat, Oct 24",
    time: "2:00",
    name: "Junior hour",
    instructor: "Nick Monticello",
    filled: 8,
    spots: 8,
  },
  {
    id: "playing",
    when: "Sun, Oct 25",
    time: "11:00",
    name: "Playing lesson",
    instructor: "Nick Schiavo",
    filled: 3,
    spots: 6,
  },
] as const;

export const RATES = {
  guestRound: 85,
  memberGuestRound: 45,
  simulatorHour: 60,
  coachingHour: 120,
  socialCredit: 30,
  playPack: 180,
  playPackHours: 4,
  playPackRack: 240,
  lessonSeries: 400,
  lessonSeriesHours: 4,
  lessonSeriesRack: 480,
};

export const SATURDAY = "Saturday, October 24";

export const SLOTS = [
  { id: "0800", time: "8:00", note: "First tee" },
  { id: "1000", time: "10:00", note: "Mid morning" },
  { id: "1400", time: "2:00", note: "Afternoon" },
] as const;

export const CANCEL_RULE =
  "Cancel free until 24 hours before the start. Inside 24 hours a member inclusion is spent, or the guest fee is kept.";

export const MEMBER_CANCEL = "Membership cancels anytime. The paid month stays.";

const media = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const IMAGES = {
  hero: media("photos/course.jpg"),
  fairway: media("photos/course.jpg"),
  green: media("photos/bay.jpg"),
  swing: media("photos/lesson-live.jpg"),
  clubhouse: media("photos/group.jpg"),
  outdoor: media("photos/events.jpg"),
  simulator: media("photos/lesson.jpg"),
  gallery: [media("photos/bay-live.jpg"), media("photos/group.jpg"), media("photos/course.jpg")],
};

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function planById(id: PlanId): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[1];
}

export function annualPrice(plan: Plan): number {
  return plan.monthly * 10;
}

export function annualRack(plan: Plan): number {
  return plan.monthly * 12;
}

export function isTerm(value: number): value is Term {
  return value === 1 || value === 3 || value === 6 || value === 12;
}

export function termPrice(plan: Plan, term: Term): number {
  return term === 12 ? annualPrice(plan) : plan.monthly * term;
}

export function membershipCharge(plan: Plan, term: Term, foursome: boolean): {
  amount: number;
  against?: number;
} {
  const unit = termPrice(plan, term);
  if (foursome && plan.id !== "junior") {
    return { amount: unit * 3, against: unit * 4 };
  }
  if (term === 12) return { amount: unit, against: annualRack(plan) };
  return { amount: unit };
}

export function membershipLabel(plan: Plan, term: Term, foursome: boolean): string {
  const span = term === 1 ? "month" : term === 12 ? "year" : `${term} months`;
  const group = foursome && plan.id !== "junior" ? " · foursome" : "";
  return `${plan.name} · ${span}${group}`;
}

export function recommendedPlan(answers: Answers): PlanId {
  if (answers.intent === "compete" || answers.intent === "learn" || answers.cadence === "live") {
    return "elite";
  }
  if (answers.cadence === "weekly" || answers.place === "both" || answers.place === "simulator") {
    return "golfer";
  }
  return "social";
}

export function defaultProduct(answers: Answers, plan: PlanId | null): Product {
  if (answers.intent === "learn" && plan !== "elite") return "coaching";
  if (answers.place === "outdoor") return "round";
  return "simulator";
}

export function partyCount(answers: Answers): number {
  if (answers.party) return Number(answers.party);
  if (answers.intent === "socialize") return 2;
  return 1;
}

export type Line = {
  label: string;
  amount: number;
  against?: number;
};

export type QuoteInput = {
  buyingMembership: boolean;
  term: Term;
  foursome: boolean;
  plan: PlanId | null;
  product: Product | null;
  acceptPack: boolean;
  answers: Answers;
  includeVisit: boolean;
};

export function quote(input: QuoteInput): { lines: Line[]; total: number } {
  const lines: Line[] = [];
  if (input.buyingMembership && input.plan) {
    const plan = planById(input.plan);
    const charge = membershipCharge(plan, input.term, input.foursome);
    lines.push({
      label: membershipLabel(plan, input.term, input.foursome),
      amount: charge.amount,
      against: charge.against,
    });
  }
  if (input.includeVisit && input.product) {
    lines.push(visitLine(input));
  }
  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.amount, 0),
  };
}

function visitLine(input: QuoteInput): Line {
  const plan = input.buyingMembership && input.plan ? input.plan : null;
  const party = partyCount(input.answers);
  const guests = Math.max(0, party - 1);

  if (input.product === "simulator") {
    if (!plan && input.acceptPack) {
      return {
        label: "Play pack · 4 simulator hours",
        amount: RATES.playPack,
        against: RATES.playPackRack,
      };
    }
    if (plan === "golfer" || plan === "elite") {
      return {
        label: "First simulator hour · included",
        amount: 0,
        against: RATES.simulatorHour,
      };
    }
    if (plan === "social") {
      return {
        label: "Simulator hour · $30 credit",
        amount: RATES.simulatorHour - RATES.socialCredit,
        against: RATES.simulatorHour,
      };
    }
    return { label: "Simulator hour", amount: RATES.simulatorHour };
  }

  if (input.product === "coaching") {
    if (plan === "elite") {
      return {
        label: "Coaching hour · included this week",
        amount: 0,
        against: RATES.coachingHour,
      };
    }
    if (input.acceptPack && input.answers.intent === "learn") {
      return {
        label: "Lesson series · 4 hours",
        amount: RATES.lessonSeries,
        against: RATES.lessonSeriesRack,
      };
    }
    return { label: "Coaching hour", amount: RATES.coachingHour };
  }

  if (plan) {
    return {
      label:
        guests > 0
          ? `Round · yours included, ${guests} guest${guests > 1 ? "s" : ""} at $45`
          : "Round · included",
      amount: guests * RATES.memberGuestRound,
      against: guests > 0 ? guests * RATES.guestRound : undefined,
    };
  }

  return {
    label: party === 1 ? "Guest round" : `Guest rounds · ${party}`,
    amount: party * RATES.guestRound,
  };
}

export function slotById(id: string | null) {
  return SLOTS.find((slot) => slot.id === id) ?? SLOTS[1];
}

export function productLabel(product: Product): string {
  if (product === "simulator") return "Simulator hour";
  if (product === "coaching") return "Coaching hour";
  return "Round";
}

export function recommendReason(answers: Answers, plan: PlanId, hint: PlanId | null): string {
  let reason: string;
  if (plan === "junior") {
    reason = "Junior is $49 a month. The junior class is included, and a foursome does not apply.";
  } else if (plan === "elite") {
    if (answers.intent === "compete") {
      reason = "Compete maps to Elite. Tournament prep, and a coaching hour every week.";
    } else if (answers.intent === "learn") {
      reason = "Coaching maps to Elite. A coaching hour is included every week.";
    } else {
      reason = "Living here maps to Elite. Locker, course, simulator, and a coaching hour every week.";
    }
  } else if (plan === "golfer") {
    if (answers.place === "simulator") {
      reason = "Simulator play maps to Golfer. The first hour is included.";
    } else if (answers.place === "both") {
      reason = "Course and simulator map to Golfer.";
    } else {
      reason = "Weekly play maps to Golfer. Unlimited course, and priority tee times.";
    }
  } else {
    reason = "Occasional play maps to Social. Two rounds a month, the clubhouse, and a $30 simulator credit.";
  }
  if (hint && hint !== plan) {
    reason += ` You looked at ${planById(hint).name}. The answers match ${planById(plan).name}.`;
  }
  return reason;
}
