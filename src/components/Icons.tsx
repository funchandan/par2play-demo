type IconName = "screen" | "coach" | "room" | "calendar" | "person" | "seats" | "check";

const paths: Record<IconName, string> = {
  screen: "M4 6.5h16v9H4zM8 18.5h8",
  coach: "M12 4.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4zM7 19.5v-2.2c0-2 2.2-3.3 5-3.3s5 1.3 5 3.3v2.2M16.5 8.2l2.2-1.2M7.5 8.2 5.3 7",
  room: "M5 19.5V9.2L12 5l7 4.2v10.3M9.5 19.5v-5h5v5",
  calendar: "M6 5.5h12v13H6zM6 9.5h12M9 3.8v3.2M15 3.8v3.2",
  person: "M12 5a2.4 2.4 0 1 0 0 4.8A2.4 2.4 0 0 0 12 5zM6.8 19c.6-2.6 2.6-4 5.2-4s4.6 1.4 5.2 4",
  seats: "M5 15.5h14M7 15.5V9.2h10v6.3M8.5 9.2V6.5h7v2.7",
  check: "M6 12.5l3.5 3.5L18 8",
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
