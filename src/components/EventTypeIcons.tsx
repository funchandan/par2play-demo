import type { ReactNode } from "react";
import type { EventTypeId } from "../data/events";

/** Same badge and greens as the membership step icons. */
const badge =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#10281A] text-[#14D45E]";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
      {children}
    </svg>
  );
}

function Glyph({ id }: { id: EventTypeId }) {
  switch (id) {
    case "holiday":
      return (
        <Mark>
          <path fill="currentColor" d="M16 4.5 18.2 12h7.3l-5.9 4.3 2.2 7.2L16 19.4 10.2 23.5l2.2-7.2L6.5 12h7.3Z" />
          <rect x="14.6" y="22" width="2.8" height="6" rx="1" fill="#7DFFB0" />
        </Mark>
      );
    case "small":
      return (
        <Mark>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <circle cx="21" cy="13.2" r="3.2" fill="#7DFFB0" />
          <path fill="currentColor" d="M5.5 24.5c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5Z" />
          <path fill="#7DFFB0" d="M17.2 24.5c.3-2.2 1.6-3.6 3.6-3.6 2 0 3.3 1.4 3.6 3.6Z" />
        </Mark>
      );
    case "large":
      return (
        <Mark>
          <circle cx="8.5" cy="11" r="3" fill="#7DFFB0" />
          <circle cx="16" cy="10" r="3.6" fill="currentColor" />
          <circle cx="23.5" cy="11" r="3" fill="#7DFFB0" />
          <path fill="currentColor" d="M9.2 25c.4-3.4 2.8-5.2 6.8-5.2s6.4 1.8 6.8 5.2Z" />
          <path fill="#7DFFB0" d="M3.8 25c.3-2.4 1.6-3.8 3.8-3.8 1.2 0 2.2.4 2.8 1.2-1 .8-1.6 1.8-1.8 2.6Z" />
          <path fill="#7DFFB0" d="M28.2 25c-.3-2.4-1.6-3.8-3.8-3.8-1.2 0-2.2.4-2.8 1.2 1 .8 1.6 1.8 1.8 2.6Z" />
        </Mark>
      );
    case "birthday":
      return (
        <Mark>
          <path fill="#7DFFB0" d="M16 5.2c.6 1.6-.2 2.6-1.2 3.2 1.8.2 2.8 1.4 2.6 3.2H14.6C14.2 9.4 15 7.6 16 5.2Z" />
          <rect x="6" y="12.5" width="20" height="5" rx="1.4" fill="currentColor" />
          <rect x="7" y="18.2" width="18" height="7.2" rx="1.6" fill="currentColor" />
          <rect x="7" y="20.6" width="18" height="2" fill="#7DFFB0" />
        </Mark>
      );
    case "company":
      return (
        <Mark>
          <rect x="6" y="8" width="20" height="16.5" rx="1.6" fill="currentColor" />
          <path fill="#7DFFB0" d="M6 8h20v3.2H6Z" />
          <rect x="10" y="14.2" width="3.2" height="3.2" rx="0.4" fill="#10281A" />
          <rect x="14.4" y="14.2" width="3.2" height="3.2" rx="0.4" fill="#10281A" />
          <rect x="18.8" y="14.2" width="3.2" height="3.2" rx="0.4" fill="#10281A" />
          <rect x="13.2" y="19.2" width="5.6" height="5.3" fill="#7DFFB0" />
        </Mark>
      );
    case "tournament":
      return (
        <Mark>
          <path fill="currentColor" d="M9 6h14v3.2a7 7 0 0 1-14 0Z" />
          <path fill="#7DFFB0" d="M9 8.2H6.2A3.2 3.2 0 0 0 9.4 12" />
          <path fill="#7DFFB0" d="M23 8.2h2.8A3.2 3.2 0 0 1 22.6 12" />
          <rect x="14.4" y="16.4" width="3.2" height="4.2" fill="currentColor" />
          <rect x="10" y="20.6" width="12" height="3.2" rx="1" fill="#7DFFB0" />
        </Mark>
      );
    case "team":
      return (
        <Mark>
          <circle cx="11" cy="10" r="3.2" fill="currentColor" />
          <circle cx="21" cy="10" r="3.2" fill="#7DFFB0" />
          <path fill="currentColor" d="M4.5 24c.5-4 3.2-6.2 6.5-6.2 2.2 0 4 .8 5 2.2-2.2.6-3.8 2-4.4 4Z" />
          <path fill="#7DFFB0" d="M27.5 24c-.5-4-3.2-6.2-6.5-6.2-2.2 0-4 .8-5 2.2 2.2.6 3.8 2 4.4 4Z" />
        </Mark>
      );
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function EventTypeIcon({ id }: { id: EventTypeId }) {
  return (
    <span className={badge}>
      <Glyph id={id} />
    </span>
  );
}
