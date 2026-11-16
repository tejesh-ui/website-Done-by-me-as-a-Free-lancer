# VESTRA — clothing store website (static)

Plain HTML, CSS and JavaScript. No build step, no installs.
"VESTRA" is a placeholder store name — see "Before launch" below.

## Run it
From this folder:

    python3 -m http.server 8000

then open http://localhost:8000 . (Or use VS Code "Live Server".)
Open it through a server, not by double-clicking the files: product data is loaded with JavaScript.

## Folder map
- `index.html` — home page
- `pages/` — About, Shop (all categories), Men, Women, Accessories, Gifting, Festive wear, Personal styling, Uniforms & bulk orders, Lookbook, Stores, Contact, FAQ, product details, policies
- `js/data.js` — **all editable content**: business details, every product (name, category, price, sizes, colours, image), stores, testimonials
- `js/components.js` — header, footer, search, product cards, enquiry form
- `js/main.js`, `js/navigation.js` — behaviour (hero carousel, filters, tabs, search, size picker, lookbook viewer, enquiry form)
- `css/` — `style.css` (colours, fonts), `components.css`, `responsive.css`
- `assets/images/` — pictures; `assets/fonts/` — Cormorant Garamond and DM Sans (open-source, self-hosted)

## Adding or editing a product
Open `js/data.js`, copy a line in `menData`, `womenData` or `accessoryData`, and change:
`id` (m = men, w = women, a = accessories + a unique number), `name`, `category`, `price`, `sizes`, `colors`, `image`, `description`.
Categories used by the filter buttons on the Men and Women pages must match the button names in `pages/men.html` / `pages/women.html`.

## YOUR LOGO
1. Replace `assets/images/logo/vestra-logo.png` with your logo (same file name); also replace `favicon-48.png` and `apple-touch-icon.png`.
2. Logo styling has its own block in `css/components.css` → "VESTRA LOGO": classes `.vestra-logo`, `.vestra-logo__img`, `.vestra-logo__text`. Change `--vestra-logo-w`, `--vestra-logo-w-sm`, `--vestra-logo-w-mobile` for size. If your logo already contains the store name, set `--vestra-logo-text-display: none;`.

## Images
The pictures supplied are **illustrations generated for layout**, not photographs.
To use real product photos, overwrite the files in `assets/images/men|women|accessories` using the same file names (portrait, about 800×1000 JPG). `brand/` and `stores/` images are landscape.

## Before launch — replace the placeholders
- **Store name:** `VESTRA` — change it in `js/data.js` (`SITE`), and search the project for `VESTRA` to update page titles and text.
- **Phone / WhatsApp:** search for `0000000000` (links) and `00000 00000` (display text) and replace; also update `js/data.js` → `SITE`.
- Email `hello@vestrastore.com`, head-office address, opening hours (`SITE.hours`) and social links in `js/data.js`.
- **Prices, sizes and colours** in `js/data.js` are samples. Set `price: null` to hide a price.
- **Stores** in `js/data.js` → `STORES` (names, addresses, map links) — samples only; delete or edit.
- **Testimonials** in `js/data.js` → `TESTIMONIALS` — samples only; use real reviews or set to `[]`.
- Policies in `pages/privacy-policy.html`, `terms-conditions.html`, `refund-policy.html` are templates (exchange window, final-sale items etc.) — edit to match your real policy and have them reviewed.
- `robots.txt` and `sitemap.xml`: replace `example.com` with your domain.

## Ordering and enquiries
Static site, so there is no checkout. Product pages have an **Order on WhatsApp** button (includes the chosen size), and the enquiry form opens a pre-filled WhatsApp message (or email) for the visitor to send.
