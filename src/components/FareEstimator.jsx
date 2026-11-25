import { useEffect, useRef, useState } from "react";
import { ArrowRight, Minus, Plus, Check } from "lucide-react";
import Reveal from "./Reveal.jsx";
import {
  pickupPoints,
  dropZones,
  rateCard,
  passengerLimits,
  vehicleForPassengers,
  calculateFare,
  convertCurrency,
} from "../data/fares.js";
import { business } from "../data/business.js";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target) {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;
    if (prefersReducedMotion()) {
      currentRef.current = target;
      setValue(target);
      return;
    }
    let frame;
    const start = performance.now();
    const duration = 420;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(from + (target - from) * eased);
      currentRef.current = next;
      setValue(next);
      if (p < 1) frame = requestAnimationFrame(tick);
      else currentRef.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

const zoneById = Object.fromEntries(dropZones.map((z) => [z.id, z]));
const pickupById = Object.fromEntries(pickupPoints.map((p) => [p.id, p]));

export default function FareEstimator({ onRequest }) {
  const [pickup, setPickup] = useState("bgi");
  const [zone, setZone] = useState("south");
  const [passengers, setPassengers] = useState(2);
  const [tripType, setTripType] = useState("one-way");
  const [currency, setCurrency] = useState("USD");

  const usd = calculateFare({ pickup, dropOff: zone, passengers, tripType });
  const converted = convertCurrency(usd ?? 0, currency);
  const animated = useCountUp(converted);
  const vehicle = vehicleForPassengers(passengers);
  const vehicleData =
    business.vehicles.find((v) => v.id === vehicle) || business.vehicles[0];

  const setPassengersClamped = (next) =>
    setPassengers(Math.min(passengerLimits.max, Math.max(passengerLimits.min, next)));

  const handleRequest = () => {
    onRequest({
      nonce: Date.now(),
      serviceType:
        pickup === "bgi"
          ? "airport"
          : pickup === "cruise"
            ? "cruise"
            : "scheduled",
      pickupLabel: pickupById[pickup].label,
      dropOffLabel: `${zoneById[zone].label} (${zoneById[zone].examples})`,
      passengers,
      tripType,
      currency,
      estimatedFare: `${currency} ${converted} (demo rate)`,
      vehicle: vehicleData.name,
      from: "estimator",
    });
  };

  return (
    <section id="estimator" className="relative bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-ocean">01 — Fare estimator</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
            A fare card, <span className="italic font-normal text-coraldark">not a guess.</span>
          </h2>
          <p className="lede mt-5 text-ink/75">
            Pick your pickup, choose a drop-off zone, set your passengers. The
            ticket on the right updates instantly in USD or BBD.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="relative border-2 border-ink bg-cream shadow-[12px_12px_0_0_rgba(5,42,46,0.14)]">
            <div className="grid md:grid-cols-[1.45fr_1px_1fr]">
              {/* ---- face of the ticket ---------------------------------- */}
              <div className="p-5 sm:p-7 lg:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-mute">Passenger fare card</p>
                    <p className="display mt-1 text-xl">
                      Imperial Taxi Services
                    </p>
                  </div>
                  <span className="stamp px-2.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-coraldark">
                    Demo rate
                  </span>
                </div>

                <fieldset className="mt-7">
                  <legend className="eyebrow text-ink/70">Pickup point</legend>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {pickupPoints.map((point) => (
                      <label
                        key={point.id}
                        className={`group relative flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral has-[:focus-visible]:ring-offset-2 ${
                          pickup === point.id
                            ? "border-ink bg-ink text-cream"
                            : "border-ink/25 bg-sand/60 text-ink hover:border-ink/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickup"
                          value={point.id}
                          checked={pickup === point.id}
                          onChange={(e) => setPickup(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${
                            pickup === point.id ? "border-gold" : "border-ink/40"
                          }`}
                        >
                          {pickup === point.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          )}
                        </span>
                        <span className="font-medium">{point.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="zone" className="eyebrow block text-ink/70">
                      Drop-off zone
                    </label>
                    <select
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="select-chevron mt-3 w-full rounded-lg border-2 border-ink/25 bg-sand/70 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/50 focus:border-ink"
                    >
                      {dropZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.label} — {z.examples}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-mute">
                      {zoneById[zone].examples}
                    </p>
                  </div>

                  <fieldset>
                    <legend className="eyebrow text-ink/70">Trip type</legend>
                    <div className="mt-3 inline-flex rounded-full border-2 border-ink/25 p-1">
                      {[
                        { id: "one-way", label: "One way" },
                        { id: "return", label: "Return" },
                      ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral has-[:focus-visible]:ring-offset-2 ${
                          tripType === opt.id
                            ? "bg-ink text-cream"
                            : "text-ink/60 hover:text-ink"
                        }`}
                      >
                          <input
                            type="radio"
                            name="tripType"
                            value={opt.id}
                            checked={tripType === opt.id}
                            onChange={(e) => setTripType(e.target.value)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <span id="pax-label" className="eyebrow block text-ink/70">
                      Passengers
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPassengersClamped(passengers - 1)}
                        disabled={passengers <= passengerLimits.min}
                        aria-label="Fewer passengers"
                        className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <output
                        htmlFor="pax-label"
                        aria-live="polite"
                        className="display tabular grid h-11 w-14 place-items-center rounded-lg border-2 border-ink bg-sand text-2xl"
                      >
                        {passengers}
                      </output>
                      <button
                        type="button"
                        onClick={() => setPassengersClamped(passengers + 1)}
                        disabled={passengers >= passengerLimits.max}
                        aria-label="More passengers"
                        className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                      <span className="text-xs leading-snug text-mute">
                        1–{passengerLimits.max}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-mute">
                      Auto-selected vehicle:{" "}
                      <span className="font-bold text-ink">{vehicleData.name}</span>{" "}
                      — {vehicleData.detail}
                    </p>
                  </div>

                  <div>
                    <span id="cur-label" className="eyebrow block text-ink/70">
                      Currency
                    </span>
                    <div className="mt-3 inline-flex rounded-full border-2 border-ink/25 p-1">
                      {["USD", "BBD"].map((cur) => (
                        <label
                          key={cur}
                          className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral has-[:focus-visible]:ring-offset-2 ${
                            currency === cur
                              ? "bg-coral text-ink"
                              : "text-ink/60 hover:text-ink"
                          }`}
                        >
                          <input
                            type="radio"
                            name="currency"
                            value={cur}
                            checked={currency === cur}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="sr-only"
                          />
                          {cur}
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-mute">
                      Fixed peg: 2 BBD = 1 USD
                    </p>
                  </div>
                </div>

                <div className="mt-7 border-t border-dashed border-ink/30 pt-5">
                  <p className="text-xs leading-relaxed text-mute">
                    {rateCard.note}
                  </p>
                </div>
              </div>

              {/* ---- perforation (desktop) ------------------------------- */}
              <div className="relative hidden bg-ink/15 md:block" aria-hidden="true">
                <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-sand" />
                <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-sand" />
              </div>

              {/* ---- perforation (mobile) -------------------------------- */}
              <div
                className="relative h-px bg-ink/15 md:hidden"
                aria-hidden="true"
              >
                <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-sand" />
                <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-sand" />
              </div>

              {/* ---- stub ------------------------------------------------ */}
              <div className="grain relative flex flex-col justify-between bg-ocean p-5 text-cream sm:p-7 lg:p-9">
                <div>
                  <p className="eyebrow text-gold">Estimated fare</p>
                  <p className="display tabular mt-3 flex items-baseline gap-2 text-[3.6rem] leading-none sm:text-[4.2rem]">
                    <span className="text-2xl text-cream/70">
                      {currency === "USD" ? "$" : "BZ$"}
                    </span>
                    <span>{animated}</span>
                  </p>
                  <p className="mt-2 text-sm text-cream/75">
                    {currency === "USD" ? "US dollars" : "Barbados dollars"} ·{" "}
                    {tripType === "return" ? "return trip" : "one way"}
                  </p>

                  <dl className="mt-6 space-y-2.5 border-t border-cream/20 pt-5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-cream/65">Route</dt>
                      <dd className="text-right font-medium">
                        {pickupById[pickup].label.split(" (")[0]}
                        <span className="mx-1.5 text-coral">→</span>
                        {zoneById[zone].label}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-cream/65">Passengers</dt>
                      <dd className="tabular font-medium">{passengers}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-cream/65">Vehicle</dt>
                      <dd className="flex items-center gap-1.5 font-medium">
                        <Check size={14} className="text-gold" aria-hidden="true" />
                        {vehicleData.name} · up to {vehicleData.capacity}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-8">
                  <span className="stamp mb-5 inline-block px-2.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-gold">
                    Demo rates, final fares confirmed by Imperial Taxi
                  </span>
                  <button
                    type="button"
                    onClick={handleRequest}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-coral px-5 py-4 text-sm font-bold text-ink transition-all hover:bg-gold hover:shadow-[0_16px_34px_-18px_rgba(255,106,69,1)]"
                  >
                    Request this ride
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                  <p className="mt-3 text-center text-[0.7rem] text-cream/60">
                    Fills the booking form below — nothing is sent yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
