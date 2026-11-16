/**
 * Green Haven Residences - Apartments & Towers Logic
 * Handles dynamic JSON data rendering, apartment filtering, and detail modal views.
 */

let apartmentsData = null;

// Built-in fallback data for local file:// execution without web server
const FALLBACK_APARTMENTS = {
  towers: [
    {
      id: "tower-a",
      name: "Tower A - Elm Crest",
      tagline: "Modern residential tower with spacious apartments.",
      floors: 24,
      units: 96,
      types: ["2 BHK", "3 BHK"],
      image: "assets/images/buildings/building-a.jpg",
      description: "Standing proudly on the eastern boulevard, Tower A offers panoramic morning sunrise vistas, direct access to the reflexology walking track, and whisper-quiet family homes.",
      completion: "Ready to Move",
      elevators: 4
    },
    {
      id: "tower-b",
      name: "Tower B - Cedar Point",
      tagline: "Contemporary family residences with landscaped views.",
      floors: 28,
      units: 112,
      types: ["3 BHK", "4 BHK"],
      image: "assets/images/buildings/building-b.jpg",
      description: "Designed for modern multi-generational families, Tower B overlooks the Central Botanical Garden with wide wrap-around balconies and expansive corner living layouts.",
      completion: "Ready to Move",
      elevators: 4
    },
    {
      id: "tower-c",
      name: "Tower C - Aspen Heights",
      tagline: "Premium apartments close to the central community amenities.",
      floors: 26,
      units: 78,
      types: ["3 BHK", "4 BHK", "Sky Penthouse"],
      image: "assets/images/buildings/building-c.jpg",
      description: "The crown jewel of Green Haven, Tower C is immediately adjacent to the Grand Clubhouse, swimming pavilions, and features double-height luxury penthouse residences.",
      completion: "Ready to Move",
      elevators: 4
    },
    {
      id: "tower-d",
      name: "Tower D - Willow Park",
      tagline: "Modern residences designed around open green spaces.",
      floors: 22,
      units: 88,
      types: ["2 BHK", "3 BHK"],
      image: "assets/images/buildings/building-d.jpg",
      description: "Nestled alongside the Family Lawn and Children's Adventure Zone, Tower D offers serene, bird-chirping greenery and an intimate, peaceful neighborhood vibe.",
      completion: "Ready to Move",
      elevators: 3
    }
  ],
  units: [
    {
      id: "unit-2bhk",
      type: "2 BHK",
      category: "2 BHK",
      title: "Contemporary 2 BHK Luxury Residence",
      subtitle: "Comfortable family apartment with optimal spatial efficiency.",
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      area: "1,250 sq.ft.",
      carpetArea: "980 sq.ft.",
      parking: "1 Covered Space",
      facing: "East / Garden Facing",
      image: "assets/images/apartments/apt-2bhk.jpg",
      towers: ["Tower A", "Tower D"],
      highlights: [
        "Vastu Compliant Layout",
        "Modular Italian-Style Kitchen",
        "Master Suite with Balcony Access",
        "Acoustic Double-Glazed Windows"
      ],
      interiorImages: [
        "assets/images/interiors/living-room.jpg",
        "assets/images/interiors/kitchen.jpg"
      ]
    },
    {
      id: "unit-3bhk",
      type: "3 BHK",
      category: "3 BHK",
      title: "Grand 3 BHK Family Residence",
      subtitle: "Spacious home for growing families seeking elegance and tranquility.",
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      area: "1,850 sq.ft.",
      carpetArea: "1,490 sq.ft.",
      parking: "2 Covered Spaces",
      facing: "North-East / Central Park View",
      image: "assets/images/apartments/apt-3bhk.jpg",
      towers: ["Tower A", "Tower B", "Tower C"],
      highlights: [
        "Dual Cross-Ventilated Balconies",
        "Separate Utility & Pantry Space",
        "Walk-In Closet in Primary Bedroom",
        "Foyer Entrance for Privacy"
      ],
      interiorImages: [
        "assets/images/interiors/living-room.jpg",
        "assets/images/interiors/bedroom.jpg",
        "assets/images/interiors/balcony.jpg"
      ]
    },
    {
      id: "unit-4bhk",
      type: "4 BHK",
      category: "4 BHK",
      title: "Executive 4 BHK Royal Residence",
      subtitle: "Premium large-format residence tailored for gracious entertaining.",
      bedrooms: 4,
      bathrooms: 4,
      balconies: 3,
      area: "2,650 sq.ft.",
      carpetArea: "2,150 sq.ft.",
      parking: "2 Covered Spaces + EV",
      facing: "Park & Lake Horizon View",
      image: "assets/images/apartments/apt-4bhk.jpg",
      towers: ["Tower B", "Tower C"],
      highlights: [
        "Separate House-Help Quarters & Bath",
        "Expansive 28-ft Living & Dining Deck",
        "Smart Home Lighting & Climate Controls",
        "Master Suite with Spa Bathtub"
      ],
      interiorImages: [
        "assets/images/interiors/living-room.jpg",
        "assets/images/interiors/bedroom.jpg",
        "assets/images/interiors/kitchen.jpg",
        "assets/images/interiors/balcony.jpg"
      ]
    },
    {
      id: "unit-penthouse",
      type: "Sky Penthouse",
      category: "Penthouse",
      title: "Signature Sky Penthouse Duplex",
      subtitle: "An exclusive limited-collection rooftop residence overlooking the skyline.",
      bedrooms: 4,
      bathrooms: 5,
      balconies: 4,
      area: "3,800 sq.ft.",
      carpetArea: "3,100 sq.ft.",
      parking: "3 Covered Spaces + Fast EV",
      facing: "360-Degree Panoramic Horizon",
      image: "assets/images/apartments/apt-penthouse.jpg",
      towers: ["Tower C"],
      highlights: [
        "Private Landscaped Sky Terrace",
        "Double-Height Glass Living Salon",
        "Private Elevator Access to Top Level",
        "Designer Jacuzzi & Sun Deck"
      ],
      interiorImages: [
        "assets/images/apartments/apt-penthouse.jpg",
        "assets/images/interiors/living-room.jpg",
        "assets/images/interiors/balcony.jpg"
      ]
    }
  ]
};

export async function loadApartmentsData() {
  if (apartmentsData) return apartmentsData;
  try {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    const res = await fetch(`${basePath}data/apartments.json`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    apartmentsData = await res.json();
  } catch (err) {
    console.warn('Loading fallback apartments data (local file or network offline):', err);
    apartmentsData = FALLBACK_APARTMENTS;
  }
  return apartmentsData;
}

export function renderTowers(towers, containerId = 'towersContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  container.innerHTML = towers.map(tower => `
    <article class="tower-card" data-id="${tower.id}">
      <div class="tower-img-wrap">
        <img src="${basePath}${tower.image}" alt="${tower.name}" class="tower-img" loading="lazy">
        <span class="tower-badge">${tower.completion}</span>
      </div>
      <div class="tower-body">
        <h3 class="tower-name">${tower.name}</h3>
        <p class="tower-tagline">${tower.tagline}</p>
        
        <div class="tower-stats-grid">
          <div class="tower-stat-item">
            <span class="tower-stat-label">Floors</span>
            <span class="tower-stat-value">${tower.floors} Levels</span>
          </div>
          <div class="tower-stat-item">
            <span class="tower-stat-label">Elevators</span>
            <span class="tower-stat-value">${tower.elevators} High-Speed</span>
          </div>
        </div>

        <div class="tower-types-pills">
          ${tower.types.map(t => `<span class="tower-type-pill">${t}</span>`).join('')}
        </div>

        <div class="tower-footer">
          <button class="btn btn-secondary btn-tower-details" data-tower-id="${tower.id}" style="width: 100%;">
            <span>View Tower Specs</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  attachTowerModalListeners(towers);
}

export function renderApartments(units, containerId = 'apartmentsContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  container.innerHTML = units.map(unit => `
    <article class="apartment-card" data-category="${unit.category}" data-id="${unit.id}">
      <div class="apartment-img-wrap">
        <img src="${basePath}${unit.image}" alt="${unit.title}" class="apartment-img" loading="lazy">
        <span class="apartment-category-tag">${unit.type}</span>
        <span class="apartment-area-tag">${unit.area}</span>
      </div>
      <div class="apartment-body">
        <h3 class="apartment-title">${unit.title}</h3>
        <p class="apartment-desc">${unit.subtitle}</p>

        <div class="specs-grid">
          <div class="spec-item">
            <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
            <span class="spec-label">${unit.bedrooms} Beds</span>
          </div>
          <div class="spec-item">
            <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.7 2.5 4 3.2 4 4v2M2 12h20a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-2a2 2 0 0 1 2-2Z"/><path d="M7 12v-6M4 20v2M20 20v2"/></svg>
            <span class="spec-label">${unit.bathrooms} Baths</span>
          </div>
          <div class="spec-item">
            <svg class="spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
            <span class="spec-label">${unit.parking}</span>
          </div>
        </div>

        <ul class="highlights-list">
          ${unit.highlights.slice(0, 3).map(h => `<li class="highlight-item">${h}</li>`).join('')}
        </ul>

        <div class="apartment-footer">
          <button class="btn btn-secondary btn-unit-details" data-unit-id="${unit.id}">
            <span>View Details</span>
          </button>
          <a href="${basePath}pages/contact.html?interest=${encodeURIComponent(unit.type)}" class="btn btn-primary">
            <span>Book Tour</span>
          </a>
        </div>
      </div>
    </article>
  `).join('');

  attachUnitModalListeners(units);
}

export function initApartmentFilters(units) {
  const filterBtns = document.querySelectorAll('.filter-btn[data-apartment-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-apartment-filter');
      if (filterVal === 'all') {
        renderApartments(units);
      } else {
        const filtered = units.filter(u => u.category === filterVal || u.type.includes(filterVal));
        renderApartments(filtered);
      }
    });
  });
}

function attachUnitModalListeners(units) {
  document.querySelectorAll('.btn-unit-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const unitId = btn.getAttribute('data-unit-id');
      const unit = units.find(u => u.id === unitId);
      if (unit) openApartmentModal(unit);
    });
  });
}

function attachTowerModalListeners(towers) {
  document.querySelectorAll('.btn-tower-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const towerId = btn.getAttribute('data-tower-id');
      const tower = towers.find(t => t.id === towerId);
      if (tower) openTowerModal(tower);
    });
  });
}

export function openApartmentModal(unit) {
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
      <div style="height: 300px; overflow: hidden; position: relative;">
        <img src="${basePath}${unit.image}" alt="${unit.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 1.5rem; left: 2rem; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${unit.type} Residence</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0;">${unit.title}</h2>
        </div>
      </div>
      <div style="padding: 2rem;">
        <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
          ${unit.subtitle}
        </p>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; background: var(--color-bg-subtle); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Area</span><br><strong>${unit.area}</strong></div>
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Bedrooms</span><br><strong>${unit.bedrooms} Suites</strong></div>
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Bathrooms</span><br><strong>${unit.bathrooms} Baths</strong></div>
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Orientation</span><br><strong>${unit.facing}</strong></div>
        </div>

        <h4 style="font-size: 1.1rem; color: var(--color-primary-dark); margin-bottom: 0.75rem;">Residence Highlights</h4>
        <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 2rem;">
          ${unit.highlights.map(h => `<li style="font-size: 0.9rem; color: var(--color-text-main); display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent); font-weight: bold;">✓</span> ${h}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="${basePath}pages/contact.html?interest=${encodeURIComponent(unit.type)}" class="btn btn-primary">
            <span>Schedule Model Tour</span>
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

export function openTowerModal(tower) {
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
      <div style="height: 280px; overflow: hidden; position: relative;">
        <img src="${basePath}${tower.image}" alt="${tower.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 1.5rem; left: 2rem; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${tower.completion}</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0;">${tower.name}</h2>
        </div>
      </div>
      <div style="padding: 2rem;">
        <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
          ${tower.description}
        </p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: var(--color-bg-subtle); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Floors</span><br><strong>${tower.floors} Storeys</strong></div>
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Elevators</span><br><strong>${tower.elevators} Smart Elevators</strong></div>
          <div><span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Available Layouts</span><br><strong>${tower.types.join(', ')}</strong></div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="${basePath}pages/contact.html?interest=${encodeURIComponent(tower.name)}" class="btn btn-primary">
            <span>Inquire About ${tower.name}</span>
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
