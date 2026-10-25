import { useState, type FormEvent } from "react";
import { ENQUIRY, ENQUIRY_INTERESTS, NAP, type EnquiryInterest } from "../data/business";

type Fields = {
  name: string;
  email: string;
  phone: string;
  interest: EnquiryInterest | "";
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", email: "", phone: "", interest: "", message: "" };

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) errors.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Add a valid email.";
  const digits = fields.phone.replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Add a phone number.";
  if (!fields.interest) errors.interest = "Choose one.";
  if (fields.message.trim().length < 2) errors.message = "Add a short note.";
  return errors;
}

function isInterest(value: string): value is EnquiryInterest {
  return ENQUIRY_INTERESTS.some((item) => item.id === value);
}

export function EnquiryForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "held" | "error">("idle");

  const set = (key: keyof Fields, value: string) => {
    setFields((current) => {
      switch (key) {
        case "name":
          return { ...current, name: value };
        case "email":
          return { ...current, email: value };
        case "phone":
          return { ...current, phone: value };
        case "message":
          return { ...current, message: value };
        case "interest":
          return { ...current, interest: isInterest(value) ? value : "" };
        default: {
          const exhaustive: never = key;
          return exhaustive;
        }
      }
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    if (Object.keys(next).length > 0 || !fields.interest) return;

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      interest: fields.interest,
      message: fields.message.trim(),
    };

    if (ENQUIRY.endpoint.trim()) {
      setStatus("sending");
      try {
        const response = await fetch(ENQUIRY.endpoint.trim(), {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          setStatus("error");
          return;
        }
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    if (ENQUIRY.email.trim()) {
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nInterest: ${payload.interest}\n\n${payload.message}`,
      );
      window.location.href = `mailto:${ENQUIRY.email.trim()}?subject=${encodeURIComponent("Par2Play enquiry")}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("held");
  };

  if (status === "sent" || status === "held") {
    return (
      <p className="max-w-md text-lg text-slate-900" role="status">
        {status === "sent" ? "Sent. We’ll reply soon." : "Noted here. Enquiry inbox: TODO. Nothing was sent."}
      </p>
    );
  }

  const fieldClass =
    "mt-2 w-full border-b border-slate-300 bg-transparent py-3 text-base outline-none focus:border-slate-950";

  return (
    <form className="grid max-w-xl gap-6" onSubmit={onSubmit} noValidate>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Name
        <input
          className={fieldClass}
          name="name"
          autoComplete="name"
          value={fields.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "enquiry-name-error" : undefined}
          onChange={(event) => set("name", event.target.value)}
        />
        {errors.name && (
          <span id="enquiry-name-error" className="mt-2 block text-xs normal-case tracking-normal text-red-700">
            {errors.name}
          </span>
        )}
      </label>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Email
        <input
          className={fieldClass}
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "enquiry-email-error" : undefined}
          onChange={(event) => set("email", event.target.value)}
        />
        {errors.email && (
          <span id="enquiry-email-error" className="mt-2 block text-xs normal-case tracking-normal text-red-700">
            {errors.email}
          </span>
        )}
      </label>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Phone
        <input
          className={fieldClass}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
          onChange={(event) => set("phone", event.target.value)}
        />
        {errors.phone && (
          <span id="enquiry-phone-error" className="mt-2 block text-xs normal-case tracking-normal text-red-700">
            {errors.phone}
          </span>
        )}
      </label>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Interest
        <select
          className={fieldClass}
          name="interest"
          value={fields.interest}
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? "enquiry-interest-error" : undefined}
          onChange={(event) => set("interest", event.target.value)}
        >
          <option value="">Choose</option>
          {ENQUIRY_INTERESTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.interest && (
          <span id="enquiry-interest-error" className="mt-2 block text-xs normal-case tracking-normal text-red-700">
            {errors.interest}
          </span>
        )}
      </label>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Message
        <textarea
          className={`${fieldClass} min-h-28 resize-y`}
          name="message"
          value={fields.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "enquiry-message-error" : undefined}
          onChange={(event) => set("message", event.target.value)}
        />
        {errors.message && (
          <span id="enquiry-message-error" className="mt-2 block text-xs normal-case tracking-normal text-red-700">
            {errors.message}
          </span>
        )}
      </label>
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          Could not send. Call {NAP.phoneDisplay}.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex h-12 w-fit items-center rounded-full bg-[#14D45E] px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#06210f] disabled:opacity-60"
      >
        {status === "sending" ? "Sending" : "Send"}
      </button>
    </form>
  );
}
