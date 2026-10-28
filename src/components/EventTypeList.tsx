import { EventTypeIcon } from "./EventTypeIcons";
import { EVENT_TYPES } from "../data/events";

export function EventTypeList() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-4 @3xl:grid-cols-4">
      {EVENT_TYPES.map((item) => (
        <li key={item.id} className="flex items-start gap-2">
          <EventTypeIcon id={item.id} />
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight text-[#0A0F0B]">{item.label}</p>
            <p className="mt-1 text-base leading-snug text-[#0A0F0B]">{item.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
