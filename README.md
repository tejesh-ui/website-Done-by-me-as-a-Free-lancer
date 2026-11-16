# Green Haven Residences — Residential Apartment Community Portal
> **Live Better. Live Together.**

Welcome to the **Green Haven Residences** web project. This website represents a premier, master-planned residential community featuring multiple apartment towers, 6 landscaped parks, a 35,000 sq.ft. clubhouse, resort swimming pools, athletic facilities, and multi-tier security.

The codebase is engineered with strict production separation of concerns:
**Content (JSON Data) → Logic (JavaScript) → UI (HTML Components) → Styling (CSS) → Assets (Images & Icons) → Pages (HTML)**.

---

## 📁 1. Project Directory Structure

```text
green-haven-residences/
│
├── index.html                   # Master community homepage
│
├── pages/                       # Multi-page deep dives
│   ├── apartments.html          # Residences, towers & floor plans
│   ├── amenities.html           # Full community club & sports amenities
│   ├── parks.html               # 6 botanical parks & open spaces
│   ├── gallery.html             # Categorized photo gallery with lightbox
│   ├── location.html            # Transit connectivity & neighborhood landmarks
│   ├── about.html               # Community vision & sustainability pillars
│   └── contact.html             # Site tour booking & advisor channels
│
├── ui/                          # Reusable HTML Component Templates
│   ├── header.html              # Sticky navigation & mobile hamburger
│   ├── footer.html              # Site footer, social & legal disclosures
│   ├── hero.html                # Full-width hero with floating infobar
│   ├── apartment-card.html      # Apartment card template
│   ├── amenity-card.html        # Amenity card template
│   ├── park-card.html           # Park card template
│   ├── gallery-card.html        # Gallery card template
│   └── contact-section.html     # Visit reservation form & channels
│
├── css/                         # Modular CSS Architecture
│   ├── global.css               # Design system tokens, variables, typography, modals
│   ├── header.css               # Sticky header & mobile navigation drawer
│   ├── hero.css                 # Hero section & floating metrics infobar
│   ├── apartments.css           # Residences, tower cards & spec badges
│   ├── amenities.css            # Amenity cards, clubhouse split & pool spotlight
│   ├── parks.css                # Botanical park cards & park experience gallery
│   ├── gallery.css              # CSS Grid photo gallery & lightbox modal
│   ├── contact.css              # Visit reservation form, validation & channels
│   └── responsive.css           # Breakpoints, mobile rules, footer & final CTA
│
├── js/                          # Modular Application Logic
│   ├── app.js                   # Master application controller
│   ├── navigation.js            # Sticky scroll, mobile drawer & active states
│   ├── apartments.js            # Towers & apartment units rendering & filtering
│   ├── amenities.js             # Amenity cards rendering & category filters
│   ├── parks.js                 # Botanical parks rendering & category filters
│   ├── gallery.js               # Photo gallery rendering & fullscreen lightbox
│   ├── search.js                # Universal community search across all entities
│   └── contact.js               # Visit form validation & feedback logic
│
├── data/                        # JSON Data Layer
│   ├── apartments.json          # Towers & unit configurations
│   ├── amenities.json           # All community recreation & club features
│   ├── parks.json               # The 6 landscaped botanical parks
│   ├── gallery.json             # Categorized photos metadata
│   └── locations.json           # Nearby landmarks & travel times
│
├── assets/                      # Real Images & Vector Assets
│   ├── images/
│   │   ├── hero/                # community-hero.jpg, aerial-community.jpg
│   │   ├── buildings/           # building-a.jpg, building-b.jpg, building-c.jpg, building-d.jpg
│   │   ├── apartments/          # apt-2bhk.jpg, apt-3bhk.jpg, apt-4bhk.jpg, apt-penthouse.jpg
│   │   ├── interiors/           # living-room.jpg, bedroom.jpg, kitchen.jpg, balcony.jpg
│   │   ├── parks/               # central-park.jpg, childrens-park.jpg, botanical-garden.jpg, ...
│   │   ├── amenities/           # clubhouse.jpg, swimming-pool.jpg, gym.jpg, sports-court.jpg, ...
│   │   ├── clubhouse/           # clubhouse.jpg, lounge.jpg, community-hall.jpg
│   │   ├── swimming-pool/       # swimming-pool.jpg, pool-deck.jpg, kids-pool.jpg
│   │   ├── gym/                 # gym.jpg, cardio.jpg
│   │   ├── playground/          # playground.jpg, kids-area.jpg
│   │   └── gallery/             # gallery-1.jpg through gallery-12.jpg
│   ├── icons/                   # 23 clean SVG icons (bed, bath, area, tree, pool, ...)
│   └── logos/                   # logo.svg, logo-white.svg, logo-mark.svg
│
└── README.md                    # Comprehensive documentation
```

---

## 📌 2. Where Key Files Are Located

| Responsibility | Folder Location | Example Files |
| :--- | :--- | :--- |
| **HTML UI Components** | `ui/` | `header.html`, `park-card.html`, `apartment-card.html` |
| **CSS Stylesheets** | `css/` | `global.css`, `hero.css`, `parks.css`, `gallery.css` |
| **JavaScript Logic** | `js/` | `app.js`, `parks.js`, `gallery.js`, `search.js` |
| **Content & Data** | `data/` | `apartments.json`, `parks.json`, `amenities.json` |
| **Photography & Graphics** | `assets/images/`, `assets/icons/` | `assets/images/parks/central-park.jpg` |

---

## 🔗 3. How the Files Connect

The application follows a clean unidirectional flow:

```text
       [ data/*.json ]  (Content & Specifications)
              │
              ▼
       [ js/*.js ]      (Data Fetching, Filtering & Lightbox Logic)
              │
              ▼
   [ ui/*.html Templates ]  (Visual Structure)
              │
              ▼
       [ css/*.css ]    (Design System & Responsive Layouts)
              │
              ▼
       [ index.html / pages/*.html ]  (Rendered Pages)
```

1. Each HTML page imports the modular CSS files inside `<head>`.
2. The page loads `<script type="module" src="js/app.js"></script>`.
3. `js/app.js` runs on page load, initializes navigation, and fetches the required `data/*.json` files.
4. If running locally as a `file://` scheme where browsers restrict `fetch()`, the scripts automatically failover to built-in fallbacks so the site remains 100% operational with 0 console crashes.
5. Filter buttons dynamically re-render cards into grid containers (`#apartmentsContainer`, `#parksContainer`, `#galleryContainer`, etc.).

---

## 🚀 4. How to Run the Website

You can run the project in any standard browser using any of the following methods:

### Option A: Local HTTP Server (Recommended)
Using Python (pre-installed on most systems):
```bash
cd green-haven-residences
python -m http.server 8080
```
Then visit: `http://localhost:8080`

Using Node.js (via `npx serve`):
```bash
cd green-haven-residences
npx serve .
```

### Option B: VS Code Live Server
1. Open the `green-haven-residences` folder in VS Code.
2. Right click `index.html` and select **"Open with Live Server"**.

### Option C: Direct File Opening
Double-click `index.html` directly in your file explorer. Thanks to the built-in data failovers, all components and interactive features will work smoothly.

---

## 🖼️ 5. How to Replace Images

Every photograph is stored in a clean directory under `assets/images/`.

To replace an image:
1. Save your new photo with the exact same filename into the corresponding folder:
   - To replace the main community park photo: overwrite `assets/images/parks/central-park.jpg`
   - To replace the clubhouse photo: overwrite `assets/images/clubhouse/clubhouse.jpg`
   - To replace the 3 BHK photo: overwrite `assets/images/apartments/apt-3bhk.jpg`
2. No code changes are required! The website will automatically display your new image.

---

## ➕ 6. How to Add New Content

### How to Add a New Apartment Unit
Open `data/apartments.json` and add a new entry to the `"units"` array:
```json
{
  "id": "unit-5bhk-penthouse",
  "type": "5 BHK",
  "category": "Penthouse",
  "title": "Presidential Sky Palace",
  "subtitle": "Spanning entire top floor with private plunge pool and 360-degree vistas.",
  "bedrooms": 5,
  "bathrooms": 6,
  "balconies": 4,
  "area": "4,500 sq.ft.",
  "carpetArea": "3,800 sq.ft.",
  "parking": "3 Dedicated Covered Bays",
  "facing": "Panoramic 360",
  "image": "assets/images/apartments/apt-penthouse.jpg",
  "towers": ["Tower C"],
  "highlights": [
    "Private Heated Plunge Pool",
    "Double-Height Living Salon",
    "Private Direct Elevator Lobby",
    "Personal Gymnasium Suite"
  ]
}
```
Refresh the page. The new apartment will appear automatically with its filter badges and detail modal.

### How to Add a New Park
Open `data/parks.json` and add your new park:
```json
{
  "id": "zen-garden",
  "name": "Zen Rock & Reflection Garden",
  "category": "Serenity",
  "tagline": "Minimalist Japanese-inspired stone and water retreat.",
  "description": "Raked white gravel patterns, sculptured bonsai trees, and gentle bamboo water features designed for quiet contemplation.",
  "area": "1.5 Acres",
  "image": "assets/images/parks/botanical-garden.jpg",
  "icon": "assets/icons/tree.svg",
  "features": [
    "Hand-raked white quartz gravel gardens",
    "Natural slate reflection ponds with koi",
    "Covered meditation pavilions",
    "Bamboo wind chimes & ambient stillness"
  ]
}
```

### How to Add a New Amenity
Open `data/amenities.json` and add an entry:
```json
{
  "id": "pickleball-court",
  "name": "Pickleball & Padel Arena",
  "category": "Sports",
  "icon": "assets/icons/sports.svg",
  "image": "assets/images/amenities/sports-court.jpg",
  "shortDescription": "Dual regulation acrylic-cushioned pickleball courts with tournament LED floodlights.",
  "longDescription": "High-speed outdoor pickleball and padel courts engineered with cushioned multi-layer acrylic surfacing and spectator pavilions.",
  "highlights": [
    "Dual tournament-size courts",
    "Anti-glare LED evening floodlighting",
    "Shock-absorbent cushioned court surface",
    "Equipment check-out desk at clubhouse"
  ]
}
```

---

## 🎨 7. Design System Guidelines

- **Primary Emerald Green:** `#184e3f` (Deep forest resilience)
- **Architectural Gold:** `#c49a45` (Warm refined luxury)
- **Background Body:** `#fdfdfc` (Warm luxury off-white)
- **Body Font:** `'Plus Jakarta Sans', sans-serif`
- **Headings Font:** `'Playfair Display', Georgia, serif`
- **Display Monogram:** `'Cinzel', serif`

---

## 🔒 8. Verification & Compliance Checklist

- [x] Full folder separation: HTML / UI / CSS / JS / Data / Images
- [x] No large base64 strings embedded in HTML
- [x] No single giant HTML or CSS file
- [x] Responsive on Desktop, Laptop, Tablet, and Mobile
- [x] Real-time community search filter (`js/search.js`)
- [x] Fullscreen photo lightbox (`js/gallery.js`)
- [x] Interactive apartment & park detail modals
- [x] Accessible navigation with mobile drawer and ARIA landmarks
- [x] Zero console errors or broken asset references

*Green Haven Residences — Designed for Better Living.*
