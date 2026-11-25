import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { business, isFilled } from "../data/business.js";
import { Mark } from "./Header.jsx";

const nav = [
  { id: "estimator", label: "Fare estimator" },
  { id: "tours", label: "Private tours" },
  { id: "booking", label: "Booking request" },
  { id: "services", label: "Services" },
  { id: "about", label: "About Jimmy" },
  { id: "faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="bg-abyss text-cream">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Mark className="h-11 w-11" />
              <span className="leading-none">
                <span className="display block text-xl font-semibold">
                  Imperial Taxi Services
                </span>
                <span className="eyebrow block text-[0.6rem] text-gold">
                  Oistins · Christ Church · Barbados
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65">
              {business.positioning}
            </p>
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-gold hover:text-gold"
            >
              <MapPin size={14} aria-hidden="true" />
              Open in Google Maps
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-gold">Contact</p>
            <address className="mt-4 space-y-3 text-sm not-italic text-cream/75">
              <p className="leading-relaxed">{business.addressLine}</p>
              <p>
                {isFilled(business.phone) ? (
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 font-bold text-cream hover:text-gold"
                  >
                    <Phone size={14} aria-hidden="true" /> {business.phone}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Phone size={14} aria-hidden="true" /> {business.phone}
                  </span>
                )}
              </p>
              <p>
                {isFilled(business.email) ? (
                  <a
                    href={`mailto:${business.email}`}
                    className="inline-flex items-center gap-2 font-bold text-cream hover:text-gold"
                  >
                    <Mail size={14} aria-hidden="true" /> {business.email}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Mail size={14} aria-hidden="true" /> {business.email}
                  </span>
                )}
              </p>
              <p className="text-cream/50">WhatsApp: {business.whatsapp}</p>
            </address>

            {business.social.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-3">
                {business.social.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eyebrow rounded-full border border-cream/30 px-3 py-2 text-[0.6rem] hover:border-gold hover:text-gold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow text-gold">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-cream/70 transition-colors hover:text-coral"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow text-gold">Vehicles</p>
            <ul className="mt-4 space-y-3">
              {business.vehicles.map((v) => (
                <li key={v.id} className="text-sm text-cream/70">
                  <span className="block font-bold text-cream">
                    {v.name} · up to {v.capacity}
                  </span>
                  <span className="text-xs text-cream/45">{v.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/60">
            © {new Date().getFullYear()} {business.name}. Fares and tour
            durations shown are demo data pending confirmation.
          </p>
          <p className="eyebrow text-[0.6rem] text-cream/60">
            {business.footerNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
