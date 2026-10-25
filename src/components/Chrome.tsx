import { Button } from "@heroui/react";
import { useState, type ReactNode } from "react";
import { MembershipLink } from "./Cta";
import { useFlow } from "../state/flow";

export function Mark({ light = false }: { light?: boolean }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/logo.png`}
      alt="Par2Play"
      className={light ? "h-14 w-auto" : "h-14 w-auto rounded-xl bg-slate-950 px-2 py-1"}
    />
  );
}

export function ClubHeader({ light = false }: { light?: boolean }) {
  const flow = useFlow();
  const [open, setOpen] = useState(false);
  const link = light ? "text-white/90 hover:text-emerald-300" : "text-slate-600 hover:text-slate-900";
  const jump = (id?: string) => {
    setOpen(false);
    if (id) flow.goSection(id);
    else flow.goHome();
  };
  return (
    <header className="relative px-5 py-4 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" className="h-auto min-w-0 bg-transparent px-0" onPress={flow.goHome}>
          <Mark light={light} />
        </Button>
        {flow.layout === "web" ? (
          <nav className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.16em]">
            <button className={link} onClick={() => jump()} type="button">
              Home
            </button>
            <button className={link} onClick={() => jump("practice")} type="button">
              Practice
            </button>
            <button className={link} onClick={() => jump("swing-lab")} type="button">
              Swing lab
            </button>
            <button className={link} onClick={() => jump("lessons")} type="button">
              Lessons
            </button>
            <button className={link} onClick={() => jump("juniors")} type="button">
              Juniors
            </button>
            <button className={link} onClick={() => jump("pricing")} type="button">
              Pricing
            </button>
            <button className={link} onClick={() => jump("visit")} type="button">
              Visit
            </button>
          </nav>
        ) : (
          <Button variant="ghost" className={light ? "text-white" : ""} onPress={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </Button>
        )}
        {flow.layout === "web" && flow.step !== "landing" && (
          <MembershipLink className="h-9 px-4 text-[10px]">Join</MembershipLink>
        )}
      </div>
      {flow.layout === "mobile" && open && (
        <nav className={`mt-4 flex flex-col gap-3 text-[11px] font-medium uppercase tracking-[0.16em] ${light ? "text-white" : "text-slate-700"}`}>
          <button onClick={() => jump()} type="button">Home</button>
          <button onClick={() => jump("practice")} type="button">Practice</button>
          <button onClick={() => jump("swing-lab")} type="button">Swing lab</button>
          <button onClick={() => jump("lessons")} type="button">Lessons</button>
          <button onClick={() => jump("juniors")} type="button">Juniors</button>
          <button onClick={() => jump("pricing")} type="button">Pricing</button>
          <button onClick={() => jump("visit")} type="button">Visit</button>
        </nav>
      )}
    </header>
  );
}

export function ScreenFrame({
  children,
  footer,
  photo,
}: {
  children: ReactNode;
  footer?: ReactNode;
  photo?: string;
}) {
  const { layout } = useFlow();
  if (layout === "mobile") {
    return (
      <div className="flex h-full flex-col bg-white">
        <ClubHeader />
        <div className="flex-1 overflow-y-auto">
          {photo && <img src={photo} alt="" className="h-36 w-full object-cover object-center" />}
          <div className="px-5 py-6">{children}</div>
        </div>
        {footer && <div className="border-t border-slate-200 px-5 py-4">{footer}</div>}
      </div>
    );
  }
  return (
    <div className="bg-white">
      <ClubHeader />
      <div className={`grid min-h-[720px] ${photo ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex flex-col px-10 py-8">
          <div className="flex-1">{children}</div>
          {footer && <div className="pt-8">{footer}</div>}
        </div>
        {photo && <img src={photo} alt="" className="h-full min-h-[720px] w-full object-cover object-center" />}
      </div>
    </div>
  );
}
