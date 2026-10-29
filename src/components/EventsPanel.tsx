import { useId, useState } from "react";
import { PricingHero } from "./PricingHero";
import { EVENTS_HERO_FILM } from "../data/films";
import type { OfferBenefit } from "./OfferTicker";

const GUEST_MIN = 6;
const GUEST_MAX = 40;
const BAY_CAP = 6;

const BENEFITS: readonly OfferBenefit[] = [
  { id: "pro", label: "Golf pro hosting", icon: "flag" },
  { id: "mini", label: "Mini lessons", icon: "ball" },
  { id: "bays", label: "Reserved bays", icon: "calendar" },
  { id: "clubs", label: "Complimentary clubs", icon: "club" },
  { id: "byob", label: "Bring your own drinks", icon: "party" },
  { id: "karaoke", label: "Karaoke on the TVs", icon: "trophy" },
];

export function EventsPanel() {
  const sliderId = useId();
  const [guests, setGuests] = useState(12);
  const [hours, setHours] = useState<2 | 3>(2);
  const bays = Math.ceil(guests / BAY_CAP);
  const guestWord = guests === 1 ? "guest" : "guests";
  const bayWord = bays === 1 ? "bay" : "bays";
  const hourWord = "hours";
  const phrase = `${guests} ${guestWord} in the group`;
  const paceFill = `${((guests - GUEST_MIN) / (GUEST_MAX - GUEST_MIN)) * 100}%`;
  const live = `See pricing. ${phrase}. ${bays} ${bayWord}. ${hours} ${hourWord}.`;

  return (
    <PricingHero
      id="events-offer"
      heading="Event package"
      figure="See pricing"
      live={live}
      film={EVENTS_HERO_FILM}
      benefits={BENEFITS}
      primary={{ offer: "group", label: "Check availability" }}
      secondary={{ offer: "bay", label: "Try it out" }}
      selector={
        <div>
          <label htmlFor={sliderId} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base font-semibold text-white">
            <output htmlFor={sliderId} className="font-display text-5xl font-semibold leading-none text-[#7DFFB0] tabular-nums">
              {guests}
            </output>
            {guestWord} in the group
          </label>
          <div className="mt-3 flex items-center gap-3">
            <StepButton label="Fewer guests" onClick={() => setGuests((value) => Math.max(GUEST_MIN, value - 1))}>
              −
            </StepButton>
            <input
              id={sliderId}
              className="pace-slider pace-slider-on-dark min-w-0 flex-1"
              type="range"
              min={GUEST_MIN}
              max={GUEST_MAX}
              step={1}
              value={guests}
              style={{ ["--pace" as string]: paceFill }}
              aria-valuetext={phrase}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
            <StepButton label="More guests" onClick={() => setGuests((value) => Math.min(GUEST_MAX, value + 1))}>
              +
            </StepButton>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1" role="group" aria-label="Event length">
            {([2, 3] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                className={`aa-focus-ink min-h-11 rounded-full px-3 text-sm font-semibold whitespace-nowrap @3xl:text-base ${hours === choice ? "bg-white text-[#0A0F0B]" : "text-white"}`}
                aria-pressed={hours === choice}
                onClick={() => setHours(choice)}
              >
                {choice} hours
              </button>
            ))}
          </div>
          <p className="mt-4 text-base font-semibold text-white">
            {bays} {bayWord} · {hours} {hourWord}
          </p>
        </div>
      }
    />
  );
}

function StepButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      className="aa-focus-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-2xl font-semibold text-white"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
