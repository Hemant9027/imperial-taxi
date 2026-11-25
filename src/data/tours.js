/**
 * Tour data — SAMPLE CONTENT.
 * ----------------------------------------------------------------------------
 * Every tour, stop, blurb and duration below is sample content for this demo
 * (sample: true on each record). Replace with Jimmy's real tours, real routes
 * and real durations before launch. Nothing here is a confirmed price or time.
 */

export const tourStops = [
  {
    id: "harrisons-cave",
    name: "Harrison's Cave",
    parish: "St. Thomas",
    blurb: "Tram tour through the limestone caverns.",
    hours: 1.25,
    sample: true,
  },
  {
    id: "st-nicholas-abbey",
    name: "St. Nicholas Abbey",
    parish: "St. Peter",
    blurb: "Plantation house, rum and the old sugar works.",
    hours: 1.25,
    sample: true,
  },
  {
    id: "bathsheba",
    name: "Bathsheba",
    parish: "St. Joseph",
    blurb: "Rock pools and the Atlantic east coast.",
    hours: 1,
    sample: true,
  },
  {
    id: "cherry-tree-hill",
    name: "Cherry Tree Hill",
    parish: "St. Joseph",
    blurb: "Overlook across the Scotland District to the sea.",
    hours: 0.5,
    sample: true,
  },
  {
    id: "gun-hill",
    name: "Gun Hill Signal Station",
    parish: "St. George",
    blurb: "Hilltop signal post with island views.",
    hours: 0.75,
    sample: true,
  },
  {
    id: "bridgetown-garrison",
    name: "Bridgetown & the Garrison",
    parish: "St. Michael",
    blurb: "Historic town and the Garrison Savannah.",
    hours: 1,
    sample: true,
  },
  {
    id: "oistins-fish-fry",
    name: "Oistins Fish Fry",
    parish: "Christ Church",
    blurb: "Fish, music and the famous Friday night.",
    hours: 1.5,
    sample: true,
    days: "Fridays only",
  },
  {
    id: "holetown",
    name: "Holetown & west coast beaches",
    parish: "St. James",
    blurb: "West coast shoreline, shops and calm water.",
    hours: 1,
    sample: true,
  },
  {
    id: "mount-gay",
    name: "Mount Gay Distillery",
    parish: "St. Michael",
    blurb: "Rum heritage and tasting.",
    hours: 1.25,
    sample: true,
  },
  {
    id: "carlisle-bay",
    name: "Carlisle Bay",
    parish: "St. Michael",
    blurb: "Sheltered bay close to Bridgetown.",
    hours: 0.75,
    sample: true,
  },
];

/** Preset private tours — sample routes, sample durations. */
export const presetTours = [
  {
    id: "south-east",
    name: "South & East Coast Highlights",
    tagline: "Caverns, cliffs and the Atlantic side.",
    stops: [
      "harrisons-cave",
      "cherry-tree-hill",
      "bathsheba",
      "gun-hill",
      "carlisle-bay",
      "oistins-fish-fry",
    ],
    hours: 6,
    sample: true,
    note: "Sample route — stop list and duration are editable in src/data/tours.js.",
  },
  {
    id: "west-heritage",
    name: "West Coast & Heritage",
    tagline: "Rum, plantation history and the west shore.",
    stops: [
      "st-nicholas-abbey",
      "mount-gay",
      "holetown",
      "bridgetown-garrison",
    ],
    hours: 5,
    sample: true,
    note: "Sample route — stop list and duration are editable in src/data/tours.js.",
  },
  {
    id: "full-island",
    name: "Full Island",
    tagline: "The whole loop, coast to coast in one day.",
    stops: tourStops.map((stop) => stop.id),
    hours: 9,
    sample: true,
    note: "Sample route — stop list and duration are editable in src/data/tours.js.",
  },
];

export const tourMeta = {
  isSample: true,
  badge: "Sample tour content — routes and durations confirmed by Imperial Taxi",
  durationLabel: "Estimated duration",
  durationUnit: "hrs",
  travelBufferHours: 0.5,
  byId: Object.fromEntries(tourStops.map((stop) => [stop.id, stop])),
};

export function totalHours(stopIds) {
  const sum = stopIds.reduce(
    (acc, id) => acc + (tourMeta.byId[id]?.hours ?? 0),
    0
  );
  return sum ? Math.round((sum + tourMeta.travelBufferHours) * 2) / 2 : 0;
}

export function formatHours(value) {
  if (!value) return "—";
  const whole = Math.floor(value);
  const half = value - whole >= 0.5;
  if (!whole) return "½ hr";
  return `${whole} hr${half ? " ½" : ""}`;
}

export default presetTours;
