import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  MessageCircle,
  Mail,
  ArrowRight,
  Pencil,
  X,
} from "lucide-react";
import Reveal from "./Reveal.jsx";
import { business, isFilled } from "../data/business.js";
import { passengerLimits } from "../data/fares.js";
import { tourMeta } from "../data/tours.js";

/** Today's date in the *local* timezone (toISOString() would shift it to UTC). */
const todayISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const empty = {
  serviceType: "",
  fullName: "",
  contact: "",
  email: "",
  date: "",
  time: "",
  flightNumber: "",
  passengers: "2",
  luggage: "0",
  pickup: "",
  dropOff: "",
  notes: "",
};

const serviceOptions = business.services.map((s) => ({ id: s.id, title: s.title }));

const inputCls = (err) =>
  `w-full rounded-lg border-2 px-4 py-3 text-sm text-ink placeholder:text-mute/80 transition-colors ${
    err
      ? "border-coraldark bg-coraldark/[0.06]"
      : "border-ink/25 bg-sand/70 hover:border-ink/50 focus:border-ink"
  }`;

function Field({ id, label, required, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-ink/70">
        {label}
        {required && (
          <span className="ml-1 text-coraldark" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-bold text-coraldark">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mute">{hint}</p>
      ) : null}
    </div>
  );
}

function validate(values, stops) {
  const e = {};
  if (!values.serviceType) e.serviceType = "Choose the service you need.";
  if (values.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (values.contact.replace(/\D/g, "").length < 7)
    e.contact = "Enter a phone or WhatsApp number we can reply to.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    e.email = "Enter a valid email address.";
  if (!values.date) e.date = "Choose a date.";
  else if (values.date < todayISO()) e.date = "Choose today or a future date.";
  if (!values.time) e.time = "Choose a time.";
  if (!values.pickup.trim()) e.pickup = "Where should Jimmy pick you up?";
  if (!values.dropOff.trim()) e.dropOff = "Where are you going to?";
  const pax = Number(values.passengers);
  if (!pax || pax < passengerLimits.min || pax > passengerLimits.max)
    e.passengers = `Passengers must be between ${passengerLimits.min} and ${passengerLimits.max}.`;
  if (values.serviceType === "airport" && !values.flightNumber.trim())
    e.flightNumber = "Flight number helps Jimmy track your arrival.";
  if (values.serviceType === "tours" && stops.length === 0)
    e.tourStops = "Pick at least one tour stop, or choose a service type instead.";
  return e;
}

export default function BookingForm({ prefill }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [stops, setStops] = useState([]);
  const [tourLabel, setTourLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const waReady = isFilled(business.whatsapp);
  const mailReady = isFilled(business.email);

  // Apply a pre-filled request coming from the estimator or the tour selector.
  useEffect(() => {
    if (!prefill) return;
    setSummary("");
    setNotice("");
    setValues((prev) => {
      const next = { ...prev };
      if (prefill.serviceType) next.serviceType = prefill.serviceType;
      if (prefill.pickupLabel) next.pickup = prefill.pickupLabel;
      if (prefill.dropOffLabel) next.dropOff = prefill.dropOffLabel;
      if (prefill.passengers) next.passengers = String(prefill.passengers);
      if (prefill.notes) {
        next.notes = next.notes.includes(prefill.notes)
          ? next.notes
          : next.notes
            ? `${next.notes}\n${prefill.notes}`
            : prefill.notes;
      }
      return next;
    });
    if (prefill.tourStops) {
      setStops(prefill.tourStops);
      setTourLabel(prefill.tourLabel || "");
    }
    const timer = setTimeout(() => {
      document.getElementById("fullName")?.focus({ preventScroll: true });
    }, 550);
    return () => clearTimeout(timer);
  }, [prefill]);

  const set = (key) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const removeStop = (id) => setStops((prev) => prev.filter((s) => s !== id));

  const buildSummary = (v) => {
    const service = serviceOptions.find((s) => s.id === v.serviceType)?.title || "-";
    const lines = [
      `${business.name.toUpperCase()} — BOOKING REQUEST`,
      "",
      `Service: ${service}`,
      `Name: ${v.fullName.trim()}`,
      `WhatsApp/Phone: ${v.contact.trim()}`,
      `Email: ${v.email.trim()}`,
      `Date: ${v.date}  Time: ${v.time}`,
    ];
    if (v.serviceType !== "delivery" && v.flightNumber.trim())
      lines.push(`Flight number: ${v.flightNumber.trim()}`);
    lines.push(`Passengers: ${v.passengers}  Luggage: ${v.luggage}`);
    lines.push(`Pickup: ${v.pickup.trim()}`);
    lines.push(`Drop-off: ${v.dropOff.trim()}`);
    if (tourLabel || stops.length) {
      lines.push(
        `Tour: ${tourLabel || "Custom route"}${
          stops.length
            ? " — " + stops.map((id) => tourMeta.byId[id]?.name).filter(Boolean).join(", ")
            : ""
        }`
      );
    }
    if (v.notes.trim()) lines.push("", "Notes:", v.notes.trim());
    return lines.join("\n");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(values, stops);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      const el =
        document.getElementById(first === "tourStops" ? "tour-stop-heading" : first);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el && typeof el.focus === "function") el.focus({ preventScroll: true });
      return;
    }
    setNotice("");
    setSummary(buildSummary(values));
    requestAnimationFrame(() =>
      document.getElementById("booking-confirmation")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setNotice("Copying is blocked by the browser — select the text above instead.");
    }
  };

  const whatsappHref = `https://wa.me/${business.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(summary)}`;
  const emailHref = `mailto:${business.email}?subject=${encodeURIComponent(
    `Booking request — ${values.fullName || ""} — ${values.date || ""}`
  )}&body=${encodeURIComponent(summary)}`;

  const flightShown = values.serviceType === "airport" || values.serviceType === "cruise";

  return (
    <section id="booking" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-ocean">03 — Booking request</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
            Send {business.owner} your request,{" "}
            <span className="font-normal italic text-coraldark">in two taps.</span>
          </h2>
          <p className="lede mt-5 text-ink/75">
            Fill the form, review the summary, then hand it to WhatsApp or your
            email app. No account, no server — everything stays in your browser
            until you send it.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* side rail */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="border-2 border-ink bg-cream p-6 shadow-[10px_10px_0_0_rgba(5,42,46,0.12)]">
                <p className="eyebrow text-mute">Direct line</p>
                <p className="display mt-2 text-2xl">{business.name}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {business.addressLine}
                </p>
                <dl className="mt-5 space-y-3 border-t border-dashed border-ink/30 pt-5 text-sm">
                  <div>
                    <dt className="eyebrow text-mute">Phone</dt>
                    <dd className="mt-1 font-bold">{business.phone}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-mute">WhatsApp</dt>
                    <dd className="mt-1 font-bold">{business.whatsapp}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-mute">Email</dt>
                    <dd className="mt-1 font-bold">{business.email}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-mute">
                  Placeholders — drop the real contact details into
                  src/data/business.js and every link on this page updates.
                </p>
              </div>

              <ol className="mt-6 space-y-4">
                {business.steps.slice(0, 3).map((step) => (
                  <li key={step.id} className="flex gap-3">
                    <span className="display tabular text-lg text-coral">
                      {String(step.id).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-ink/75">
                      <strong className="font-bold text-ink">{step.title}.</strong>{" "}
                      {step.body}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* form / confirmation */}
          <div className="lg:col-span-8">
            {summary ? (
              <Reveal
                as="div"
                id="booking-confirmation"
                tabIndex={-1}
                className="border-2 border-ink bg-cream p-5 shadow-[12px_12px_0_0_rgba(5,42,46,0.14)] sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-ocean">Request prepared</p>
                    <h3 className="display mt-2 text-2xl sm:text-3xl">
                      Ready to send, {values.fullName.split(" ")[0]}.
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">
                      Review the summary, then choose how to send it. Imperial
                      Taxi confirms availability and the final fare by reply.
                    </p>
                  </div>
                  <span className="stamp px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-coraldark">
                    Demo · nothing sent yet
                  </span>
                </div>

                <pre className="tabular mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border-2 border-ink/20 bg-sand p-4 text-[0.8rem] leading-relaxed text-ink">
                  {summary}
                </pre>

                <div className="mt-6 flex flex-wrap gap-3">
                  {waReady ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1f8f5f] px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-ink"
                    >
                      <MessageCircle size={17} aria-hidden="true" />
                      Send via WhatsApp
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          `Add Jimmy's WhatsApp number in src/data/business.js (currently "${business.whatsapp}") to enable the WhatsApp button.`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-[#1f8f5f]/45 px-6 py-3.5 text-sm font-bold text-cream/85 transition-colors hover:bg-[#1f8f5f]/70"
                    >
                      <MessageCircle size={17} aria-hidden="true" />
                      Send via WhatsApp
                    </button>
                  )}

                  {mailReady ? (
                    <a
                      href={emailHref}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-cream"
                    >
                      <Mail size={17} aria-hidden="true" />
                      Send via email
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          `Add Jimmy's email address in src/data/business.js (currently "${business.email}") to enable the email button.`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink/40 px-6 py-3.5 text-sm font-bold text-ink/70 transition-colors hover:border-ink"
                    >
                      <Mail size={17} aria-hidden="true" />
                      Send via email
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={copySummary}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink/25 px-6 py-3.5 text-sm font-bold text-ink/80 transition-colors hover:border-ink"
                  >
                    {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                    {copied ? "Copied" : "Copy summary"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSummary("")}
                    className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-bold text-ink/60 underline decoration-coral decoration-2 underline-offset-4 transition-colors hover:text-ink"
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Edit request
                  </button>
                </div>

                {notice && (
                  <p
                    role="status"
                    className="mt-5 rounded-lg border-2 border-gold bg-gold/15 px-4 py-3 text-sm font-medium text-ink"
                  >
                    {notice}
                  </p>
                )}
              </Reveal>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="border-2 border-ink bg-cream p-5 shadow-[12px_12px_0_0_rgba(5,42,46,0.14)] sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      id="serviceType"
                      label="Service type"
                      required
                      error={errors.serviceType}
                    >
                      <select
                        id="serviceType"
                        value={values.serviceType}
                        onChange={set("serviceType")}
                        aria-invalid={!!errors.serviceType}
                        aria-describedby={errors.serviceType ? "serviceType-error" : undefined}
                        className={inputCls(errors.serviceType)}
                      >
                        <option value="">Choose a service…</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field id="fullName" label="Full name" required error={errors.fullName}>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={values.fullName}
                      onChange={set("fullName")}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      className={inputCls(errors.fullName)}
                    />
                  </Field>

                  <Field
                    id="contact"
                    label="WhatsApp / phone"
                    required
                    error={errors.contact}
                    hint="Include the country code."
                  >
                    <input
                      id="contact"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 246 000 0000"
                      value={values.contact}
                      onChange={set("contact")}
                      aria-invalid={!!errors.contact}
                      aria-describedby={errors.contact ? "contact-error" : undefined}
                      className={inputCls(errors.contact)}
                    />
                  </Field>

                  <Field id="email" label="Email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={inputCls(errors.email)}
                    />
                  </Field>

                  <Field
                    id="date"
                    label="Date"
                    required
                    error={errors.date}
                    hint="Local Barbados time."
                  >
                    <input
                      id="date"
                      type="date"
                      min={todayISO()}
                      value={values.date}
                      onChange={set("date")}
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      className={inputCls(errors.date)}
                    />
                  </Field>

                  <Field id="time" label="Time" required error={errors.time}>
                    <input
                      id="time"
                      type="time"
                      value={values.time}
                      onChange={set("time")}
                      aria-invalid={!!errors.time}
                      aria-describedby={errors.time ? "time-error" : undefined}
                      className={inputCls(errors.time)}
                    />
                  </Field>

                  {flightShown && (
                    <Field
                      id="flightNumber"
                      label="Flight number"
                      required={values.serviceType === "airport"}
                      error={errors.flightNumber}
                      hint="Only shown for airport and cruise transfers."
                    >
                      <input
                        id="flightNumber"
                        type="text"
                        placeholder="e.g. B6 1234"
                        value={values.flightNumber}
                        onChange={set("flightNumber")}
                        aria-invalid={!!errors.flightNumber}
                        aria-describedby={errors.flightNumber ? "flightNumber-error" : undefined}
                        className={inputCls(errors.flightNumber)}
                      />
                    </Field>
                  )}

                  <Field
                    id="passengers"
                    label="Passengers"
                    required
                    error={errors.passengers}
                    hint="1–4 sedan, 5–8 minivan."
                  >
                    <select
                      id="passengers"
                      value={values.passengers}
                      onChange={set("passengers")}
                      aria-invalid={!!errors.passengers}
                      aria-describedby={errors.passengers ? "passengers-error" : undefined}
                      className={inputCls(errors.passengers)}
                    >
                      {Array.from({ length: passengerLimits.max }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} passenger{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="luggage" label="Luggage pieces">
                    <input
                      id="luggage"
                      type="number"
                      min={0}
                      max={20}
                      value={values.luggage}
                      onChange={set("luggage")}
                      className={inputCls(false)}
                    />
                  </Field>

                  <Field id="pickup" label="Pickup" required error={errors.pickup}>
                    <input
                      id="pickup"
                      type="text"
                      placeholder="Address, resort or airport"
                      value={values.pickup}
                      onChange={set("pickup")}
                      aria-invalid={!!errors.pickup}
                      aria-describedby={errors.pickup ? "pickup-error" : undefined}
                      className={inputCls(errors.pickup)}
                    />
                  </Field>

                  <Field id="dropOff" label="Drop-off" required error={errors.dropOff}>
                    <input
                      id="dropOff"
                      type="text"
                      placeholder="Address, resort or zone"
                      value={values.dropOff}
                      onChange={set("dropOff")}
                      aria-invalid={!!errors.dropOff}
                      aria-describedby={errors.dropOff ? "dropOff-error" : undefined}
                      className={inputCls(errors.dropOff)}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <p id="tour-stop-heading" className="eyebrow text-ink/70" tabIndex={-1}>
                        Selected tour stops
                      </p>
                      {stops.length > 0 && (
                        <span className="text-xs font-bold text-ocean">
                          {tourLabel ? `${tourLabel} · ` : ""}
                          {stops.length} stop{stops.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    {errors.tourStops && (
                      <p role="alert" className="mt-1.5 text-xs font-bold text-coraldark">
                        {errors.tourStops}
                      </p>
                    )}
                    {stops.length === 0 ? (
                      <p className="mt-2 rounded-lg border-2 border-dashed border-ink/25 px-4 py-3 text-sm text-mute">
                        Nothing selected yet — choose a preset or build your own
                        in the tour section above.
                      </p>
                    ) : (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {stops.map((id) => (
                          <li
                            key={id}
                            className="flex items-center gap-2 rounded-full border-2 border-coral bg-coral/15 px-3 py-1.5 text-sm font-medium text-ink"
                          >
                            {tourMeta.byId[id]?.name}
                            <button
                              type="button"
                              onClick={() => removeStop(id)}
                              aria-label={`Remove ${tourMeta.byId[id]?.name}`}
                              className="grid h-5 w-5 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-cream"
                            >
                              <X size={12} aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Field id="notes" label="Notes" hint="Flight delay, child seat, luggage size, special requests…">
                      <textarea
                        id="notes"
                        rows={4}
                        value={values.notes}
                        onChange={set("notes")}
                        className={inputCls(false)}
                        placeholder="Anything Jimmy should know before your trip"
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-dashed border-ink/30 pt-6">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 rounded-full bg-coral px-7 py-4 text-sm font-bold text-ink transition-all hover:bg-gold hover:shadow-[0_16px_34px_-18px_rgba(255,106,69,1)]"
                  >
                    Prepare my request
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                  <p className="text-xs leading-relaxed text-mute">
                    Required fields are marked{" "}
                    <span className="text-coraldark">*</span>. Nothing is sent
                    until you choose WhatsApp or email.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
