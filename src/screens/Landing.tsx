import { Button, Card, Chip } from "@heroui/react";
import { useState } from "react";
import { Mark } from "../components/Chrome";
import { Icon } from "../components/Icons";
import { CLASSES, IMAGES, PLANS, TERMS, membershipCharge, money, type Term } from "../data/catalog";
import { useFlow } from "../state/flow";

function Trophy() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#e0a100]">
      <path
        fill="currentColor"
        d="M4.2 2.2h7.6v1.1c0 2.2-1.5 3.8-3.3 4.2.2.7.7 1.2 1.5 1.5H10v1.2H6V9c.8-.3 1.3-.8 1.5-1.5C5.7 7.1 4.2 5.5 4.2 3.3V2.2z"
      />
      <path fill="currentColor" d="M4.2 3.1H2.4c0 1.7.9 2.8 2.1 3.2-.2-.5-.3-1-.3-1.6V3.1zM11.8 3.1v1.6c0 .6-.1 1.1-.3 1.6 1.2-.4 2.1-1.5 2.1-3.2h-1.8zM6.2 12.2h3.6v1.4H6.2z" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4">
      <path fill="currentColor" d="M8 1.4l1.7 3.6 3.9.5-2.9 2.7.7 3.9L8 10.2 4.6 12.1l.7-3.9L2.4 5.5l3.9-.5z" />
    </svg>
  );
}

export function Landing() {
  const flow = useFlow();
  const [menu, setMenu] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [term, setTerm] = useState<Term>(1);
  const [foursome, setFoursome] = useState(false);
  const lightNav = "text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 hover:text-emerald-300";

  return (
    <div className={flow.layout === "mobile" ? "h-full overflow-y-auto bg-white" : "bg-white"}>
      <section className={`relative flex flex-col overflow-hidden bg-slate-900 text-white ${flow.layout === "web" ? "min-h-[760px]" : "min-h-[640px]"}`}>
        <img src={IMAGES.hero} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
        <div className="relative z-10 flex items-center justify-between px-5 py-6 lg:px-12">
          <Mark light />
          {flow.layout === "web" ? (
            <nav className="flex items-center gap-8">
              <button className={lightNav} type="button" onClick={flow.goHome}>Home</button>
              <button className={lightNav} type="button" onClick={flow.goClubhouse}>Leagues</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("gallery")}>Gallery</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("training")}>Training</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("pricing")}>Pricing</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("about")}>About</button>
              <Button
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
                onPress={flow.startVisit}
              >
                Book a bay
              </Button>
            </nav>
          ) : (
            <Button variant="ghost" className="text-white" onPress={() => setMenu((open) => !open)}>
              {menu ? "Close" : "Menu"}
            </Button>
          )}
        </div>
        {menu && flow.layout === "mobile" && (
          <nav className="relative z-10 flex flex-col gap-3 px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white">
            <button type="button" onClick={() => { setMenu(false); flow.goClubhouse(); }}>Leagues</button>
            <button type="button" onClick={() => { setMenu(false); flow.goSection("gallery"); }}>Gallery</button>
            <button type="button" onClick={() => { setMenu(false); flow.goSection("training"); }}>Training</button>
            <button type="button" onClick={() => { setMenu(false); flow.goSection("pricing"); }}>Pricing</button>
            <button type="button" onClick={() => { setMenu(false); flow.goSection("about"); }}>About</button>
          </nav>
        )}
        <div className={`relative z-10 flex flex-1 flex-col justify-end px-6 pb-12 ${flow.layout === "web" ? "lg:px-12" : ""}`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">Somerset, NJ</p>
          <h1 className={`mt-4 font-semibold tracking-tighter ${flow.layout === "web" ? "text-3xl" : "text-3xl"}`}>
            A seriously fun way to play golf. Swing by!
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90">
            Five Full Swing bays at 695 Hamilton Street. Lessons with Nick Schiavo and Nick Monticello, PGA.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-full uppercase tracking-[0.14em] text-[11px]" onPress={flow.startVisit}>
              Book a bay
            </Button>
            <a
              href="tel:+18336979464"
              className="inline-flex h-10 items-center rounded-full border border-white/50 bg-white/10 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Call us at 1833 MY SWING
            </a>
          </div>
        </div>
      </section>

      <section className={`mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-20 ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Our facilities</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-slate-900 lg:text-5xl">
            Get better. Stay after.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-500">
            Coaching and the screen for players who are learning, and the room for friends and events.
          </p>
          <ul className="mt-8 space-y-4">
            {(
              [
                ["coach", "Personalised for you", "PGA coaches, a club fitting, and the screen scoring every shot. Make it a game with the group you brought."],
                ["screen", "State-of-the-art indoor golf", "Five Full Swing bays. The screen, the clubs, and the room are ready when you walk in."],
                ["room", "Relax and let your hair down", "The lounge is part of the visit. Friends and events, once the round is done."],
              ] as const
            ).map(([icon, title, copy]) => (
              <li key={title} className="flex items-start gap-3">
                <Icon name={icon} className="mt-0.5 text-emerald-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-slate-950">
            <video
              src={`${import.meta.env.BASE_URL}clips/facilities.mp4`}
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Indoor golf, the screen, coaching, and events at Par2Play"
            />
          </div>
          <aside
            aria-label="Reviews"
            className={`w-max max-w-full space-y-1 rounded-lg bg-[#f3efe6] px-4 py-3 text-sm font-bold leading-snug text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.22)] ${flow.layout === "web" ? "absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]" : "mt-3"}`}
          >
            <p>Groups from 10 - 20 Guests</p>
            <p className="flex items-center gap-2">
              <Trophy />
              300+ Private Events Hosted
            </p>
            <p className="flex items-center gap-2">
              <span className="flex text-[#e23b2f]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} />
                ))}
              </span>
              4.8 Google Rating
            </p>
          </aside>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-6 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-4xl font-semibold tracking-tighter">Captured moments</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            A look into the daily life at Par2Play, from early morning rounds to sunset finishes.
          </p>
          <div className={`mt-10 grid gap-4 ${flow.layout === "web" ? "grid-cols-3" : ""}`}>
            {IMAGES.gallery.map((src) => (
              <img key={src} src={src} alt="Par2Play" className="h-64 w-full rounded-2xl object-cover object-center" />
            ))}
          </div>
        </div>
      </section>

      <section id="training" className="scroll-mt-6 bg-slate-950 px-6 py-20 text-white">
        <div className={`mx-auto grid max-w-[1400px] gap-12 ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">Pro training</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tighter lg:text-5xl">
              Elevate your game with data-driven insights.
            </h2>
            <ul className="mt-10 space-y-4">
              {CLASSES.map((item) => {
                const open = item.filled < item.spots;
                return (
                  <li key={item.id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                          <Icon name="calendar" />
                          {item.when} · {item.time}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                          <Icon name="person" />
                          {item.instructor}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                          <Icon name="seats" />
                          {item.filled} of {item.spots} spots
                        </p>
                      </div>
                      <p className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                        {open ? "Free for members" : "Full"}
                      </p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-emerald-400" style={{ width: `${(item.filled / item.spots) * 100}%` }} />
                    </div>
                    {open && (
                      <Button className="mt-4 rounded-full uppercase tracking-[0.14em] text-[11px]" onPress={flow.startVisit}>
                        Reserve a spot
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-white/10">
            <img src={IMAGES.swing} alt="A lesson in a Par2Play bay" className="h-full w-full object-cover object-top" />
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-6 px-6 py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <h2 className="text-4xl font-semibold tracking-tighter">Simple membership</h2>
          <p className="mt-4 text-slate-500">Choose the months. Twelve months costs ten. A foursome drops the fourth plan.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {TERMS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={term === item}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${term === item ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 text-slate-700"}`}
                onClick={() => setTerm(item)}
              >
                {item === 1 ? "1 month" : `${item} months`}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={foursome}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${foursome ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 text-slate-700"}`}
              onClick={() => setFoursome((on) => !on)}
            >
              Foursome · fourth free
            </button>
          </div>
          <div className={`mt-8 grid gap-5 text-left ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
            {PLANS.map((plan) => {
              const charge = membershipCharge(plan, term, foursome);
              const unit = membershipCharge(plan, term, false).amount;
              return (
                <Card key={plan.id} className={`rounded-3xl border p-2 ${plan.popular ? "border-emerald-600" : "border-slate-200"}`}>
                  <Card.Header>
                    {plan.popular && (
                      <Chip color="accent" size="sm" variant="soft">
                        <Chip.Label>Popular</Chip.Label>
                      </Chip>
                    )}
                    <Card.Title className="text-sm font-semibold uppercase tracking-wide text-slate-500">{plan.name}</Card.Title>
                    <p className="text-4xl font-semibold tracking-tight">{money(charge.amount)}</p>
                    {charge.against && <p className="text-sm text-slate-500">against {money(charge.against)}</p>}
                    {foursome && plan.id !== "junior" && (
                      <p className="text-sm text-slate-500">3 × {money(unit)}</p>
                    )}
                    {plan.id === "junior" && <p className="text-sm text-slate-500">Foursome does not apply.</p>}
                  </Card.Header>
                  <Card.Content>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Icon name="check" className="text-emerald-700" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card.Content>
                  <Card.Footer>
                    <Button
                      fullWidth
                      className="rounded-full uppercase tracking-[0.14em] text-[11px]"
                      variant={plan.popular ? "primary" : "outline"}
                      onPress={() => flow.startJoin(plan.id, { term, foursome })}
                    >
                      {plan.cta}
                    </Button>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer id="about" className="scroll-mt-6 border-t border-slate-100 px-6 py-16">
        <div className={`mx-auto grid max-w-[1400px] gap-10 ${flow.layout === "web" ? "grid-cols-[1.4fr_1fr_1fr_1.2fr]" : ""}`}>
          <div>
            <p className="text-2xl font-semibold tracking-tight">Par2Play.</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Refining the art of golf for the modern player. Precision, community, and excellence in every stroke.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Resources</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Blog</li>
              <li>Newsletter</li>
              <li>Events</li>
            </ul>
          </div>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <p className="text-sm font-semibold">Stay updated</p>
            <p className="text-sm text-slate-500">Subscribe to get the latest tournament news and training tips.</p>
            <input
              required
              type="email"
              placeholder="Email"
              aria-label="Email"
              className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm"
            />
            <Button type="submit" className="rounded-full uppercase tracking-[0.14em] text-[11px]">
              Subscribe
            </Button>
            {subscribed && <p className="text-sm text-emerald-700">You're on the list. This prototype does not send.</p>}
          </form>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap justify-between gap-3 text-xs text-slate-400">
          <p>© 2024 Par2Play Golf Club. All rights reserved.</p>
          <p>Privacy policy · Terms of service</p>
        </div>
      </footer>
    </div>
  );
}
