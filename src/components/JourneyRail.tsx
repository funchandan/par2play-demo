import { Chip, Separator } from "@heroui/react";
import { offerDetail, offerName, objectiveFor, resolveOffer, screenLine, stageFor, titleFor } from "../data/journey";
import { useFlow } from "../state/flow";

export function JourneyRail() {
  const flow = useFlow();
  const offer = resolveOffer(flow.offerState);
  const stage = stageFor(flow.step);
  const visible = offer.visible
    ? `${offerName(offer.visible)}. ${offerDetail(offer.visible, flow.plan)}`
    : "No offer on this step.";
  const suppressed = offer.suppressed
    ? `${offerName(offer.suppressed)}. ${offerDetail(offer.suppressed, flow.plan)}`
    : "Nothing is held back.";

  return (
    <aside className="flex flex-col gap-4 p-5 text-sm text-slate-600" data-testid="journey-rail">
      <div>
        <Chip color="accent" variant="soft" size="sm">
          <Chip.Label>{stage}</Chip.Label>
        </Chip>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{titleFor(flow.step)}</h2>
        <p className="mt-2 leading-relaxed">{objectiveFor(flow.step)}</p>
      </div>
      <Separator />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">On the screen</p>
        <p className="mt-2 leading-relaxed">{screenLine(flow.offerState)}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Offer</p>
        <p className="mt-2 leading-relaxed" data-testid="visible-offer">
          {visible}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Held back</p>
        <p className="mt-2 leading-relaxed" data-testid="suppressed-offer">
          {suppressed}
        </p>
      </div>
      <Separator />
      <p className="text-xs leading-relaxed text-slate-500">
        One offer shows on the screen. This rail names the one that waits. Nothing is sent.
      </p>
    </aside>
  );
}
