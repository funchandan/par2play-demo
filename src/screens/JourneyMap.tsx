import { Button, Chip, Separator } from "@heroui/react";
import { ClubHeader } from "../components/Chrome";
import { JOURNEY_MAP } from "../data/journey";
import { useFlow } from "../state/flow";

export function JourneyMap() {
  const flow = useFlow();
  return (
    <div className={flow.layout === "mobile" ? "flex h-full flex-col bg-white" : "bg-white"}>
      <ClubHeader />
      <div className={flow.layout === "mobile" ? "flex-1 overflow-y-auto px-5 py-6" : "px-10 py-8"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Strategy</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tighter">Journey map</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Every stage, the line on the screen, the message that would send, and the one offer. The live rail follows the step you are in.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onPress={flow.closeMap}>Back to the step</Button>
        </div>
        <div className="mt-8 space-y-6">
          {JOURNEY_MAP.map((row) => (
            <article key={`${row.path}-${row.title}`} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Chip size="sm" variant="soft">
                  <Chip.Label>{row.path}</Chip.Label>
                </Chip>
                <Chip color="accent" size="sm" variant="soft">
                  <Chip.Label>{row.stage}</Chip.Label>
                </Chip>
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{row.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{row.objective}</p>
              <Separator className="my-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">On the screen</p>
              <p className="mt-1 text-sm leading-relaxed">{row.screen}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Message</p>
              <p className="mt-1 text-sm leading-relaxed">{row.message}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Offer</p>
              <p className="mt-1 text-sm leading-relaxed">{row.offer}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
