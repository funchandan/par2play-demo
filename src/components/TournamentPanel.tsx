import { PricingHero } from "./PricingHero";
import { EVENTS_HERO_FILM } from "../data/films";
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
      heading="Fall league"
      figure="Coming soon"
      live="Coming soon. League booking is 18 holes. A League Player tag is required."
      film={EVENTS_HERO_FILM}
      benefits={BENEFITS}
      primary={{ offer: "tournament", label: "Join the league" }}
      secondary={{ offer: "bay", label: "Try it out" }}
    />
  );
}
