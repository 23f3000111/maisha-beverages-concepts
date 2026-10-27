# Maisha Beverages: website concepts

Two concept websites for **Maisha Beverages Limited**, makers of HOLA soft drinks and energy drinks (Nairobi, Kenya). Both are aimed at trade buyers: distributors, wholesalers, supermarkets, shops, hotels and events.

| | Concept | Folder | Look |
|---|---|---|---|
| A | Corporate | `site-a-corporate/` | Archivo, structured grid, arc carousel of the range, raised cards with flavour-tinted shadows |
| B | Fun | `site-b-fun/` | Bricolage Grotesque condensed caps, arched "JUST SAY HOLA!" hero, bottle fan, blob cards, sticker tags, polaroids |

`index.html` at the root is a chooser that links to both.

**Live:** https://23f3000111.github.io/maisha-beverages-concepts/

## In both concepts

- **Product range**: every flavour opens a pop-up with HOLA's own tasting copy and an "Add to my enquiry" button. Picks carry over to the form.
- **Distributor form**: validation (Kenyan phone format, county list, consent), flavour chips, a confirmation with a reference number.
- **Trade assistant chat**: rule-based, no server. It answers on distributors, prices, delivery, flavours, location, contact, quality, events and jobs, and hands off to the form, phone or email. Intents live in `shared/js/chatbot.js`.
- **Google Maps** embed (the iframe supplied), **company video** (loads YouTube only when played), Instagram, Facebook and YouTube links.
- Light theme only, sans-serif only, minimal motion (one entrance per hero, hover tilt on cards), `prefers-reduced-motion` respected.

## The form has no inbox yet

GitHub Pages cannot receive form posts, so enquiries are saved in the visitor's browser (`localStorage`, key `mb-enquiries`) and the confirmation is shown. To receive them by email, point the form at a form service such as Formspree or Web3Forms: in `shared/js/form.js`, replace the `setTimeout(...)` block in the submit handler with a `fetch()` POST of `data` to the service endpoint, and keep the confirmation code as it is.

## What is real and what to confirm with the client

**Real (from HOLA's own material):** logo, bottle cutouts and studio photos, the six-flavour photo from the Google Maps listing, Facebook photos, flavour names and descriptions (hola.co.ke), "The home of explosive flavours", "Just say HOLA", "Save your shilling, prosper", "HOLA: hi, hello, jambo", the 60-year flavour line, the address (Spectrum Business Park, Baba Dogo Road, P.O. Box 49510, 00100 Nairobi), info@hola.co.ke, the trade line 0715 537 575 (printed on HOLA's Facebook posts), and the YouTube video.

**Written for the mockup, to confirm:**
- Pack details: "single-serve PET bottle", "cases, priced by volume". Bottle volume is not shown anywhere.
- What partners get: point of sale material, posters and fridge stickers, listing and promotion support, menu ideas, delivery planned around events.
- Process and coverage lines: the three distributor steps, "we deliver to your county" answers, "made in Nairobi, close to your stores", "call ahead and the trade team will meet you".
- Counts: "10 flavours" (7 soft drinks + Energy, Energy Red Berries, Energy Green Peach & Lemongrass) and "3 energy drinks". The website also mentions bottled water; it is left out until confirmed.
- Form options: monthly volume brackets (in cases), the vehicle question.
- TikTok: the link supplied was TikTok's general About page, so no TikTok profile is linked.

## Run locally

```bash
python -m http.server 8791
# open http://127.0.0.1:8791/
```

Review tooling sits in `tools/` (image pipeline, screenshot and interaction checks) and is kept out of the repository with raw sources (`Images/`, `source-assets/`).
