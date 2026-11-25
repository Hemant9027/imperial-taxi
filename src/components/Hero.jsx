import { ArrowRight, MapPin } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { business, images, isFilled } from "../data/business.js";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-cream">
      {/* poster ink wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-ocean/40 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-x-0 bottom-0 h-40 text-cream/10"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-28 sm:px-6 md:pt-36 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-2 text-gold">
              <MapPin size={14} aria-hidden="true" />
              {business.addressLine}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[0.94] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]">
              <span className="block">Stress-free</span>
              <span className="block">
                airport transfers{" "}
                <span className="text-coral" aria-hidden="true">
                  +
                </span>
              </span>
              <span className="block font-normal italic text-coral">
                private island tours.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="lede mt-7 max-w-xl text-cream/80">
              {business.name} gets you from Grantley Adams International Airport
              (BGI) and the Bridgetown cruise terminal to your stay — and around
              the whole island — with one friendly, reliable driver:{" "}
              <span className="text-cream">{business.owner}</span>.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#estimator"
                className="group inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-bold tracking-wide text-ink transition-all hover:bg-gold hover:shadow-[0_14px_30px_-16px_rgba(255,106,69,0.9)]"
              >
                Get a fare estimate
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-6 py-3.5 text-sm font-bold tracking-wide text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
              >
                Request a booking
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-cream/15 pt-6">
              {business.services.map((service, i) => (
                <li
                  key={service.id}
                  className="eyebrow flex items-center gap-4 text-[0.65rem] text-cream/70"
                >
                  {i > 0 && (
                    <span className="h-1 w-1 rounded-full bg-coral" aria-hidden="true" />
                  )}
                  {service.title}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* screenprint poster panel */}
        <Reveal delay={200} className="relative lg:col-span-5">
          <figure className="relative mx-auto max-w-md rotate-[-1.6deg] border-2 border-cream/85 bg-ink p-2 shadow-[18px_18px_0_-4px_rgba(255,106,69,0.35)] lg:max-w-none">
            <div className="grain relative overflow-hidden">
              {images.hero.placeholder || !images.hero.src ? (
                <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-ocean via-ink to-abyss p-6 text-center">
                  <span className="eyebrow text-cream/60">
                    [Hero photo placeholder]
                  </span>
                </div>
              ) : (
                <img
                  src={images.hero.src}
                  alt={images.hero.alt}
                  width={1536}
                  height={1024}
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
            <figcaption className="eyebrow mt-2 flex items-center justify-between px-1 pb-1 text-[0.6rem] text-cream/60">
              <span>{images.hero.caption}</span>
              <span className="text-gold">Est. demo</span>
            </figcaption>
          </figure>

          {/* enamel roof-sign plaque */}
          <div className="absolute -bottom-6 left-2 max-w-[15rem] rotate-[1.5deg] border-2 border-ink bg-gold px-4 py-3 text-ink shadow-[8px_8px_0_0_rgba(5,42,46,0.45)] sm:left-6">
            <p className="eyebrow text-[0.6rem] text-ink/70">Base & dispatch</p>
            <p className="mt-1 text-sm font-bold leading-snug">
              {business.address.street}, {business.address.area}
            </p>
            <p className="mt-0.5 text-sm font-bold">
              {isFilled(business.phone) ? (
                <a href={`tel:${business.phone}`} className="underline decoration-coral decoration-2 underline-offset-4">
                  {business.phone}
                </a>
              ) : (
                <span className="text-ink/70">{business.phone}</span>
              )}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative border-t border-cream/10 bg-abyss/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-[0.62rem] text-cream/55">
            Airport · Cruise · Taxi · Tours · Delivery
          </p>
          <p className="eyebrow text-[0.62rem] text-gold">
            Demo rates shown — final fares confirmed by Imperial Taxi
          </p>
        </div>
      </div>
    </section>
  );
}
