import { useSyncExternalStore } from "react";
import { getSoundSnapshot, subscribeSound, toggleSound } from "../audio/soundtrack";
import { buttonFocus } from "./Cta";

export function SoundToggle({ className = "" }: { className?: string }) {
  const live = useSyncExternalStore(
    subscribeSound,
    () => getSoundSnapshot().live,
    () => false,
  );

  return (
    <button
      type="button"
      aria-label="Sound"
      aria-pressed={live}
      data-sound-toggle=""
      onClick={toggleSound}
      className={`inline-flex size-11 items-center justify-center rounded-full ${buttonFocus} ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
        <path d="M2 6.2h2.2L7.4 3.2v9.6L4.2 9.8H2V6.2Z" fill="currentColor" />
        {live ? (
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
    </button>
  );
}
