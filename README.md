# Maisha Beverages: website concepts

Two concept websites for **Maisha Beverages Limited**, makers of HOLA soft drinks and energy drinks (Nairobi, Kenya). Both are aimed at trade buyers: distributors, wholesalers, supermarkets, shops, hotels and events.

| | Concept | Folder | Follows | Look |
|---|---|---|---|---|
| A | Corporate | `site-a-corporate/` | [Brio](https://brio-drinks.framer.website/) | Bricolage Grotesque, cream pill header, an arc of bottles on the colour of the flavour in front, a scroll story where each flavour takes over the page (one screen of scroll per flavour, settles on a whole flavour), big number "why" panel, rounded colour cards, a pink "Say hola on social" band |
| B | Fun | `site-b-fun/` | [Sayian](https://sayian-drinks.webflow.io/homepage/home-03) | Mona Sans condensed caps, arched "JUST SAY HOLA!", sky blue, pink, red, sunshine yellow and orange sections joined by waves, bubbles and floating fruit, sticker tags, polaroids |

`index.html` at the root is a chooser that links to both.

**Live:** https://23f3000111.github.io/maisha-beverages-concepts/

## In both concepts

- **Order desk** (`shared/js/order.js`): buy by the case in four steps.
  1. Pick stock: tap a bottle to add a case, type a number or use the steppers. All ten SKUs, with a soft drink and energy filter. The summary shows the mix as a colour bar (A) or a crate that fills with bottle caps (B).
  2. Business details, with an option to apply as a distributor at the same time.
  3. Delivery or collection, a day from the next eight working days, morning or afternoon, address, payment preference.
  4. Review with edit links, consent, send. The confirmation shows a reference, a four stage tracker, a print-ready summary and "start a new order".
  The draft order survives a reload, the header basket shows the case count, and a returning visitor can repeat their last order in one click. Flavour pop-ups, recipes, polaroids and the chat can all add cases.
- **Recipes** (`MB.recipes` in `shared/js/data.js`): twelve, each with ingredients, method and a "for your menu" tip, and a button that adds the HOLA flavours to the order.
  - With food: nyama choma with Cola, pilipili BBQ chicken with Mango Special, ugali, sukuma and fried steak with Orange, ugali and fried tilapia with Sweet Limão.
  - Mocktails: Mojito Fresca, Rosé Sunset Spritz, Mango Chilli Cooler, Very Berry Party Punch.
  - Cocktails (marked 18+): Sweet Limão Dawa, Cola Kick, Orange Sunrise, Very Berry Gin Smash.
- **Distributor form**: validation (Kenyan phone format, county list, consent) and a confirmation with a reference number.
- **Chat assistant**: rule-based, no server. It now also opens the order desk, adds cases and shows recipes. Intents live in `shared/js/chatbot.js`.
- **Social links** from `MB.socials` in `shared/js/data.js`: icons in the header, the footer and the contact area, labelled buttons in A's social band and B's feed section, and a chat answer for "instagram", "facebook" and similar. TikTok waits for the client's handle.
- **Company video** with Mr Brij Raja, Managing Director of Maisha Beverages Ltd and the visionary behind HOLA, named on both sites (loads YouTube only when played), and the **Google Maps** embed (the iframe supplied).
- **Smooth scrolling** with Lenis (`shared/js/vendor/lenis.min.js`), wheel only: touch, keyboard and reduced motion keep native scrolling. In-page links glide and land below the fixed header; the page holds still under pop-ups.
- Light sections only, sans-serif only, `prefers-reduced-motion` respected.

## Orders and forms have no inbox yet

GitHub Pages cannot receive posts, so sent orders are kept in the visitor's browser (`localStorage`: `mb-orders`, plus the draft in `mb-order-draft`) and distributor requests in `mb-enquiries`. To receive them by email or in a sheet, point both at a form service such as Formspree or Web3Forms:

- Orders: in `shared/js/order.js`, inside `send()`, replace the `setTimeout(...)` with a `fetch()` POST of `record` and call the same code when it resolves.
- Distributor form: in `shared/js/form.js`, replace the `setTimeout(...)` block in the submit handler with a `fetch()` POST of `data`.

A WhatsApp hand-off (a pre-filled message to the trade line) is easy to add once the client confirms the number takes WhatsApp.

## What is real and what to confirm with the client

**Real (from HOLA's own material):** logo, bottle cutouts and studio photos, the six-flavour photo from the Google Maps listing, Facebook photos, flavour names and descriptions (hola.co.ke), "The home of explosive flavours", "Just say HOLA", "Save your shilling, prosper", "HOLA: hi, hello, jambo", the 60-year flavour line, "refreshing Kenyans with world class beverages at an affordable price" (the video title), the address (Spectrum Business Park, Baba Dogo Road, P.O. Box 49510, 00100 Nairobi), info@hola.co.ke, the trade line 0715 537 575 (printed on HOLA's Facebook posts) and the YouTube video, and Mr Brij Raja as Managing Director and the visionary behind HOLA (named by the client for the video). The Energy Red and Energy Green bottle cutouts were lifted from the hola.co.ke banners.

**Written for the mockup, to confirm:**
- Ordering terms: no prices are shown, case sizes are not stated, minimums "depend on your area", delivery Monday to Saturday in two time windows, collection from Baba Dogo Road, payment by M-Pesa, bank transfer, cash on delivery or on account.
- Pack details: "single-serve PET bottle", "cases, priced by volume". Bottle volume is not shown anywhere.
- All twelve recipes and their menu tips, and the "Mix me" and "Liquid gold" card stickers.
- What partners get: point of sale material, posters and fridge stickers, listing and promotion support, menu ideas, delivery planned around events.
- Process and coverage lines: the three distributor steps, "we deliver to your county", "made in Nairobi, close to your stores".
- Counts: "10 flavours" (7 soft drinks plus Energy, Energy Red Berries, Energy Green Peach & Lemongrass). The website also mentions bottled water; it is left out until confirmed.
- TikTok: the link supplied was TikTok's general About page, so no TikTok profile is linked. Add it to `MB.socials` (and an icon to `shared/js/ui.js`) once the handle is known.

## Run locally

```bash
python -m http.server 8791
# open http://127.0.0.1:8791/
```

Review tooling sits in `tools/` (image pipelines, screenshot and order-flow checks) and is kept out of the repository with raw sources (`Images/`, `source-assets/`).
