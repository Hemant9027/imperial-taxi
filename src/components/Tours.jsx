import { useMemo, useState } from "react";
import { Clock, Check, Plus, ArrowRight } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { images, business } from "../data/business.js";
import { presetTours, tourStops, tourMeta, totalHours, formatHours } from "../data/tours.js";

export default function Tours({ onRequest }) {
  const [activePreset, setActivePreset] = useState(presetTours[0].id);
  const [selected, setSelected] = useState(presetTours[0].stops);

  const active = presetTours.find((p) => p.id === activePreset) || null;

  const toggleStop = (id) => {
    setActivePreset(null);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const hours = useMemo(() => totalHours(selected), [selected]);
  const stopNames = selected.map((id) => tourMeta.byId[id]?.name).filter(Boolean);

  const choosePreset = (preset) => {
    setActivePreset(preset.id);
    setSelected(preset.stops);
  };

  const handleAdd = () => {
    if (!selected.length) return;
    onRequest({
      nonce: Date.now(),
      serviceType: "tours",
      tourLabel: active ? active.name : "Custom route (build your own)",
      tourStops: selected,
      passengers: Math.min(8, Math.max(1, selected.length > 4 ? 6 : 4)),
      pickupLabel: "",
      dropOffLabel: "",
      notes: `Tour request: ${
        active ? active.name : "custom route"
      } — ${stopNames.join(", ")}. Sample duration estimate: ${formatHours(hours)}.`,
      from: "tours",
    });
  };

  return (
    <section id="tours" className="relative overflow-hidden bg-ink py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">02 — Private island tours</p>
            <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
              Your island,{" "}
              <span className="font-normal italic text-coral">your route.</span>
            </h2>
            <p className="lede mt-5 text-cream/75">
              Start from one of Jimmy's sample routes, then add or remove stops
              until the day looks like yours.
            </p>
          </div>
          <span className="stamp px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-gold">
            {tourMeta.badge}
          </span>
        </Reveal>

        {/* preset routes as an editorial numbered list */}
        <Reveal delay={100} className="mt-12">
          <ul className="border-t border-cream/15">
            {presetTours.map((preset, index) => {
              const isActive = activePreset === preset.id;
              return (
                <li
                  key={preset.id}
                  className={`border-b border-cream/15 transition-colors ${
                    isActive ? "bg-cream/[0.06]" : "hover:bg-cream/[0.03]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => choosePreset(preset)}
                    aria-pressed={isActive}
                    className="group grid w-full grid-cols-1 items-center gap-4 px-1 py-6 text-left sm:grid-cols-[4rem_1fr_auto] sm:gap-6 sm:px-3"
                  >
                    <span
                      className={`display text-3xl leading-none ${
                        isActive ? "text-coral" : "text-cream/35"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="display text-xl sm:text-2xl">
                          {preset.name}
                        </span>
                        {isActive && (
                          <span className="eyebrow flex items-center gap-1 rounded-full bg-coral px-2.5 py-1 text-[0.58rem] text-ink">
                            <Check size={11} aria-hidden="true" /> Selected
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block text-sm text-cream/65">
                        {preset.tagline}
                      </span>
                      <span className="eyebrow mt-2 block text-[0.6rem] text-cream/45">
                        {preset.stops.length} stops · sample content
                      </span>
                    </span>
                    <span className="flex items-center gap-4 sm:justify-end">
                      <span className="tabular flex items-center gap-1.5 text-sm text-gold">
                        <Clock size={14} aria-hidden="true" />
                        {preset.hours} hrs
                      </span>
                      <span
                        className={`eyebrow rounded-full border px-4 py-2 text-[0.6rem] transition-colors ${
                          isActive
                            ? "border-coral bg-coral text-ink"
                            : "border-cream/35 text-cream/80 group-hover:border-cream"
                        }`}
                      >
                        {isActive ? "Chosen" : "Choose"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* build your own */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <figure className="relative rotate-[-1deg] border-2 border-cream/80 bg-abyss p-2 shadow-[-14px_14px_0_-4px_rgba(245,185,66,0.35)]">
              <div className="grain relative overflow-hidden">
                {images.islandMap.placeholder || !images.islandMap.src ? (
                  <div className="grid aspect-[3/2] w-full place-items-center bg-gradient-to-br from-ocean to-abyss p-6 text-center">
                    <span className="eyebrow text-cream/60">
                      [Island map illustration placeholder]
                    </span>
                  </div>
                ) : (
                  <img
                    src={images.islandMap.src}
                    alt={images.islandMap.alt}
                    width={1536}
                    height={1024}
                    className="aspect-[3/2] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <figcaption className="eyebrow mt-2 px-1 pb-1 text-[0.6rem] text-cream/55">
                {images.islandMap.caption}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <p className="eyebrow text-gold">Build your own tour</p>
            <h3 className="display mt-3 text-2xl sm:text-3xl">
              Pick the stops, we'll shape the day.
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {tourStops.map((stop) => {
                const on = selected.includes(stop.id);
                return (
                  <label
                    key={stop.id}
                    className={`relative cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ink ${
                      on
                        ? "border-coral bg-coral text-ink"
                        : "border-cream/30 text-cream/85 hover:border-cream/70 hover:bg-cream/5"
                    }`}
                    title={stop.blurb}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={on}
                      onChange={() => toggleStop(stop.id)}
                    />
                    <span className="flex items-center gap-1.5">
                      {on ? (
                        <Check size={13} aria-hidden="true" />
                      ) : (
                        <Plus size={13} aria-hidden="true" />
                      )}
                      {stop.name}
                      {stop.days ? (
                        <span className="text-[0.65rem] font-bold uppercase opacity-75">
                          · {stop.days}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-cream/15 pt-6">
              <div>
                <p className="eyebrow text-cream/55">{tourMeta.durationLabel}</p>
                <p className="display tabular mt-1 text-3xl text-gold">
                  {formatHours(hours)}
                  <span className="ml-2 text-sm font-normal text-cream/55">
                    · {selected.length} stop{selected.length === 1 ? "" : "s"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-cream/50">
                  Sample estimate — includes a travel buffer. Final timing
                  confirmed by Imperial Taxi.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selected.length}
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-ink transition-all hover:bg-coral disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to booking request
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
            {selected.length > 0 && (
              <p className="mt-4 text-sm leading-relaxed text-cream/60">
                <span className="text-cream/85">{stopNames.join(" · ")}</span>
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-12 border-t border-cream/15 pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-cream/50">
            {business.name} sample tours are demo content stored in
            src/data/tours.js — routes, durations and opening days are editable
            and must be confirmed with {business.owner} before publishing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
