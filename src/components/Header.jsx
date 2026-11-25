import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { business, isFilled } from "../data/business.js";

const links = [
  { id: "estimator", label: "Fares" },
  { id: "tours", label: "Tours" },
  { id: "booking", label: "Booking" },
  { id: "services", label: "Services" },
  { id: "faq", label: "FAQ" },
];

export function Mark({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Imperial Taxi Services">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#FF6A45" />
      <rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke="#052A2E" strokeWidth="2" />
      <circle cx="20" cy="16.5" r="7" fill="#052A2E" />
      <path
        d="M3 27.5q4.25-4 8.5 0t8.5 0 8.5 0 8.5 0"
        fill="none"
        stroke="#052A2E"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M3 32.5q4.25-4 8.5 0t8.5 0 8.5 0 8.5 0"
        fill="none"
        stroke="#052A2E"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "bg-ink/95 shadow-[0_10px_30px_-18px_rgba(3,27,30,0.9)] border-b border-cream/10 backdrop-blur-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-cream"
          onClick={() => setOpen(false)}
        >
          <Mark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
          <span className="leading-none">
            <span className="display block text-[1.05rem] font-semibold tracking-tight">
              Imperial
            </span>
            <span className="eyebrow block text-[0.6rem] text-gold">
              Taxi Services
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="eyebrow text-cream/80 transition-colors hover:text-coral"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="eyebrow rounded-full bg-coral px-5 py-2.5 text-ink transition-colors hover:bg-cream"
          >
            Book Now
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="#booking"
            className="eyebrow rounded-full bg-coral px-4 py-2.5 text-ink"
          >
            Book Now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-cream/10 bg-ink lg:hidden"
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6" aria-label="Mobile">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="eyebrow border-b border-cream/10 py-4 text-cream/85"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`tel:${business.phone}`}
            onClick={(e) => {
              if (!isFilled(business.phone)) e.preventDefault();
              setOpen(false);
            }}
            className="flex items-center gap-2 py-4 text-sm text-gold"
          >
            <Phone size={15} aria-hidden="true" /> {business.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
