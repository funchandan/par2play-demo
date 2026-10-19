import {
  type Answers,
  type Billing,
  type PlanId,
  type Term,
  type Product,
  CANCEL_RULE,
  SATURDAY,
  membershipCharge,
  membershipLabel,
  money,
  partyCount,
  planById,
  productLabel,
  recommendedPlan,
  slotById,
  annualPrice,
  annualRack,
  defaultProduct,
} from "./catalog";

export type Step =
  | "landing"
  | "intent"
  | "experience"
  | "place"
  | "cadence"
  | "recommend"
  | "register"
  | "plan"
  | "book"
  | "visit-place"
  | "visit-party"
  | "visit-time"
  | "guest-choice"
  | "pay"
  | "confirm"
  | "clubhouse"
  | "journey";

export type FunnelStage =
  | "Arrive"
  | "Qualify"
  | "Recommend"
  | "Commit"
  | "Book"
  | "Pay"
  | "Confirm"
  | "Return";

export type OfferId =
  | "first-swing"
  | "social-credit"
  | "annual"
  | "play-pack"
  | "lesson-series"
  | "guest-round";

export type OfferState = {
  step: Step;
  buyingMembership: boolean;
  billing: Billing;
  term: Term;
  foursome: boolean;
  plan: PlanId | null;
  product: Product | null;
  acceptPack: boolean;
  answers: Answers;
  profileFirst: string;
  slotId: string | null;
};

const OFFER_NAMES: Record<OfferId, string> = {
  "first-swing": "First swing",
  "social-credit": "Simulator credit",
  annual: "Annual",
  "play-pack": "Play pack",
  "lesson-series": "Lesson series",
  "guest-round": "Guest round",
};

export function offerName(id: OfferId): string {
  return OFFER_NAMES[id];
}

export function offerDetail(id: OfferId, plan: PlanId | null): string {
  const chosen = planById(plan ?? "golfer");
  switch (id) {
    case "first-swing":
      return "The first simulator hour is included with Golfer or Elite in this session.";
    case "social-credit":
      return "Social includes $30 off the first simulator hour. The hour is $30 against $60.";
    case "annual":
      return `Two months included. ${chosen.name} is ${money(annualPrice(chosen))} for the year, against ${money(annualRack(chosen))}.`;
    case "play-pack":
      return "Four simulator hours for $180. That is $45 an hour against $60.";
    case "lesson-series":
      return "Four coaching hours for $400, against $480.";
    case "guest-round":
      return "Each guest is $45, against the $85 guest round.";
  }
}

export function resolveOffer(state: OfferState): {
  visible: OfferId | null;
  suppressed: OfferId | null;
} {
  const plan = state.plan ?? recommendedPlan(state.answers);
  const buying = state.buyingMembership;
  const product = state.product ?? defaultProduct(state.answers, buying ? plan : null);
  const party = partyCount(state.answers);
  const learn = state.answers.intent === "learn";
  const none = { visible: null, suppressed: null };

  if (state.step === "recommend" || state.step === "register") {
    return plan === "social"
      ? { visible: "social-credit", suppressed: "annual" }
      : { visible: "first-swing", suppressed: "annual" };
  }

  if (state.step === "plan") {
    if (state.term === 12) {
      return {
        visible: null,
        suppressed: plan === "social" ? "social-credit" : "first-swing",
      };
    }
    return {
      visible: "annual",
      suppressed: plan === "social" ? "social-credit" : "first-swing",
    };
  }

  const visitOffer = () => {
    if (product === "coaching" && plan === "elite" && buying) {
      return { visible: null, suppressed: "lesson-series" as OfferId };
    }
    if (product === "coaching" && learn && plan !== "elite") {
      return { visible: "lesson-series" as OfferId, suppressed: buying ? ("first-swing" as const) : null };
    }
    if (product === "simulator" && buying && (plan === "golfer" || plan === "elite")) {
      return { visible: "first-swing" as const, suppressed: "play-pack" as const };
    }
    if (product === "simulator" && buying && plan === "social") {
      return { visible: "social-credit" as const, suppressed: "play-pack" as const };
    }
    if (product === "simulator" && !buying) {
      return { visible: "play-pack" as const, suppressed: "first-swing" as const };
    }
    if (product === "round" && party > 1 && buying) {
      return { visible: "guest-round" as const, suppressed: "annual" as const };
    }
    if (product === "round" && party > 1 && !buying) {
      return { visible: null, suppressed: "guest-round" as const };
    }
    if (product === "round" && plan === "social" && buying) {
      return { visible: null, suppressed: "social-credit" as const };
    }
    if (!buying && product === "round") {
      return { visible: null, suppressed: "annual" as const };
    }
    if (buying && state.billing === "monthly") {
      return { visible: null, suppressed: "annual" as const };
    }
    return none;
  };

  if (state.step === "book" || state.step === "pay") return visitOffer();

  if (state.step === "visit-time") {
    if (product === "simulator") return { visible: "play-pack", suppressed: "first-swing" };
    if (party > 1) return { visible: "guest-round", suppressed: "annual" };
    return { visible: "annual", suppressed: null };
  }

  if (state.step === "guest-choice") {
    if (product === "simulator") return { visible: "first-swing", suppressed: "play-pack" };
    if (party > 1) return { visible: "guest-round", suppressed: "annual" };
    return { visible: "annual", suppressed: "guest-round" };
  }

  return none;
}

export function stageFor(step: Step): FunnelStage {
  switch (step) {
    case "landing":
    case "clubhouse":
    case "journey":
      return "Arrive";
    case "intent":
    case "experience":
    case "place":
    case "cadence":
    case "visit-place":
    case "visit-party":
      return "Qualify";
    case "recommend":
    case "guest-choice":
      return "Recommend";
    case "register":
    case "plan":
      return "Commit";
    case "book":
    case "visit-time":
      return "Book";
    case "pay":
      return "Pay";
    case "confirm":
      return "Confirm";
  }
}

export function objectiveFor(step: Step): string {
  switch (step) {
    case "landing":
      return "Two doors. Membership, or a single visit.";
    case "clubhouse":
      return "A Tuesday league. Free to join. The bay is still paid.";
    case "intent":
      return "Learn the reason before a price.";
    case "experience":
      return "Hear how much golf is already there.";
    case "place":
      return "Course, simulator, or both. This picks the first visit.";
    case "cadence":
      return "How often decides Social, Golfer, or Elite.";
    case "recommend":
      return "Name one plan. Hold the annual price for the next commit.";
    case "register":
      return "Save the person. The card waits.";
    case "plan":
      return "Annual is the offer. The hour credit waits for the visit.";
    case "book":
      return "One visit, one offer, the 24-hour rule beside the total.";
    case "visit-place":
      return "A guest can book before a membership exists.";
    case "visit-party":
      return "Party size sets the guest total, and whether a guest rate can apply later.";
    case "visit-time":
      return "A Saturday time. The join offer is the next screen.";
    case "guest-choice":
      return "Pay the guest total, or join and reprice this visit.";
    case "pay":
      return "Name, mobile, and card. Nothing is charged.";
    case "confirm":
      return "The receipt, then the three notes that would follow. Nothing sends.";
    case "journey":
      return "Every stage, message, and offer in one map.";
  }
}

export function titleFor(step: Step): string {
  switch (step) {
    case "landing":
      return "Home";
    case "clubhouse":
      return "Par2Play Clubhouse";
    case "intent":
      return "What they want";
    case "experience":
      return "Experience";
    case "place":
      return "Where they play";
    case "cadence":
      return "How often";
    case "recommend":
      return "The plan";
    case "register":
      return "Registration";
    case "plan":
      return "Plan and billing";
    case "book":
      return "First visit";
    case "visit-place":
      return "Book a visit";
    case "visit-party":
      return "Who is coming";
    case "visit-time":
      return "Saturday time";
    case "guest-choice":
      return "Guest or member";
    case "pay":
      return "Pay";
    case "confirm":
      return "Confirmation";
    case "journey":
      return "Journey map";
  }
}

export function screenLine(state: OfferState): string {
  const name = state.profileFirst || "there";
  const plan = planById(state.plan ?? recommendedPlan(state.answers));
  const slot = slotById(state.slotId);
  switch (state.step) {
    case "landing":
      return "Five Full Swing bays at 695 Hamilton Street. Lessons with Nick Schiavo and Nick Monticello, PGA.";
    case "clubhouse":
      return "Every other Tuesday. One hole on the screen. Points when someone you bring comes back.";
    case "intent":
      return "What do you want from the club?";
    case "experience":
      return "How much golf is already in your hands?";
    case "place":
    case "visit-place":
      return "Where will you play?";
    case "cadence":
      return "How often will you be here?";
    case "recommend":
      return `${plan.name} is the plan. The first visit stays attached.`;
    case "register":
      return "Save this plan. The card is the next screens, and the hour stays attached.";
    case "plan": {
      const chosen = planById(plan.id);
      const charge = membershipCharge(chosen, state.term, state.foursome);
      return `${membershipLabel(chosen, state.term, state.foursome)} is ${money(charge.amount)}${charge.against ? ` against ${money(charge.against)}` : ""}.`;
    }
    case "book":
      return `${SATURDAY}. The time you pick is held on this screen only.`;
    case "visit-party":
      return "How many people is this visit?";
    case "visit-time":
      return `${SATURDAY}. Pick a time, then decide guest or member.`;
    case "guest-choice":
      return "Pay as a guest, or join and this visit reprices.";
    case "pay":
      return `${CANCEL_RULE} ${"Membership cancels anytime. The paid month stays."}`;
    case "confirm":
      return `You're booked at Par2Play, ${name}. ${SATURDAY} at ${slot.time}.`;
    case "journey":
      return "The map is the strategy. The rail is the step you are on.";
  }
}

export type LaterNote = {
  id: string;
  title: string;
  email: string;
  sms: string;
};

export function laterNotes(state: OfferState): LaterNote[] {
  const plan = state.plan ? planById(state.plan) : null;
  const product = state.product ?? "round";
  const slot = slotById(state.slotId);
  const party = partyCount(state.answers);
  const visit = `${productLabel(product).toLowerCase()}`;

  const morning = morningAfter(state, plan?.name ?? null, product, party);
  const credit = unusedCredit(state, plan?.name ?? null, product);

  return [
    {
      id: "day-before",
      title: "The day before",
      email: `Tomorrow at Par2Play: ${slot.time}, ${visit}, ${party} ${party === 1 ? "person" : "people"}. ${CANCEL_RULE} No offer in this note.`,
      sms: `Par2Play tomorrow ${slot.time}. ${productLabel(product)}. Cancel free until 24 hours before.`,
    },
    {
      id: "morning-after",
      title: "The morning after",
      email: morning.email,
      sms: morning.sms,
    },
    {
      id: "unused-credit",
      title: "Unused credit",
      email: credit.email,
      sms: credit.sms,
    },
  ];
}

function morningAfter(
  state: OfferState,
  planName: string | null,
  product: Product,
  party: number,
): { email: string; sms: string } {
  if (state.acceptPack && product === "simulator" && !state.buyingMembership) {
    return {
      email: "Yesterday at Par2Play. You used 1 of 4 simulator hours. Three are still on the play pack.",
      sms: "Par2Play: 3 simulator hours left on the play pack.",
    };
  }
  if (!state.buyingMembership && product === "simulator") {
    return {
      email: "Yesterday at Par2Play. The simulator hour is $60. Four hours are $180, which is $45 an hour.",
      sms: "Par2Play: four simulator hours are $180, $45 an hour against $60.",
    };
  }
  if (state.buyingMembership && planName) {
    return {
      email: `Yesterday at Par2Play. ${planName} is ready for the next visit. No second offer today.`,
      sms: `Par2Play: ${planName} is ready when you book the next visit.`,
    };
  }
  return {
    email: `Yesterday at Par2Play. A round for ${party} is ${money(85 * party)}. Golfer is $199 a month if this becomes a habit.`,
    sms: "Par2Play: Golfer is $199 a month when you want the course without the guest rate.",
  };
}

function unusedCredit(
  state: OfferState,
  planName: string | null,
  product: Product,
): { email: string; sms: string } {
  if (state.acceptPack && product === "simulator" && !state.buyingMembership) {
    return {
      email: "You have 3 simulator hours left on the play pack. They come off the next simulator booking.",
      sms: "Par2Play: 3 hours left on the play pack.",
    };
  }
  if (state.acceptPack && product === "coaching") {
    return {
      email: "You have 3 coaching hours left on the lesson series. They come off the next lesson.",
      sms: "Par2Play: 3 coaching hours left.",
    };
  }
  if (planName === "Social" && product !== "simulator") {
    return {
      email: "The $30 simulator credit is still on your profile. The next simulator hour is $30 against $60.",
      sms: "Par2Play: $30 simulator credit is still on your profile.",
    };
  }
  if (planName === "Social" && product === "simulator") {
    return {
      email: "The $30 credit was used on this hour. 2 rounds are still included this month.",
      sms: "Par2Play: 2 rounds still included this month.",
    };
  }
  if (planName === "Elite") {
    return {
      email: "A coaching hour is included every week on Elite. It does not roll into a pack.",
      sms: "Par2Play: your Elite coaching hour resets each week.",
    };
  }
  if (planName === "Golfer") {
    return {
      email: "Simulator access stays on Golfer. The first hour in this session is already included.",
      sms: "Par2Play: simulator access stays on Golfer.",
    };
  }
  return {
    email: "No credit is on the profile. A play pack or a membership is how a balance gets left behind.",
    sms: "Par2Play: no credit on the profile yet.",
  };
}

export function receipt(state: OfferState, total: number, last4: string | null): { email: string; sms: string } {
  const slot = slotById(state.slotId);
  const product = state.product ? productLabel(state.product) : "Visit";
  const plan = state.buyingMembership && state.plan ? planById(state.plan).name : "Guest";
  const party = partyCount(state.answers);
  const card = last4 ? ` Card ending ${last4}.` : "";
  return {
    email: `You're booked at Par2Play. ${plan}. ${SATURDAY} at ${slot.time}. ${product}. ${party} ${party === 1 ? "person" : "people"}. ${money(total)}.${card} ${CANCEL_RULE}`,
    sms: `Par2Play: ${SATURDAY} ${slot.time}, ${product}. ${money(total)}. Cancel free until 24 hours before.`,
  };
}

export type MapRow = {
  path: string;
  stage: FunnelStage;
  title: string;
  objective: string;
  screen: string;
  message: string;
  offer: string;
};

export const JOURNEY_MAP: MapRow[] = [
  {
    path: "Both",
    stage: "Arrive",
    title: "Home",
    objective: "Choose a door.",
    screen: "Hero, facilities, training, and the three monthly prices.",
    message: "No email or SMS.",
    offer: "Monthly prices only. Annual waits until the plan step.",
  },
  {
    path: "Join",
    stage: "Qualify",
    title: "Four questions",
    objective: "Intent, experience, place, then how often.",
    screen: "One question a screen. No price.",
    message: "No email or SMS.",
    offer: "None. Compete, coaching, or living here will match Elite. Weekly, both places, or the simulator matches Golfer. The rest matches Social.",
  },
  {
    path: "Join",
    stage: "Recommend",
    title: "The plan",
    objective: "Say one plan out loud.",
    screen: "The match, what it includes, and the hour that stays attached.",
    message: "On screen only.",
    offer: "First swing, or the $30 Social credit. Annual is held back.",
  },
  {
    path: "Join",
    stage: "Commit",
    title: "Registration",
    objective: "Name, email, and mobile. No card.",
    screen: "Save this plan. The hour stays attached.",
    message: "On screen only.",
    offer: "The same hour credit. Annual is still held.",
  },
  {
    path: "Join",
    stage: "Commit",
    title: "Plan and billing",
    objective: "Monthly or the year.",
    screen: "Three plans. The matched one is selected.",
    message: "On screen only.",
    offer: "Annual: two months included. The hour credit is held for the visit.",
  },
  {
    path: "Join",
    stage: "Book",
    title: "First visit",
    objective: "A Saturday time and one offer.",
    screen: "Product, party, time, total, and the 24-hour rule.",
    message: "On screen only.",
    offer: "One of lesson series, first swing, the $30 credit, or the guest round. A pack does not stack on an included hour.",
  },
  {
    path: "Visit",
    stage: "Qualify",
    title: "Place and party",
    objective: "Book before an account exists.",
    screen: "Outdoor, simulator, or both. Then 1, 2, or 4.",
    message: "No email or SMS.",
    offer: "None yet.",
  },
  {
    path: "Visit",
    stage: "Book",
    title: "Saturday time",
    objective: "Hold a time on the screen.",
    screen: "Three times. The total updates before a name.",
    message: "On screen only.",
    offer: "Play pack on a guest simulator hour. A guest round or annual is the join pitch on a course visit. First swing is held until they join.",
  },
  {
    path: "Visit",
    stage: "Recommend",
    title: "Guest or member",
    objective: "Pay the guest total, or join and reprice.",
    screen: "Two totals. One offer.",
    message: "On screen only.",
    offer: "First swing if the visit is a simulator hour. Guest round if friends are on a round. Annual if they are alone on the course. The other offer is named as held back.",
  },
  {
    path: "Both",
    stage: "Pay",
    title: "Card",
    objective: "Record the step. Charge nothing.",
    screen: "Name, mobile, card, total, and the cancellation sentence.",
    message: "The receipt is written on the next screen. It does not send.",
    offer: "The visit offer stays. Annual is held if they kept the monthly price and no visit offer replaced it.",
  },
  {
    path: "Both",
    stage: "Confirm",
    title: "Receipt",
    objective: "Show the booking and the three notes that follow.",
    screen: "Time, product, total, and the last four digits.",
    message: "Email and SMS copy for the receipt. Nothing sends.",
    offer: "No new offer. The later notes carry the next one.",
  },
  {
    path: "After",
    stage: "Return",
    title: "The day before",
    objective: "Prepare the arrival.",
    screen: "Not a page. It is listed under what happens next.",
    message: "Email and SMS. Time, visit, party, and the 24-hour rule.",
    offer: "None.",
  },
  {
    path: "After",
    stage: "Return",
    title: "The morning after",
    objective: "One next step, chosen from the visit.",
    screen: "Listed under what happens next.",
    message: "Email and SMS.",
    offer: "Play pack if they were a guest on the simulator and did not buy it. Otherwise the plan they already hold, or Golfer after a guest round.",
  },
  {
    path: "After",
    stage: "Return",
    title: "Unused credit",
    objective: "Say what is still on the profile.",
    screen: "Listed under what happens next.",
    message: "Email and SMS.",
    offer: "The leftover credit only: simulator credit, rounds, pack hours, or the weekly Elite hour.",
  },
];
