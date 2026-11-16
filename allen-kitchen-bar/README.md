# ALLEN Kitchen & Bar — static website

Plain HTML, CSS and JavaScript. No build step, no installs.

## Run it
From this folder:

    python3 -m http.server 8000

then open http://localhost:8000 . (Or use VS Code "Live Server".)
Open it through a server, not by double-clicking the files: the pages load menu data with JavaScript.

## Folder map
- `index.html` — home page
- `pages/` — About, Menu, Kitchen, Bar, Desserts, Party platters, Special nights, Private dining, Corporate events, Gallery, Outlets, Contact, FAQ, dish details, policies
- `js/data.js` — **all editable content**: business details, every dish/drink/dessert, outlets, testimonials
- `js/components.js` — header, footer, search, cards, enquiry form
- `js/main.js`, `js/navigation.js` — behaviour (hero carousel, filters, tabs, search, gallery lightbox, enquiry form)
- `css/` — `style.css` (theme tokens, fonts), `components.css`, `responsive.css`
- `assets/images/` — all photos; `assets/fonts/` — Bebas Neue and Manrope (open-source, self-hosted)

## YOUR LOGO
1. Replace `assets/images/logo/allen-logo.png` with your logo (same file name).
   Also replace `favicon-48.png` and `apple-touch-icon.png` in the same folder.
2. Logo styling lives in its own block in `css/components.css` → "ALLEN LOGO":
   classes `.allen-logo`, `.allen-logo__img`, `.allen-logo__text`.
   Change `--allen-logo-w`, `--allen-logo-w-sm`, `--allen-logo-w-mobile` for size.
   If your logo already contains the word ALLEN, set `--allen-logo-text-display: none;`.

## Images
The pictures supplied are **illustrations generated for layout**, not photographs.
To use real photos, overwrite the files in `assets/images/` keeping the same file names
(dishes are 800×800 JPG; `brand/` and `stores/` images are landscape ~1600×1000 / 960×600).

## Before launch — replace the placeholders
- Phone / WhatsApp: search the project for `0000000000` (links) and `00000 00000` (display text) and replace; also update `js/data.js` → `SITE`.
- Email `hello@allenkitchenbar.com`, head-office address, opening hours (`SITE.hours`) and social links in `js/data.js`.
- Outlets in `js/data.js` → `STORES` (names, addresses, map links) — samples only; delete or edit.
- Testimonials in `js/data.js` → `TESTIMONIALS` — samples only; use real reviews or set to `[]`.
- Menu items/descriptions in `js/data.js`; add prices only if you want them shown.
- Policies in `pages/privacy-policy.html`, `terms-conditions.html`, `refund-policy.html` are templates — have them reviewed.
- `robots.txt` and `sitemap.xml`: replace `example.com` with your domain.
- Alcohol notices appear in the footer, Bar page, FAQ and Terms; adjust to your licence and local rules.

## Enquiry form
Static site, so the form opens a pre-filled WhatsApp message (or email) for the visitor to send.
