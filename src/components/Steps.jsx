import Reveal from "./Reveal.jsx";
import { business } from "../data/business.js";

export default function Steps() {
  return (
    <section id="how" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-ocean">06 — How booking works</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
            Four steps,{" "}
            <span className="font-normal italic text-coraldark">no apps.</span>
          </h2>
        </Reveal>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-ink/25 lg:block"
          />
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {business.steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.id}
                delay={index * 90}
                className="relative"
              >
                <span className="display tabular grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-cream text-xl text-ink shadow-[4px_4px_0_0_rgba(5,42,46,0.18)]">
                  {String(step.id).padStart(2, "0")}
                </span>
                <h3 className="display mt-5 text-xl">{step.title}</h3>
                <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-ink/70">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={200} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-coral hover:text-ink"
          >
            Start a booking request
          </a>
          <p className="text-sm text-ink/60">
            Prefer to talk? {business.phone} · {business.email}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
