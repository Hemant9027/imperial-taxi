# Imperial Taxi Services — single-page concept (sales demo)

A premium, fully client-side single page for **Imperial Taxi Services** (owner: Jimmy,
Dover Rd, Oistins, Christ Church, Barbados). No backend: every interaction — fare
estimator, tour builder, booking form, WhatsApp/email handoff — runs in the browser.

---

## Commands

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# production build → dist/index.html (single file, all assets inlined)
npm run build

# preview the production build
npm run preview
```

`npm run build` runs `vite build` only (no type-check step) and must pass with no errors.

---

## File tree

```
.
├── index.html                     # title, meta description, Open Graph, LocalBusiness JSON-LD, Google Fonts
├── package.json
├── vite.config.ts                 # Vite + Tailwind v4 + single-file plugin (do not edit for content)
├── tsconfig.json
├── README.md
└── src
    ├── main.tsx                   # React entry
    ├── App.tsx                    # page composition + "request this ride / tour" scroll hand-off
    ├── index.css                  # Tailwind v4 @theme tokens, poster texture, ticket perforation, reveal motion
    ├── globals.d.ts               # allows .jsx/.jpg imports from .tsx
    ├── assets
    │   ├── hero-poster.jpg        # screenprint-style south-coast illustration (hero)
    │   └── island-map.jpg         # screenprint-style island map illustration (tours)
    ├── data
    │   ├── business.js            # name, address, contact [FILL], vehicles [FILL], services, steps, FAQ, images config
    │   ├── fares.js               # pickup points, drop zones, DEMO fare matrix (isPlaceholder: true)
    │   └── tours.js               # sample stops + sample preset tours (sample: true)
    ├── utils
    │   └── cn.ts                  # class helper (template utility)
    └── components
        ├── Reveal.jsx             # IntersectionObserver scroll reveal (prefers-reduced-motion aware)
        ├── Icon.jsx               # lucide icon name → component (names live in business.js)
        ├── Header.jsx             # sticky header, Book Now, mobile menu, SVG logo mark
        ├── Hero.jsx               # headline, two CTAs, services strip, poster panel, contact plaque
        ├── FareEstimator.jsx      # die-cut fare ticket: pickup / zone / pax / one-way-return / USD-BBD
        ├── Tours.jsx              # 3 sample routes + build-your-own stop multi-select
        ├── BookingForm.jsx        # validated form → confirmation summary → WhatsApp / email / copy
        ├── Services.jsx           # numbered editorial services list
        ├── About.jsx              # Jimmy (placeholder copy) + known-facts card + photo placeholder
        ├── Steps.jsx              # how booking works
        ├── Faq.jsx                # accessible accordion
        └── Footer.jsx             # contact, Google Maps link, vehicles, concept-credit line
```

---

## Everything editable lives in `src/data/`

| File | Contains |
| --- | --- |
| `src/data/business.js` | Name, address, `phone` / `whatsapp` / `email` (**[FILL]**), `social` (empty array = omitted), `vehicles` (**[FILL]**), services, booking steps, FAQs, Google Maps URL, footer credit, and the **`images` config**. |
| `src/data/fares.js` | Pickup points, six drop-off zones, demo fare matrix, peg (2 BBD = 1 USD), one-way/return and minivan multipliers, `rateCard.isPlaceholder = true`. |
| `src/data/tours.js` | Ten tour stops with sample durations, three sample preset routes, `tourMeta.isSample = true`, duration helpers. |

### Placeholder rules used throughout

* Anything not supplied by the business renders literally as `[Phone number]`, `[Email address]`,
  `[Fare card last updated — FILL]`, `[About copy placeholder — …]`.
* **No** reviews, testimonials, awards, years-in-business, prices or claims were invented.
* Every fare shows the badge **“Demo rates, final fares confirmed by Imperial Taxi”** while
  `rateCard.isPlaceholder` is `true`.
* Every tour row is labelled *sample content* while `sample: true`.

### Before launch — fill list

1. `business.phone`, `business.whatsapp`, `business.email` → all tel:, wa.me and mailto: links
   (and the WhatsApp/email buttons on the confirmation) switch on automatically once the values
   are no longer bracketed placeholders.
2. `business.vehicles[0/1].detail` → real vehicle descriptions (capacities already drive the
   sedan/minivan auto-selection).
3. `business.social` → add entries to show social icons, or leave `[]` to omit them.
4. `fares.js` → replace the demo matrix, then set `rateCard.isPlaceholder = false` (the badge
   disappears from the UI).
5. `tours.js` → replace sample stops/durations, set `sample: false`.
6. `business.faqs` → replace the two `[Policy placeholder …]` answers (advance notice, payment).
7. `index.html` → `[Canonical URL]` and the absolute `og:image` / `twitter:image` URLs.

---

## Images config

```js
// src/data/business.js
export const images = {
  hero:      { src: heroPoster, alt: "…", placeholder: false, caption: "South coast, Christ Church" },
  islandMap: { src: islandMap,  alt: "…", placeholder: false, caption: "Island tour routes" },
  owner:     { src: "",         alt: "Portrait of Jimmy…", placeholder: true, caption: "[Photo placeholder …]" },
};
```

To drop in a real photo: put the file in `src/assets/`, import it at the top of `business.js`,
set `src` to that import and `placeholder: false`. While `placeholder: true` (or `src` is empty)
the component renders the designed gradient/SVG panel instead — so no broken images ever show.
The build inlines images into `dist/index.html`, so the page works as a single file.

---

## Connecting a real form endpoint (later)

The form currently **does not POST anywhere** — it validates, builds a summary and hands it to
WhatsApp / email / clipboard. Two easy upgrades:

### Option A — Formspree (no server code)

1. Create a form at [formspree.io](https://formspree.io) → copy the endpoint
   (`https://formspree.io/f/xxxxxxx`).
2. In `src/components/BookingForm.jsx`, replace the confirmation block's send buttons with:

```jsx
const res = await fetch("https://formspree.io/f/xxxxxxx", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ ...values, tourStops: stops, tourLabel, summary }),
});
if (res.ok) setSummary(buildSummary(values)); // show the existing confirmation
```

3. Keep the WhatsApp button as a second channel. Formspree's free tier is fine for a demo.

### Option B — Resend (your own transactional email)

1. `npm install resend`, create an API key, and verify your sending domain.
2. Add a tiny serverless function (Vercel / Netlify / Cloudflare Pages Functions) that receives
   the JSON and calls Resend:

```js
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "bookings@yourdomain.com",
  to: "jimmy@yourdomain.com",
  subject: `Booking request — ${name} — ${date}`,
  text: summary,
});
```

3. Point the `fetch` above at that function instead of Formspree.

> Never put a Resend API key in client-side code — always proxy through a function.

---

## Design notes

* **Reference:** 1960s screenprinted travel poster + a perforated taxi fare ticket.
* **Palette:** deep ocean ink `#052A2E`, ocean teal `#0C5C57`, warm sand `#F4E7D3`,
  cream `#FFF9F0`, coral sunset `#FF6A45`, sun gold `#F5B942`, warm neutral `#6F6353`.
* **Type:** Fraunces (display, italic used as a voice) + DM Sans (body, tracked small-caps
  eyebrows, tabular figures on every fare and duration).
* **Layout breaks:** asymmetric 7/5 hero with a tilted ink-bordered poster and an enamel
  contact plaque; the estimator is one die-cut ticket with a perforated stub; services are a
  numbered editorial list, not a card grid.
* **Motion:** staggered scroll reveals + a counting fare total, all disabled under
  `prefers-reduced-motion: reduce`.
* **Accessibility:** labelled inputs, `aria-invalid` + `aria-describedby` on errors,
  `aria-expanded` accordion, visible coral `:focus-visible` ring, skip link, alt text on every
  image, contrast checked against the ink/sand surfaces.

## Credits

Concept preview by InfyCrest Solutions.
