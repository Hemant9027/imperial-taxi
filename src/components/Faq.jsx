import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { business } from "../data/business.js";

export default function Faq() {
  const [open, setOpen] = useState(business.faqs[0]?.id ?? null);

  return (
    <section id="faq" className="bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-ocean">07 — FAQ</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.02] sm:text-5xl">
            Before you{" "}
            <span className="font-normal italic text-coraldark">book.</span>
          </h2>
          <p className="lede mt-5 text-ink/70">
            Short answers about how a request becomes a confirmed ride. Anything
            missing, just ask {business.owner} directly.
          </p>
          <a
            href="#booking"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-3 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            Ask a question in your request
          </a>
        </Reveal>

        <div className="lg:col-span-8">
          <ul className="border-t border-ink/15">
            {business.faqs.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <li key={faq.id} className="border-b border-ink/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${faq.id}`}
                      className="flex w-full items-center justify-between gap-5 py-5 text-left transition-colors hover:text-coraldark"
                    >
                      <span className="display text-lg leading-snug sm:text-xl">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform duration-300 ${
                          isOpen ? "rotate-180 bg-ink text-cream" : "bg-transparent"
                        }`}
                      >
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-10 text-[0.95rem] leading-relaxed text-ink/70">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
