import { useSyncExternalStore } from "react";
import { getSoundSnapshot, subscribeSound, toggleSound } from "../audio/soundtrack";
import { buttonFocus } from "./Cta";

export function SoundToggle() {
  const enabled = useSyncExternalStore(
    subscribeSound,
    () => getSoundSnapshot().enabled,
    () => false,
  );

  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={toggleSound}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-base font-semibold ${buttonFocus} ${
        enabled
          ? "bg-[#14D45E] text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852]"
          : "border-2 border-[#4b5563] bg-white text-[#0A0F0B] hover:bg-[#f3f6f1] active:bg-[#e6eee8]"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
        <path
          d="M2 6.2h2.2L7.4 3.2v9.6L4.2 9.8H2V6.2Z"
          fill="currentColor"
        />
        {enabled ? (
          <path
            d="M10 5.2a3.6 3.6 0 0 1 0 5.6M11.8 3.6a6 6 0 0 1 0 8.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M10.2 6.2 13.8 9.8M13.8 6.2 10.2 9.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )}
      </svg>
      Sound
    </button>
  );
}
