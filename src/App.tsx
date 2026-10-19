import { Button } from "@heroui/react";
import { JourneyRail } from "./components/JourneyRail";
import { Landing } from "./screens/Landing";
import { Clubhouse } from "./screens/Clubhouse";
import { JourneyMap } from "./screens/JourneyMap";
import {
  BookStep,
  CadenceStep,
  ConfirmStep,
  ExperienceStep,
  GuestChoiceStep,
  IntentStep,
  PartyStep,
  PayStep,
  PlaceStep,
  PlanStep,
  RecommendStep,
  RegisterStep,
  TimeStep,
} from "./screens/FlowScreens";
import { FlowProvider, useFlow } from "./state/flow";

function StepView() {
  const { step } = useFlow();
  switch (step) {
    case "landing":
      return <Landing />;
    case "clubhouse":
      return <Clubhouse />;
    case "intent":
      return <IntentStep />;
    case "experience":
      return <ExperienceStep />;
    case "place":
    case "visit-place":
      return <PlaceStep />;
    case "cadence":
      return <CadenceStep />;
    case "visit-party":
      return <PartyStep />;
    case "recommend":
      return <RecommendStep />;
    case "register":
      return <RegisterStep />;
    case "plan":
      return <PlanStep />;
    case "book":
      return <BookStep />;
    case "visit-time":
      return <TimeStep />;
    case "guest-choice":
      return <GuestChoiceStep />;
    case "pay":
      return <PayStep />;
    case "confirm":
      return <ConfirmStep />;
    case "journey":
      return <JourneyMap />;
  }
}

function Shell() {
  const flow = useFlow();
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <p className="mr-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Par2Play review</p>
        <Button size="sm" variant={flow.layout === "mobile" ? "primary" : "outline"} onPress={() => flow.setLayout("mobile")}>
          Mobile
        </Button>
        <Button size="sm" variant={flow.layout === "web" ? "primary" : "outline"} onPress={() => flow.setLayout("web")}>
          Web
        </Button>
        <Button size="sm" variant="outline" onPress={flow.openMap}>
          Journey map
        </Button>
        {flow.layout === "mobile" && (
          <Button size="sm" variant="outline" onPress={() => flow.setNotesOpen(true)}>
            Journey notes
          </Button>
        )}
        <Button size="sm" variant="ghost" onPress={flow.reset}>
          Start over
        </Button>
      </div>
      {flow.layout === "mobile" ? (
        <div className="flex justify-center px-4 py-6">
          <div
            className="phone-frame relative overflow-hidden rounded-[36px] border-8 border-slate-950 bg-white shadow-2xl"
            data-testid="layout"
            data-layout="mobile"
          >
            <div className="h-full">
              <StepView />
            </div>
            {flow.notesOpen && (
              <div className="absolute inset-x-0 bottom-0 top-14 z-30 flex flex-col rounded-t-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Journey notes</p>
                  <Button size="sm" variant="ghost" onPress={() => flow.setNotesOpen(false)}>
                    Close
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <JourneyRail />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)_320px] gap-4 px-4 py-4" data-testid="layout" data-layout="web">
          <div className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm">
            <StepView />
          </div>
          <div className="sticky top-20 h-fit max-h-[calc(100vh-96px)] overflow-y-auto rounded-3xl bg-white shadow-sm">
            <JourneyRail />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FlowProvider>
      <Shell />
    </FlowProvider>
  );
}
