import type { LucideIcon } from "lucide-react";
import { CalendarDays, Flag, Target, Users } from "lucide-react";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { CommunityStrip, EventGallery, EventHero, StillGrid } from "../components/PhotoStrips";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { BookLink, buttonFocus } from "../components/Cta";
import { TournamentForm } from "../components/TournamentForm";
import { ValuePoint } from "../components/ValuePoint";
import { OCLOCK, PRICES } from "../data/business";
import { formatPrice } from "../data/membershipEstimate";
import { PUBLISHED_COACHES } from "../data/coaches";
import { EVENT_FACTS, HOLIDAY_FACTS } from "../data/events";
import { EventTypeList } from "../components/EventTypeList";
import { COACHING_GALLERY, FITTING_GALLERY, JUNIORS_GALLERY } from "../data/gallery";
import { pageHref } from "../data/routes";

function CheckoutLink({ href, children, className = "" }: { href: string; children: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] hover:text-[#0A0F0B] active:bg-[#0fb852] visited:bg-[#14D45E] visited:text-[#0A0F0B] ${buttonFocus} ${className}`}
    >
      {children}
    </a>
  );
}

const keyPrice = "mt-2 font-display text-6xl font-semibold leading-none tracking-tight text-[#0A0F0B] @3xl:text-8xl";
const boxPrice = "mt-3 font-display text-3xl font-semibold leading-none text-[#0A0F0B]";

function KeyPrice({ label, amount, cadence }: { label: string; amount: number | null; cadence?: string }) {
  const figure = formatPrice(amount);
  return (
    <div className="mt-6">
      <p className="text-base font-semibold text-[#0A0F0B]">{label}</p>
      <p className={keyPrice}>{amount == null ? figure : `${figure}${cadence ?? ""}`}</p>
    </div>
  );
}

function PriceBox({ label, amount, cadence }: { label: string; amount: number | null; cadence?: string }) {
  const figure = formatPrice(amount);
  return (
    <div className="rounded-2xl border-2 border-[#4b5563] bg-white p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.06em] text-[#374151]">{label}</p>
      <p className={boxPrice}>{amount == null ? figure : `${figure}${cadence ?? ""}`}</p>
    </div>
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
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-6xl">Coaching</h1>
        <p className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-tight">
          Two PGA professional coaches, Nick and Sean
        </p>
        <KeyPrice label="30-minute lesson" amount={PRICES.lessonSingle} />
        <div className="mt-6 grid gap-3 @3xl:grid-cols-3">
          <PriceBox label="Swing evaluation" amount={PRICES.swingEvaluation} />
          <PriceBox label="Club fitting" amount={PRICES.fitting} />
          <PriceBox label="Golf Improvement Bundle" amount={PRICES.golfImprovementBundle} />
        </div>
        <StillGrid photos={COACHING_GALLERY} className="@3xl:grid-cols-3" />
        <ol className="mt-10 grid gap-6 @3xl:grid-cols-3">
          <JourneyStep icon={Target} step="1" title="Swing evaluation" line="Start with a swing evaluation, then a plan for what to change." />
          <JourneyStep icon={Flag} step="2" title="Lessons" line="1:1 lessons that follow that plan." />
          <JourneyStep
            icon={Users}
            step="3"
            title="Golf Improvement Bundle"
            line={`${formatPrice(PRICES.golfImprovementBundle)}. Lessons, assessments, bay time, and a workshop.`}
          />
        </ol>
        <div className="mt-8 grid w-full grid-cols-1 gap-3 @3xl:inline-grid @3xl:w-auto @3xl:grid-cols-3">
          <BookLink className="w-full" offer="swing-evaluation">
            Analyze my swing
          </BookLink>
          <BookLink className="w-full" offer="lesson" tone="line">
            Schedule a lesson
          </BookLink>
          <CheckoutLink className="w-full" href={OCLOCK.golfImprovementBundle}>
            Buy the bundle
          </CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Lesson packs</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed">
          Five lessons are {formatPrice(PRICES.lessonPack5)}. Ten lessons are {formatPrice(PRICES.lessonPack10)}. Twenty lessons are{" "}
          {formatPrice(PRICES.lessonPack20)}. Thirty lessons are {formatPrice(PRICES.lessonPack30)}. Fifty lessons are{" "}
          {formatPrice(PRICES.lessonPack50)}.
        </p>
        <ul className="mt-6 grid gap-3 @3xl:grid-cols-5">
          {lessonTiers.map((tier) => (
            <li key={tier.count} className="border-2 border-[#4b5563] bg-white p-4">
              <p className="text-base font-semibold">{tier.count}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{formatPrice(tier.price)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <CheckoutLink href={OCLOCK.lessonPacks}>See lesson packs</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Club fitting</h2>
        <p className={boxPrice}>{formatPrice(PRICES.fitting)}</p>
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
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-6xl">Junior coaching.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed">Building the golfers of tomorrow.</p>
        <KeyPrice label="Twice a week" amount={PRICES.juniorTwoLessonsWeekly} cadence="/mo" />
        <div className="mt-6 grid gap-3 @3xl:grid-cols-2">
          <PriceBox label="Once a week" amount={PRICES.juniorOneLessonWeekly} cadence="/mo" />
          <PriceBox label="Twice a week" amount={PRICES.juniorTwoLessonsWeekly} cadence="/mo" />
        </div>
        <StillGrid photos={JUNIORS_GALLERY} />
        <div className="mt-8 grid max-w-xl gap-5">
          <ValuePoint icon={Users} label="Future pros" line="1:1 coaching with PGA pros Nick and Sean, once or twice a week." />
          <ValuePoint icon={CalendarDays} label="Supervised care" line="Juniors practise under staff supervision in a safe, friendly bay." />
          <ValuePoint icon={Target} label="Technology-assisted development" line="Shot data on every swing shows progress week to week." />
        </div>
        <div className="mt-8">
          <BookLink offer="junior">Schedule junior coaching</BookLink>
        </div>
      </article>
    </PageFrame>
  );
}

export function EventsPage() {
  return (
    <PageFrame>
      <EventHero />
      <article className={pageSpace}>
        <KeyPrice label="Event package" amount={PRICES.eventPackage} />
        <div className="mt-8">
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
        <div className="mt-8 flex flex-wrap gap-3">
          <BookLink offer="group">Check availability</BookLink>
          <a href={pageHref("")} className={`inline-flex min-h-11 items-center text-base font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`}>
            Back to the landing page
          </a>
        </div>
      </article>
    </PageFrame>
  );
}

export function TournamentPage() {
  return (
    <PageFrame>
      <article className={`${pageSpace} text-center`}>
        <h1 className="mx-auto max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-5xl">
          Par2Play Fall League Coming Soon!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed">
          League booking is 18 holes. A League Player tag is required.
        </p>
        <div className="mx-auto max-w-xl">
          <KeyPrice label="League entry" amount={PRICES.leagueEntry} />
        </div>
        <div className="mt-8">
          <BookLink offer="tournament">Join the league</BookLink>
        </div>
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
