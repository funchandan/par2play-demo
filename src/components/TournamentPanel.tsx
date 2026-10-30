import { PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { EVENTS_HERO_FILM } from "../data/films";
import { formatPrice } from "../data/membershipEstimate";
import type { OfferBenefit } from "./OfferTicker";

const BENEFITS: readonly OfferBenefit[] = [
  { id: "holes", label: "18-hole rounds", icon: "flag" },
  { id: "tag", label: "League player tag", icon: "tag" },
  { id: "sims", label: "Contests on the simulators", icon: "trophy" },
];

export function TournamentPanel() {
  return (
    <PricingHero
      id="tournament-offer"
      pageTitle="Par2Play Fall League"
      heading="Fall league"
      figure={formatPrice(PRICES.leagueEntry)}
      live={`${formatPrice(PRICES.leagueEntry)}. League booking is 18 holes. A League Player tag is required.`}
      film={EVENTS_HERO_FILM}
      benefits={BENEFITS}
      primary={{ offer: "tournament", label: "Join the league" }}
      secondary={{ offer: "bay", label: "Try it out" }}
    />
  );
}
