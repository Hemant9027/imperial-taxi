/**
 * Imperial Taxi Services — editable business data.
 * ----------------------------------------------------------------------------
 * RULE FOR THIS PROJECT: never invent facts. Anything marked [FILL] stays a
 * visible placeholder until Jimmy supplies the real detail. No reviews, no
 * awards, no "years in business", no prices in this file.
 */

import heroPoster from "../assets/hero-poster.jpg";
import islandMap from "../assets/island-map.jpg";

export const business = {
  name: "Imperial Taxi Services",
  owner: "Jimmy",
  positioning:
    "A personal, friendly and reliable taxi and private tour service run by Jimmy from Oistins, Christ Church.",
  address: {
    street: "Dover Rd",
    area: "Oistins",
    parish: "Christ Church",
    country: "Barbados",
  },
  addressLine: "Dover Rd, Oistins, Christ Church, Barbados",

  // [FILL] — replace with the real digits. Everything in brackets is a demo placeholder.
  phone: "[Phone number]",
  whatsapp: "[WhatsApp number]",
  email: "[Email address]",

  // [FILL] — leave the array empty ([]) to omit social links from the footer.
  social: [
    // { id: "facebook", label: "Facebook", href: "https://facebook.com/..." },
    // { id: "instagram", label: "Instagram", href: "https://instagram.com/..." },
  ],

  // [FILL] — vehicle details are placeholders. capacity drives the fare estimator.
  vehicles: [
    {
      id: "sedan",
      name: "Sedan",
      capacity: 4,
      detail: "[Sedan — make/model or colour, up to 4 passengers]",
    },
    {
      id: "minivan",
      name: "Minivan",
      capacity: 8,
      detail: "[Minivan — make/model or colour, up to 8 passengers]",
    },
  ],

  services: [
    {
      id: "airport",
      icon: "Plane",
      title: "Airport transfers",
      description:
        "Pick-up and drop-off at Grantley Adams International Airport (BGI).",
    },
    {
      id: "cruise",
      icon: "Ship",
      title: "Cruise terminal transfers",
      description:
        "Direct transfers to and from the Bridgetown cruise terminal.",
    },
    {
      id: "taxi",
      icon: "Car",
      title: "Standard taxi service",
      description: "Point-to-point taxi rides around Barbados, on demand.",
    },
    {
      id: "scheduled",
      icon: "CalendarClock",
      title: "Scheduled & pre-booked rides",
      description:
        "Reserve a set date and time in advance so your ride is already arranged.",
    },
    {
      id: "tours",
      icon: "Map",
      title: "Private island tours",
      description:
        "Your own private route around the island, at your pace and your stops.",
    },
    {
      id: "delivery",
      icon: "Package",
      title: "Parcel & document delivery",
      description: "Small parcels and documents carried across the island.",
    },
  ],

  // "How booking works" — process steps (copy is placeholder, the process is real).
  steps: [
    {
      id: 1,
      title: "Send your request",
      body: "Use the form on this page, WhatsApp, or call. Include your date, time, pickup and drop-off.",
    },
    {
      id: 2,
      title: "Jimmy confirms",
      body: "You get a reply confirming availability and the final fare for your trip or tour.",
    },
    {
      id: 3,
      title: "Fare agreed upfront",
      body: "Demo rates on this page are indicative only — the real fare is confirmed before you travel.",
    },
    {
      id: 4,
      title: "Pick-up & go",
      body: "Jimmy meets you at the agreed point in Oistins, at the airport, or at your address.",
    },
  ],

  // Short FAQ about the booking process. No invented policy — edit freely.
  faqs: [
    {
      id: "how",
      question: "How do I book a ride or a tour?",
      answer:
        "Fill in the booking request form on this page, or send the same details by WhatsApp or phone. You will get a confirmation from Jimmy with the fare before you travel.",
    },
    {
      id: "fare",
      question: "Are the fares on this page final?",
      answer:
        "No. The estimator shows demo rates only, marked as placeholder data in src/data/fares.js. Final fares are confirmed by Imperial Taxi when your request is answered.",
    },
    {
      id: "advance",
      question: "How far in advance should I book?",
      answer:
        "[Policy placeholder — replace with Jimmy's own answer, e.g. how much notice he needs for airport runs, cruise days and full-island tours.]",
    },
    {
      id: "flight",
      question: "What happens with my flight number?",
      answer:
        "Add your flight number when you book an airport transfer. It is passed straight into your request so Jimmy can see your arrival details.",
    },
    {
      id: "payment",
      question: "How do I pay?",
      answer:
        "[Payment placeholder — replace with the payment methods Jimmy accepts in Barbados.]",
    },
    {
      id: "changes",
      question: "Can I change or cancel a booking?",
      answer:
        "[Policy placeholder — replace with Jimmy's own answer on changes and cancellations.]",
    },
  ],

  // Google Maps link for the base address.
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Dover+Rd%2C+Oistins%2C+Christ+Church%2C+Barbados",

  footerNote: "Concept preview by InfyCrest Solutions",
};

/**
 * Image config — swap `src` for a real photo whenever one is available.
 * Leave `placeholder: true` to render the designed CSS/SVG panel instead.
 */
export const images = {
  hero: {
    src: heroPoster,
    alt: "Screenprint-style illustration of the Barbados south coast with palms, cliffs and a low sun",
    placeholder: false,
    caption: "South coast, Christ Church",
  },
  islandMap: {
    src: islandMap,
    alt: "Screenprint-style illustrated map of the Barbados coastline with landmarks",
    placeholder: false,
    caption: "Island tour routes — sample illustration",
  },
  owner: {
    src: "",
    alt: "Portrait of Jimmy, owner of Imperial Taxi Services",
    placeholder: true,
    caption: "[Photo placeholder — add Jimmy's photo in src/data/business.js]",
  },
};

export const isFilled = (value) =>
  typeof value === "string" && value.trim() !== "" && !/^\[.*\]$/.test(value.trim());

export default business;
