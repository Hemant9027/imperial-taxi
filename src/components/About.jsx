import Reveal from "./Reveal.jsx";
import { business, images } from "../data/business.js";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-20 text-cream md:py-28">
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-x-0 top-0 h-32 text-gold/15"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <Reveal className="lg:col-span-5">
          <figure className="relative mx-auto max-w-sm rotate-[-1.4deg] border-2 border-cream/80 bg-abyss p-2 shadow-[16px_16px_0_-4px_rgba(255,106,69,0.35)] lg:max-w-none">
            <div className="grain relative grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-ocean via-abyss to-ink p-6 text-center">
              {images.owner.placeholder || !images.owner.src ? (
                <div>
                  <span
                    aria-hidden="true"
                    className="display block text-[5rem] leading-none text-coral/80"
                  >
                    J
                  </span>
                  <span className="eyebrow mt-3 block text-[0.6rem] text-cream/60">
                    [Portrait placeholder]
                  </span>
                </div>
              ) : (
                <img
                  src={images.owner.src}
                  alt={images.owner.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
            <figcaption className="eyebrow mt-2 px-1 pb-1 text-[0.58rem] text-cream/55">
              {images.owner.caption}
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-gold">05 — About</p>
            <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
              Run personally by{" "}
              <span className="font-normal italic text-coral">Jimmy.</span>
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <p className="lede mt-6 max-w-2xl text-cream/80">
              {business.positioning}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-7 space-y-4 border-l-2 border-coral pl-5">
              <p className="text-[0.95rem] leading-relaxed text-cream/65">
                [About copy placeholder — two or three sentences in Jimmy's own
                voice: who he is, how he looks after guests landing at BGI, and
                why he runs Imperial Taxi Services from Oistins.]
              </p>
              <p className="text-[0.95rem] leading-relaxed text-cream/65">
                [Second paragraph placeholder — a day in the work: early airport
                runs to Grantley Adams, cruise-ship days in Bridgetown, and
                private island tours down the south and east coasts.]
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9 grid gap-px overflow-hidden rounded-lg border border-cream/20 bg-cream/20 sm:grid-cols-3">
              {[
                { k: "Owner", v: business.owner },
                { k: "Base", v: `${business.address.street}, ${business.address.area}` },
                { k: "Parish", v: business.address.parish },
              ].map((item) => (
                <div key={item.k} className="bg-ink px-4 py-4">
                  <p className="eyebrow text-cream/50">{item.k}</p>
                  <p className="mt-1.5 text-sm font-bold text-cream">{item.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-cream/45">
              Facts shown above come straight from the business data — no reviews,
              awards or claims have been added to this demo.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
