/**
 * Green Haven Residences - Parks & Green Spaces Logic
 * Handles dynamic JSON data rendering, park category filtering, and modal views.
 */

let parksData = null;

const FALLBACK_PARKS = [
  {
    id: "central-park",
    name: "Central Community Park",
    category: "Main Park",
    tagline: "The beating emerald heart of Green Haven Residences.",
    description: "The main landscaped green area of the community. Spanning over 4.5 acres, it combines expansive manicured lawns, peaceful ornamental water features, and serene shaded alcoves where neighbors gather and unwind.",
    area: "4.5 Acres",
    image: "assets/images/parks/central-park.jpg",
    icon: "assets/icons/tree.svg",
    features: [
      "Lush central amphitheater lawn",
      "Stepping-stone aquatic water features",
      "Ambient warm evening pathway illumination",
      "Pergolas draped with wisteria and bougainvillea"
    ]
  },
  {
    id: "childrens-park",
    name: "Children's Park & Adventure Realm",
    category: "Kids",
    tagline: "Safe outdoor play area designed for wonder and active play.",
    description: "Safe outdoor play area for children. Engineered with shock-absorbent eco-rubber surfacing, timber climbing towers, and dedicated toddler zones ensuring playful childhood memories under attentive parental observation.",
    area: "1.2 Acres",
    image: "assets/images/parks/childrens-park.jpg",
    icon: "assets/icons/tree.svg",
    features: [
      "Zero-injury European safety certified flooring",
      "Custom multi-tier timber rope slides & swings",
      "Filtered sand pits and sensory play stations",
      "Covered parental seating cabanas with Wi-Fi"
    ]
  },
  {
    id: "botanical-garden",
    name: "Botanical Garden & Flora Haven",
    category: "Garden",
    tagline: "A living sanctuary of oxygen-rich indigenous botanicals.",
    description: "Beautiful landscaped garden with plants and shaded seating. Curated by master horticulturists featuring over 150 therapeutic, oxygenating, and aromatic flowering species with tranquil stone benches.",
    area: "1.8 Acres",
    image: "assets/images/parks/botanical-garden.jpg",
    icon: "assets/icons/park.svg",
    features: [
      "Over 150 identified indigenous flora & medicinal species",
      "Aromatic night-blooming jasmine and lavender trails",
      "Sculpted stone meditation and reading pods",
      "Eco-friendly drip irrigation and rainwater reclamation"
    ]
  },
  {
    id: "walking-park",
    name: "Walking Garden & Forest Trail",
    category: "Wellness",
    tagline: "Dedicated jogging and relaxation paths under dense tree canopies.",
    description: "Dedicated walking and relaxation area. Meandering beneath dense green tree canopies, this multi-textured track provides a dedicated space for morning joggers, brisk strollers, and contemplative evening walks.",
    area: "2.0 Acres",
    image: "assets/images/parks/walking-park.jpg",
    icon: "assets/icons/park.svg",
    features: [
      "1.8 km continuous cushioned rubberized jogging loop",
      "Natural pebble reflexology acupressure promenade",
      "Dedicated solar-powered milestone timing markers",
      "Drinking water hydration posts along the circuit"
    ]
  },
  {
    id: "family-lawn",
    name: "Family Lawn & Celebration Meadow",
    category: "Community",
    tagline: "Open lawn for families, gatherings and community festivals.",
    description: "Open lawn for families, gatherings and community activities. A vast open green expanse designed for weekend picnics, seasonal stargazing, community farmers markets, and festive cultural get-togethers.",
    area: "2.5 Acres",
    image: "assets/images/parks/family-lawn.jpg",
    icon: "assets/icons/park.svg",
    features: [
      "Ultra-soft Bermuda grass suitable for bare-foot lounging",
      "Open-air acoustic amphitheater for community acoustic music",
      "Weekend organic farmers market designated terrace",
      "Gentle earthen mounds for picnic gatherings"
    ]
  },
  {
    id: "senior-garden",
    name: "Senior Citizen Garden & Serenity Courtyard",
    category: "Serenity",
    tagline: "Quiet landscaped area with ergonomic seating and gentle walking paths.",
    description: "Quiet landscaped area with seating and walking paths. Intentionally engineered with zero-stair barrier-free ramps, handrail supports, non-slip textured stone, and gentle water fountains creating a peaceful retreat.",
    area: "1.0 Acre",
    image: "assets/images/parks/senior-garden.jpg",
    icon: "assets/icons/park.svg",
    features: [
      "100% barrier-free zero-step accessibility",
      "Ergonomically supported teakwood and stone benches",
      "Tranquil low-decibel babbling stone water stream",
      "Herbal fragrance pavilion with neem, tulsi, and lemongrass"
    ]
  }
];

export async function loadParksData() {
  if (parksData) return parksData;
  try {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    const res = await fetch(`${basePath}data/parks.json`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    parksData = await res.json();
  } catch (err) {
    console.warn('Loading fallback parks data (local file or network offline):', err);
    parksData = FALLBACK_PARKS;
  }
  return parksData;
}

export function renderParks(parks, containerId = 'parksContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  container.innerHTML = parks.map(park => `
    <article class="park-card" data-category="${park.category}" data-id="${park.id}">
      <div class="park-img-wrap">
        <img src="${basePath}${park.image}" alt="${park.name}" class="park-img" loading="lazy">
        <span class="park-category-badge">${park.category}</span>
        <span class="park-area-badge">${park.area}</span>
      </div>

      <div class="park-body">
        <h3 class="park-name">${park.name}</h3>
        <p class="park-desc">${park.description}</p>

        <ul class="park-features-list">
          ${park.features.map(f => `
            <li class="park-feature-item">
              <svg class="park-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <div class="park-footer">
          <button class="btn btn-primary btn-park-details" data-park-id="${park.id}">
            <span>Explore Park</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  attachParkModalListeners(parks);
}

export function initParkFilters(parks) {
  const filterBtns = document.querySelectorAll('.filter-btn[data-park-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-park-filter');
      if (filterVal === 'all') {
        renderParks(parks);
      } else {
        const filtered = parks.filter(p => p.category.toLowerCase().includes(filterVal.toLowerCase()));
        renderParks(filtered);
      }
    });
  });
}

function attachParkModalListeners(parks) {
  document.querySelectorAll('.btn-park-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const parkId = btn.getAttribute('data-park-id');
      const park = parks.find(p => p.id === parkId);
      if (park) openParkModal(park);
    });
  });
}

export function openParkModal(park) {
  let modalBackdrop = document.getElementById('detailsModalBackdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'detailsModalBackdrop';
    modalBackdrop.className = 'modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  modalBackdrop.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close dialog">✕</button>
      <div style="height: 320px; overflow: hidden; position: relative;">
        <img src="${basePath}${park.image}" alt="${park.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 1.5rem; left: 2rem; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${park.category} • ${park.area}</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0;">${park.name}</h2>
        </div>
      </div>
      <div style="padding: 2.25rem;">
        <p style="font-size: 1.05rem; color: var(--color-primary-dark); font-weight: 600; line-height: 1.5; margin-bottom: 0.75rem;">
          ${park.tagline}
        </p>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.75rem;">
          ${park.description}
        </p>

        <h4 style="font-size: 1.1rem; color: var(--color-primary-dark); margin-bottom: 0.85rem;">Botanical & Landscape Highlights</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem;">
          ${park.features.map(f => `
            <li style="font-size: 0.92rem; color: var(--color-text-main); display: flex; align-items: center; gap: 0.65rem;">
              <span style="color: var(--color-accent); font-weight: bold;">✓</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="${basePath}pages/contact.html?interest=Park%20Tour" class="btn btn-primary">
            <span>Schedule Botanical Walk</span>
          </a>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modalCloseBtn');
  closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

function closeModal() {
  const modalBackdrop = document.getElementById('detailsModalBackdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}
