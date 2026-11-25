import Reveal from "./Reveal.jsx";
import Icon from "./Icon.jsx";
import { business } from "../data/business.js";

export default function Services() {
  return (
    <section id="services" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-ocean">04 — Services</p>
            <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
              Six things Jimmy{" "}
              <span className="font-normal italic text-coraldark">drives.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/70">
            From the arrivals hall at Grantley Adams to a Friday night at the
            Oistins Fish Fry — one operator, one driver, no hand-offs.
          </p>
        </Reveal>

        <ol className="mt-12 border-t border-ink/15">
          {business.services.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              delay={index * 60}
              className="group border-b border-ink/15 transition-colors hover:bg-sand/70"
            >
              <div className="grid grid-cols-1 gap-3 px-1 py-7 sm:grid-cols-[4.5rem_1fr] sm:gap-6 sm:px-3 lg:grid-cols-[4.5rem_minmax(0,1.1fr)_minmax(0,1.3fr)]">
                <span className="display tabular text-3xl leading-none text-coral">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-start gap-3">
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-cream">
                    <Icon name={service.icon} size={17} />
                  </span>
                  <h3 className="display text-xl leading-tight sm:text-2xl">
                    {service.title}
                  </h3>
                </div>
                <p className="text-[0.95rem] leading-relaxed text-ink/70 lg:pt-2">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
