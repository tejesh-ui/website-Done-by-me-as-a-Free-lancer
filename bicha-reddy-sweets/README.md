# Sweets demo

Static, responsive multi-page website. Open `index.html` directly or serve the
project root with a local static web server.

## Pages

- `index.html` — brand landing page and section previews
- `sweets.html` — sweets catalog and category filters
- `bakery.html` — bakery catalog
- `chai-spot.html` — Chai Spot catalog
- `about.html` — brand story
- `stores.html` — existing store locations and directions

## Shared files

- `components/logo.js`, `components/header.js`, `components/footer.js`, and
  `components/search.js` render common page components.
- `js/data.js` is the shared product catalog; keep product entries there.
- `js/ui.js` renders product cards and product grids.
- `js/main.js` initializes shared navigation, search, filters, and show-more
  controls on the page elements that exist.
- `css/fonts.css` keeps the locally hosted Inter and Playfair Display fonts.
- `css/style.css` contains shared card and layout styles.
- `images/bicha-reddy-logo.png` is the shared logo image; replace this file to
  update the logo throughout the header and footer.

Product image paths in `js/data.js` intentionally remain unchanged. The product
renderer resolves them from the project root so the same catalog works on every
page. Replace product image files in `images/products/` as needed.

This site needs no install or build step. `css/tailwind.css` is the existing
compiled Tailwind stylesheet.
