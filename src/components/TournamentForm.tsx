import { useState, type FormEvent } from "react";
import { buttonFocus } from "./Cta";
import { trackLead } from "../analytics/track";
import { ENQUIRY, NAP } from "../data/business";

export function TournamentForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "held" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Add a valid email.");
      return;
    }
    setError("");
    const payload = { email: value, interest: "tournament" };

    if (ENQUIRY.endpoint.trim()) {
      setStatus("sending");
      try {
        const response = await fetch(ENQUIRY.endpoint.trim(), {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          trackLead("tournament");
          setStatus("sent");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    if (ENQUIRY.email.trim()) {
      const body = encodeURIComponent(`Email: ${payload.email}\nInterest: tournament\n`);
      window.location.href = `mailto:${ENQUIRY.email.trim()}?subject=${encodeURIComponent("Par2Play tournament")}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("held");
  }

  if (status === "sent" || status === "held") {
    return (
      <p className="text-base text-[#0A0F0B]" role="status">
        {status === "sent"
          ? "Sent. We’ll reply soon."
          : `Thanks! Leagues open soon, so call us on ${NAP.phoneDisplay} to reserve a spot.`}
      </p>
    );
  }

  return (
    <form className="mx-auto grid max-w-md gap-3 text-left" onSubmit={onSubmit} noValidate>
      <label className="block text-base font-semibold text-[#0A0F0B]" htmlFor="tournament-email">
        Email
        <input
          id="tournament-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "tournament-email-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
        className="aa-focus mt-2 w-full border-2 border-[#4b5563] bg-white px-3 py-3 text-base font-normal text-[#0A0F0B] outline-none placeholder:text-[#4b5563] focus-visible:border-[#0A0F0B]"
        />
      </label>
      {error && (
        <p id="tournament-email-error" className="text-base text-red-700">
          {error}
        </p>
      )}
      {status === "error" && (
        <p className="text-base text-red-700" role="alert">
          We couldn’t send that from the site. Call {NAP.phoneDisplay} to reserve a spot.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-2 inline-flex min-h-11 w-fit items-center justify-self-center rounded-full bg-[#14D45E] px-5 text-base font-semibold text-[#0A0F0B] hover:bg-[#3dff7c] active:bg-[#0fb852] disabled:bg-[#c8f5d8] disabled:text-[#0A0F0B] ${buttonFocus}`}
      >
        {status === "sending" ? "Sending" : "Reserve your tournament spot"}
      </button>
    </form>
  );
}
