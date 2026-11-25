/**
 * Fare data — PLACEHOLDER DEMO RATES ONLY.
 * ----------------------------------------------------------------------------
 * Every number below is a sample so the estimator can be demonstrated.
 * isPlaceholder: true is surfaced as a badge in the UI. Replace the numbers
 * with Jimmy's real fare card and flip isPlaceholder to false when launching.
 */

export const rateCard = {
  isPlaceholder: true,
  badge: "Demo rates, final fares confirmed by Imperial Taxi",
  note: "All figures on this page are placeholder demo rates. Imperial Taxi confirms the final fare before you travel.",
  currency: {
    base: "USD",
    peg: { USD: 1, BBD: 2 }, // fixed peg: 2 BBD = 1 USD
  },
  // Placeholder multipliers used only for the demo calculation.
  adjustments: {
    returnMultiplier: 1.85,
    minivanMultiplier: 1.25,
  },
  updatedAt: "[Fare card last updated — FILL]",
};

export const pickupPoints = [
  {
    id: "bgi",
    label: "Grantley Adams Airport (BGI)",
    detail: "Arrivals hall pick-up",
  },
  {
    id: "cruise",
    label: "Bridgetown Cruise Terminal",
    detail: "Ship-side transfer",
  },
  {
    id: "area",
    label: "Another Barbados area",
    detail: "Tell us the address in your request",
  },
];

export const dropZones = [
  {
    id: "south",
    label: "Christ Church south coast",
    examples: "Oistins, Worthing, St. Lawrence Gap",
  },
  {
    id: "stMichael",
    label: "Bridgetown / St. Michael",
    examples: "Bridgetown, Belleville, Fontabelle",
  },
  {
    id: "stJames",
    label: "Holetown / St. James (west coast)",
    examples: "Holetown, Follies, Sandy Lane",
  },
  {
    id: "stPeter",
    label: "Speightstown / St. Peter (north)",
    examples: "Speightstown, Mullins, Six Men's",
  },
  {
    id: "east",
    label: "East coast (Bathsheba / St. Joseph)",
    examples: "Bathsheba, Bath, Horse Hill",
  },
  {
    id: "stPhilip",
    label: "St. Philip (Crane / Bottom Bay)",
    examples: "Crane, Bottom Bay, Six Roads",
  },
];

/**
 * One-way demo fares in USD for the sedan (1–4 passengers).
 * Matrix: fares[pickupPointId][dropZoneId]
 */
export const fares = {
  bgi: { south: 40, stMichael: 35, stJames: 70, stPeter: 95, east: 65, stPhilip: 30 },
  cruise: { south: 25, stMichael: 15, stJames: 55, stPeter: 80, east: 50, stPhilip: 45 },
  area: { south: 30, stMichael: 25, stJames: 45, stPeter: 65, east: 40, stPhilip: 35 },
};

export const passengerLimits = { min: 1, max: 8, sedanSeats: 4 };

export const vehicleForPassengers = (passengers) =>
  passengers <= passengerLimits.sedanSeats ? "sedan" : "minivan";

/** Returns the demo fare in USD, rounded to the whole unit. */
export function calculateFare({ pickup, dropOff, passengers = 1, tripType = "one-way" }) {
  const base = fares[pickup]?.[dropOff];
  if (base == null) return null;
  let total = base;
  if (passengers > passengerLimits.sedanSeats) {
    total *= rateCard.adjustments.minivanMultiplier;
  }
  if (tripType === "return") {
    total *= rateCard.adjustments.returnMultiplier;
  }
  return Math.round(total);
}

export const convertCurrency = (usd, currency) =>
  currency === "BBD"
    ? Math.round(usd * rateCard.currency.peg.BBD)
    : Math.round(usd);

export default fares;
