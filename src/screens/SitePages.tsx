import type { LucideIcon } from "lucide-react";
import { CalendarDays, Flag, Target, Users, Wrench } from "lucide-react";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { CommunityStrip, EventGallery, EventHero } from "../components/PhotoStrips";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { BookLink, buttonFocus } from "../components/Cta";
import { TournamentForm } from "../components/TournamentForm";
import { ValuePoint } from "../components/ValuePoint";
import { OCLOCK, PRICES } from "../data/business";
import { PUBLISHED_COACHES } from "../data/coaches";
import { EVENT_FACTS, EVENT_TYPES, HOLIDAY_FACTS } from "../data/events";
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

function Price({ amount }: { amount: string }) {
  return <p className="font-display text-3xl font-semibold tracking-tight text-[#0A0F0B]">{amount}</p>;
}

const plans = [
  {
    name: "Practice Unlimited",
    price: `$${PRICES.unlimitedMonthly}/mo`,
    detail: "Up to 1 hour a day.",
    includes: "The bay is yours for up to an hour each day you come in.",
    href: OCLOCK.practiceUnlimited,
    cta: "Book a membership",
    best: true,
  },
  {
    name: "10 Practice Pack",
    price: `$${PRICES.tenPack}`,
    detail: "10 sessions of 60 minutes.",
    includes: "Ten hour-long visits. They do not expire.",
    href: OCLOCK.tenPracticePack,
    cta: "Buy the pack",
    best: false,
  },
  {
    name: "Single bay session",
    price: `$${PRICES.baySession}`,
    detail: "One 60-minute rental.",
    includes: "One hour in a bay. The slot price is confirmed when you check out.",
    href: OCLOCK.bayRental,
    cta: "Book a bay",
    best: false,
  },
] as const;

export function MembershipPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-6xl">
          Membership
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed">
          Pick how long you will come and how often. The totals update as you go.
        </p>
        <MembershipCalculator />
        <div className="mt-10 grid gap-4 @3xl:hidden">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <div className="mt-10 hidden overflow-x-auto @3xl:block">
          <table className="w-full min-w-[40rem] border-collapse text-left text-base">
            <caption className="sr-only">Membership, ten-visit pack, and a single bay rental</caption>
            <thead>
              <tr className="border-b-2 border-[#0A0F0B]">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Offer
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Price
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  What you get
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Checkout
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.name} className={plan.best ? "bg-[#e7f8ee]" : undefined}>
                  <th scope="row" className="py-4 pr-4 font-semibold">
                    {plan.name}
                    {plan.best ? <span className="mt-1 block text-base font-semibold">Best value</span> : null}
                  </th>
                  <td className="py-4 pr-4">{plan.price}</td>
                  <td className="py-4 pr-4">{plan.includes}</td>
                  <td className="py-4">
                    <CheckoutLink href={plan.href}>{plan.cta}</CheckoutLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Questions</h2>
        <dl className="mt-6 grid max-w-2xl gap-6">
          <div>
            <dt className="text-base font-semibold">Do pack sessions expire?</dt>
            <dd className="mt-1 text-base leading-relaxed">
              The 10 Practice Pack on GolfClock says the ten sessions never expire.
            </dd>
          </div>
          <div>
            <dt className="text-base font-semibold">Can I cancel membership?</dt>
            <dd className="mt-1 text-base leading-relaxed">
              The membership page on par2play.com says you can cancel anytime.
            </dd>
          </div>
        </dl>
      </article>
      <CommunityStrip />
    </PageFrame>
  );
}

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <article className={`border-2 p-5 ${plan.best ? "border-[#0A0F0B] bg-[#e7f8ee]" : "border-[#4b5563] bg-white"}`}>
      {plan.best ? <p className="text-base font-semibold">Best value</p> : null}
      <h2 className="mt-1 font-display text-2xl font-semibold">{plan.name}</h2>
      <Price amount={plan.price} />
      <p className="mt-2 text-base leading-relaxed">{plan.detail}</p>
      <p className="mt-2 text-base leading-relaxed">{plan.includes}</p>
      <div className="mt-4">
        <CheckoutLink href={plan.href}>{plan.cta}</CheckoutLink>
      </div>
    </article>
  );
}

const lessonTiers = [
  { count: "5 lessons", price: `$${PRICES.lessonPack5}`, href: OCLOCK.lessonPacks },
  { count: "10 lessons", price: "Shown at checkout", href: OCLOCK.lessonPacks },
  { count: "20 lessons", price: "Shown at checkout", href: OCLOCK.lessonPacks },
  { count: "30 lessons", price: "Shown at checkout", href: OCLOCK.lessonPacks },
  { count: "50 lessons", price: `$${PRICES.lessonPack50}`, href: OCLOCK.lessonPacks },
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
        <div className="mt-8 flex flex-wrap gap-3">
          <BookLink offer="swing-evaluation">Book a swing evaluation</BookLink>
          <BookLink offer="lesson" tone="line">
            Schedule a lesson
          </BookLink>
          <CheckoutLink href={OCLOCK.golfImprovementBundle}>Buy the bundle</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Lesson packs</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed">
          Five lessons are $400. Fifty lessons are $3,000. The prices between those two are shown at checkout.
        </p>
        <ul className="mt-6 grid gap-3 @3xl:grid-cols-5">
          {lessonTiers.map((tier) => (
            <li key={tier.count} className="border-2 border-[#4b5563] bg-white p-4">
              <p className="text-base font-semibold">{tier.count}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{tier.price}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <CheckoutLink href={OCLOCK.lessonPacks}>See lesson packs</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Club fitting</h2>
        <ul className="mt-6 grid gap-3 @3xl:grid-cols-4">
          {fittingChoices.map((choice) => (
            <li key={choice}>
              <ValuePoint icon={Wrench} label={choice} line="Book this fitting in the fitting flow." />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <BookLink offer="fitting">Book a club fitting</BookLink>
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
        <div className="mt-8 grid max-w-xl gap-5">
          <ValuePoint icon={Users} label="Future pros" line="1:1 coaching with PGA pros Nick and Sean, once or twice a week." />
          <ValuePoint icon={CalendarDays} label="Supervised care" line="Juniors practise under staff supervision in a safe, friendly bay." />
          <ValuePoint icon={Target} label="Technology-assisted development" line="Shot data on every swing shows progress week to week." />
        </div>
        <div className="mt-8">
          <BookLink offer="junior">Book junior coaching</BookLink>
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
        <p className="max-w-2xl text-base leading-relaxed">
          Par2Play hosts parties and company events in the studio. A golf pro can teach mini-lessons and run casual games.
        </p>
        <div className="mt-8">
          <EventGallery />
        </div>
        <ul className="mt-8 grid gap-3 @3xl:grid-cols-2">
          {EVENT_TYPES.map((type) => (
            <li key={type} className="border-2 border-[#4b5563] bg-white px-4 py-3 text-base font-semibold">
              {type}
            </li>
          ))}
        </ul>
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
          <BookLink offer="group">Events calendar</BookLink>
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
        <div className="mt-8">
          <BookLink offer="tournament">Book league play</BookLink>
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
