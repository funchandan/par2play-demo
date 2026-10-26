import type { ReactNode } from "react";

export type MembershipStepId = "often" | "progress" | "day";

/**
 * Badge is #10281A. Both greens clear 3:1 against it
 * (#14D45E ≈ 7.9:1, #7DFFB0 ≈ 12.5:1). Dark cutouts sit on the brand green.
 */
const badge =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#10281A] text-[#14D45E]";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      {children}
    </svg>
  );
}

function Glyph({ id }: { id: MembershipStepId }) {
  switch (id) {
    case "often":
      return (
        <Mark>
          <path
            d="M16.2 5.2a10.2 10.2 0 1 1-7.4 17"
            fill="none"
            stroke="#7DFFB0"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path fill="#7DFFB0" d="M7.6 20.2 4.8 26.2 11.2 23.6Z" />
          <circle cx="16" cy="16.2" r="5.4" fill="currentColor" />
          <circle cx="14.3" cy="14.8" r="0.85" fill="#10281A" />
          <circle cx="17.2" cy="15.3" r="0.75" fill="#10281A" />
          <circle cx="15.5" cy="17.6" r="0.75" fill="#10281A" />
        </Mark>
      );
    case "progress":
      return (
        <Mark>
          <rect x="4" y="18" width="5" height="8" rx="1.4" fill="#7DFFB0" />
          <rect x="11.2" y="13.2" width="5" height="12.8" rx="1.4" fill="#7DFFB0" />
          <rect x="18.4" y="8.2" width="5" height="17.8" rx="1.4" fill="currentColor" />
          <circle cx="26.2" cy="7.2" r="2.5" fill="currentColor" />
          <path
            d="M6.2 16.6c4.2-4.6 9.2-6.4 16.2-5.2"
            fill="none"
            stroke="#7DFFB0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Mark>
      );
    case "day":
      return (
        <Mark>
          <circle cx="16" cy="18.6" r="8.1" fill="currentColor" />
          <circle cx="16" cy="18.6" r="1.45" fill="#10281A" />
          <path d="M16 18.6V13.2" stroke="#10281A" strokeWidth="2.15" strokeLinecap="round" />
          <path d="M16 18.8 20.6 21.2" stroke="#10281A" strokeWidth="2.15" strokeLinecap="round" />
          <path fill="#7DFFB0" d="M15.15 2.6h1.7V6.8h-1.7z" />
          <path fill="#7DFFB0" d="M16.85 2.6h5.6L20.6 4.8l1.85 2.2h-5.6z" />
        </Mark>
      );
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function MembershipStepIcon({ id }: { id: MembershipStepId }) {
  return (
    <span className={badge}>
      <Glyph id={id} />
    </span>
  );
}
