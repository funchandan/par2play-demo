import type { LucideIcon } from "lucide-react";
import { CalendarDays, Flag, Target, Users } from "lucide-react";
import { CoachingPanel } from "../components/CoachingPanel";
import { EventsPanel } from "../components/EventsPanel";
import { JuniorsPanel } from "../components/JuniorsPanel";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { TournamentPanel } from "../components/TournamentPanel";
import { CommunityStrip, EventGallery, StillGrid } from "../components/PhotoStrips";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { BookLink, buttonFocus } from "../components/Cta";
import { TournamentForm } from "../components/TournamentForm";
import { ValuePoint } from "../components/ValuePoint";
import { OCLOCK, PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";
import { PUBLISHED_COACHES } from "../data/coaches";
import { EVENT_FACTS, HOLIDAY_FACTS } from "../data/events";
import { EventTypeList } from "../components/EventTypeList";
import { COACHING_GALLERY, FITTING_GALLERY, JUNIORS_GALLERY } from "../data/gallery";
import { pageHref } from "../data/routes";

function CheckoutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] hover:text-[#0A0F0B] active:bg-[#0fb852] visited:bg-[#14D45E] visited:text-[#0A0F0B] ${buttonFocus}`}
    >
      {children}
    </a>
  );
}

export function MembershipPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <MembershipCalculator />
      </article>
      <CommunityStrip />
    </PageFrame>
  );
}

const lessonTiers = [
  { count: "5 lessons", price: PRICES.lessonPack5 },
  { count: "10 lessons", price: PRICES.lessonPack10 },
  { count: "20 lessons", price: PRICES.lessonPack20 },
  { count: "30 lessons", price: PRICES.lessonPack30 },
  { count: "50 lessons", price: PRICES.lessonPack50 },
] as const;

const fittingChoices = ["Driver", "Irons", "Wedges", "Full bag"] as const;

export function CoachingPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <CoachingPanel />
        <p className="mt-10 max-w-2xl text-base leading-relaxed">Two PGA professional coaches, Nick and Sean.</p>
        <StillGrid photos={COACHING_GALLERY} className="@3xl:grid-cols-3" />
        <ol className="mt-10 grid gap-6 @3xl:grid-cols-3">
          <JourneyStep icon={Target} step="1" title="Swing evaluation" line="Start with a swing evaluation, then a plan for what to change." />
          <JourneyStep icon={Flag} step="2" title="Lessons" line="1:1 lessons that follow that plan." />
          <JourneyStep
            icon={Users}
            step="3"
            title="Golf Improvement Bundle"
            line={`$${PRICES.golfImprovementBundle}. Lessons, assessments, bay time, and a workshop.`}
          />
        </ol>
        <div className="mt-8">
          <CheckoutLink href={OCLOCK.golfImprovementBundle}>Buy the bundle</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Lesson packs</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed">Packages never expire and have no blackout days.</p>
        <ul className="mt-6 grid gap-3 @3xl:grid-cols-5">
          {lessonTiers.map((tier) => (
            <li key={tier.count} className="border-2 border-[#4b5563] bg-white p-4">
              <p className="text-base font-semibold">{tier.count}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{money(tier.price)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <CheckoutLink href={OCLOCK.lessonPacks}>See lesson packs</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Club fitting</h2>
        <p className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">See pricing</p>
        <StillGrid photos={FITTING_GALLERY} />
        <ul className="mt-6 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
          {fittingChoices.map((choice) => (
            <li key={choice} className="text-base font-semibold">
              {choice}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <BookLink offer="fitting">Get fitted</BookLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Instructors on par2play.com</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed">
          The live site publishes these two biographies. It does not publish a biography for Sean.
        </p>
        <div className="mt-6 grid gap-6 @3xl:grid-cols-2">
          {PUBLISHED_COACHES.map((coach) => (
            <article key={coach.id} className="border-2 border-[#0A0F0B] bg-white p-5">
              <h3 className="font-display text-2xl font-semibold">{coach.name}</h3>
              <p className="mt-3 text-base leading-relaxed">{coach.line}</p>
            </article>
          ))}
        </div>
      </article>
    </PageFrame>
  );
}

function JourneyStep({
  icon,
  step,
  title,
  line,
}: {
  icon: LucideIcon;
  step: string;
  title: string;
  line: string;
}) {
  return (
    <li className="border-2 border-[#0A0F0B] bg-white p-5">
      <p className="text-base font-semibold">Step {step}</p>
      <div className="mt-3">
        <ValuePoint icon={icon} label={title} line={line} />
      </div>
    </li>
  );
}

export function JuniorsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JuniorsPanel />
        <p className="mt-10 max-w-xl text-base leading-relaxed">Building the golfers of tomorrow.</p>
        <StillGrid photos={JUNIORS_GALLERY} />
        <div className="mt-8 grid max-w-xl gap-5">
          <ValuePoint icon={Users} label="Future pros" line="1:1 coaching with PGA pros Nick and Sean, once or twice a week." />
          <ValuePoint icon={CalendarDays} label="Supervised care" line="Juniors practise under staff supervision in a safe, friendly bay." />
          <ValuePoint icon={Target} label="Technology-assisted development" line="Shot data on every swing shows progress week to week." />
        </div>
      </article>
    </PageFrame>
  );
}

export function EventsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <EventsPanel />
        <div className="mt-16">
          <EventTypeList />
        </div>
        <div className="mt-8">
          <EventGallery />
        </div>
        <ul className="mt-8 grid max-w-2xl list-disc gap-2 pl-5 text-base leading-relaxed">
          {EVENT_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <h2 className="mt-12 font-display text-3xl font-semibold tracking-tight">Holiday parties</h2>
        <ul className="mt-4 grid max-w-2xl list-disc gap-2 pl-5 text-base leading-relaxed">
          {HOLIDAY_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <p className="mt-8">
          <a href={pageHref("")} className={`inline-flex min-h-11 items-center text-base font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`}>
            Back to the landing page
          </a>
        </p>
      </article>
    </PageFrame>
  );
}

export function TournamentPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <TournamentPanel />
        <p className="mx-auto mt-10 max-w-xl text-center text-base leading-relaxed">
          League booking is 18 holes. A League Player tag is required.
        </p>
        <div className="mt-10">
          <TournamentForm />
        </div>
      </article>
    </PageFrame>
  );
}

export function NotFoundPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <h1 className="font-display text-4xl font-semibold tracking-tight">That page is not here.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed">Try the membership page, or go back to the start.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={pageHref("membership")}
            className={`inline-flex min-h-11 items-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] ${buttonFocus}`}
          >
            Membership
          </a>
          <a href={pageHref("")} className={`inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 text-base font-semibold ${buttonFocus}`}>
            Home
          </a>
        </div>
      </article>
    </PageFrame>
  );
}
