import { Button } from "@heroui/react";
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
      <div className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-white px-4 py-3">
        <Button size="sm" variant={flow.layout === "mobile" ? "primary" : "outline"} onPress={() => flow.setLayout("mobile")}>
          Mobile
        </Button>
        <Button size="sm" variant={flow.layout === "web" ? "primary" : "outline"} onPress={() => flow.setLayout("web")}>
          Desktop
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
          </div>
        </div>
      ) : (
        <div className="bg-white" data-testid="layout" data-layout="web">
          <StepView />
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
