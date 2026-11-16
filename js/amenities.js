/**
 * Green Haven Residences - Amenities Logic
 * Handles dynamic JSON rendering, amenity filtering, and modal detail views.
 */

let amenitiesData = null;

const FALLBACK_AMENITIES = [
  {
    id: "clubhouse",
    name: "The Grand Clubhouse",
    category: "Social",
    icon: "assets/icons/clubhouse.svg",
    image: "assets/images/amenities/clubhouse.jpg",
    shortDescription: "Community gathering and recreation space spanning 35,000 sq.ft. of luxury amenities.",
    longDescription: "The centerpiece of social vitality at Green Haven Residences. Featuring private lounges, an executive cafe, multipurpose banquet suites, a library lounge, and dedicated concierge services.",
    highlights: [
      "Resident lounge & cafe bar",
      "Private screening mini-theater",
      "Banquet & celebration suites",
      "High-speed Wi-Fi co-working suites"
    ]
  },
  {
    id: "swimming-pool",
    name: "Resort Swimming Pool & Aqua Deck",
    category: "Wellness",
    icon: "assets/icons/pool.svg",
    image: "assets/images/amenities/swimming-pool.jpg",
    shortDescription: "Modern swimming and relaxation area with temperature-controlled lap lanes and kids pool.",
    longDescription: "A glittering aquatic retreat featuring a semi-Olympic sized infinity lap pool, shallow splash lagoon for toddlers, teak-decked cabanas, and sunken lounger seats enveloped in tropical palms.",
    highlights: [
      "Semi-Olympic infinity lap pool",
      "Toddlers splash pool with anti-slip bottom",
      "Lush poolside sun decks with private cabanas",
      "Heated jacuzzi and hydrotherapy zone"
    ]
  },
  {
    id: "gym",
    name: "Fully Equipped Fitness Centre",
    category: "Fitness",
    icon: "assets/icons/gym.svg",
    image: "assets/images/amenities/gym.jpg",
    shortDescription: "Fitness area with modern equipment, free weights, and cardio studios.",
    longDescription: "A multi-level conditioning gymnasium outfitted with top-tier biomechanical strength stations, smart cardio machines with interactive screens, dedicated free-weight zones, and certified resident trainers.",
    highlights: [
      "TechnoGym biomechanical weight machines",
      "Panoramic cardio zone overlooking central park",
      "TRX and functional training rig",
      "Certified trainers & personalized workout programs"
    ]
  },
  {
    id: "children-play-area",
    name: "Children's Play Area & Toddler Arena",
    category: "Family",
    icon: "assets/icons/tree.svg",
    image: "assets/images/playground/playground.jpg",
    shortDescription: "Dedicated safe recreation area with tactile play structures and protective flooring.",
    longDescription: "Crafted with child safety as the prime parameter. Features colorful climbing blocks, zip lines, swings, and interactive outdoor sensory games on certified impact-absorbent rubber flooring.",
    highlights: [
      "Child-safe non-toxic materials throughout",
      "Soft padded rubber impact surfacing",
      "Continuous CCTV coverage and attentive security",
      "Adjacent shaded pergola seating for parents"
    ]
  },
  {
    id: "indoor-games",
    name: "Indoor Games & Billiards Lounge",
    category: "Recreation",
    icon: "assets/icons/sports.svg",
    image: "assets/images/amenities/indoor-games.jpg",
    shortDescription: "Indoor recreational activities including table tennis, billiards, and board games.",
    longDescription: "A climate-controlled leisure space designed for friendly neighborhood tournaments or relaxed family weekends. Includes championship pool tables, table tennis, foosball, carrom, and chess tables.",
    highlights: [
      "Championship slate 8-ball and 9-ball tables",
      "Dual tournament-grade table tennis tables",
      "Acoustically insulated gaming consoles room",
      "Dedicated chess, carrom, and board game booths"
    ]
  },
  {
    id: "sports-court",
    name: "Multipurpose Sports Courts",
    category: "Sports",
    icon: "assets/icons/sports.svg",
    image: "assets/images/amenities/sports-court.jpg",
    shortDescription: "Space for outdoor sports including tennis, basketball, and badminton.",
    longDescription: "High-performance all-weather multi-sport courts equipped with tournament-grade floodlighting, rebound shock-absorption acrylic surfacing, and secure spectator netting.",
    highlights: [
      "Full-sized regulation basketball court",
      "Synthetic turf tennis / pickleball court",
      "LED high-lux night floodlights for evening games",
      "Tiered bleacher seating for neighborhood tournaments"
    ]
  },
  {
    id: "community-hall",
    name: "Grand Community Hall & Banquet",
    category: "Social",
    icon: "assets/icons/clubhouse.svg",
    image: "assets/images/amenities/community-hall.jpg",
    shortDescription: "Venue for celebrations, birthdays, weddings, and community cultural events.",
    longDescription: "An opulent 300-capacity community hall with pre-function foyer, dedicated caterer's prep kitchen, state-of-the-art audiovisual system, and elegant chandeliers for milestone gatherings.",
    highlights: [
      "Accommodates up to 300 guests with dining layout",
      "Integrated acoustic ceiling and digital surround audio",
      "Dedicated commercial-grade staging and green rooms",
      "Spill-out garden lawn for al fresco celebrations"
    ]
  },
  {
    id: "yoga-meditation",
    name: "Yoga & Meditation Pavilion",
    category: "Wellness",
    icon: "assets/icons/tree.svg",
    image: "assets/images/amenities/yoga-meditation.jpg",
    shortDescription: "Peaceful wellness space surrounded by tranquil bamboo groves and water bodies.",
    longDescription: "Engineered for holistic mental clarity. A peaceful open-air hardwood pavilion shielded by tall bamboo groves and gentle reflection ponds, holding daily guided sunrise and pranayama sessions.",
    highlights: [
      "Open-air natural teakwood yoga deck",
      "Reflective shallow koi and lotus water body",
      "Daily guided sunrise and pranayama sessions",
      "Peaceful acoustic isolation from vehicular pathways"
    ]
  },
  {
    id: "walking-track",
    name: "Elevated Green Walking Track",
    category: "Fitness",
    icon: "assets/icons/park.svg",
    image: "assets/images/amenities/walking-track.jpg",
    shortDescription: "Dedicated walking and jogging path through lush landscaped greenery.",
    longDescription: "A dedicated non-motorized loop that winds uninterrupted through the residential perimeter and botanical gardens. Fitted with low-impact polyurethane running surface and distance counters.",
    highlights: [
      "2.2 km continuous loop with zero vehicular crossing",
      "Triple-layered polyurethane joint-friendly track",
      "Solar luminaire trail for safe late-night walks",
      "Emergency panic buttons and call pillars every 200m"
    ]
  },
  {
    id: "multipurpose-lawn",
    name: "Multipurpose Community Lawn",
    category: "Outdoors",
    icon: "assets/icons/park.svg",
    image: "assets/images/parks/family-lawn.jpg",
    shortDescription: "Open outdoor space for community activities, festivals, and sports practice.",
    longDescription: "A massive manicured emerald lawn that transforms seamlessly into a festival ground, yoga lawn, or weekend open-air movie screening amphitheater under the open stars.",
    highlights: [
      "Natural Bermuda grass with sub-surface drainage",
      "Power hookups for festive lighting and projector setups",
      "Perimeter seating steps lined with blossoming trees",
      "Safe open grounds for weekend family kite flying and games"
    ]
  }
];

export async function loadAmenitiesData() {
  if (amenitiesData) return amenitiesData;
  try {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    const res = await fetch(`${basePath}data/amenities.json`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    amenitiesData = await res.json();
  } catch (err) {
    console.warn('Loading fallback amenities data (local file or network offline):', err);
    amenitiesData = FALLBACK_AMENITIES;
  }
  return amenitiesData;
}

export function renderAmenities(amenities, containerId = 'amenitiesContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  container.innerHTML = amenities.map(amenity => `
    <article class="amenity-card" data-category="${amenity.category}" data-id="${amenity.id}">
      <div class="amenity-img-wrap">
        <img src="${basePath}${amenity.image}" alt="${amenity.name}" class="amenity-img" loading="lazy">
        <div class="amenity-icon-badge">
          <img src="${basePath}${amenity.icon}" alt="${amenity.name} icon" width="22" height="22">
        </div>
      </div>

      <div class="amenity-body">
        <h3 class="amenity-title">${amenity.name}</h3>
        <p class="amenity-desc">${amenity.shortDescription}</p>

        <div class="amenity-footer">
          <span class="amenity-cat">${amenity.category}</span>
          <button class="btn btn-secondary btn-amenity-details" data-amenity-id="${amenity.id}">
            <span>Learn More</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  attachAmenityModalListeners(amenities);
}

export function initAmenityFilters(amenities) {
  const filterBtns = document.querySelectorAll('.filter-btn[data-amenity-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-amenity-filter');
      if (filterVal === 'all') {
        renderAmenities(amenities);
      } else {
        const filtered = amenities.filter(a => a.category.toLowerCase() === filterVal.toLowerCase());
        renderAmenities(filtered);
      }
    });
  });
}

function attachAmenityModalListeners(amenities) {
  document.querySelectorAll('.btn-amenity-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const amenityId = btn.getAttribute('data-amenity-id');
      const amenity = amenities.find(a => a.id === amenityId);
      if (amenity) openAmenityModal(amenity);
    });
  });
}

export function openAmenityModal(amenity) {
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
        <img src="${basePath}${amenity.image}" alt="${amenity.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 1.5rem; left: 2rem; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${amenity.category}</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0;">${amenity.name}</h2>
        </div>
      </div>
      <div style="padding: 2.25rem;">
        <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.75rem;">
          ${amenity.longDescription}
        </p>

        <h4 style="font-size: 1.1rem; color: var(--color-primary-dark); margin-bottom: 0.75rem;">Amenities & Service Specs</h4>
        <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 2rem;">
          ${amenity.highlights.map(h => `<li style="font-size: 0.9rem; color: var(--color-text-main); display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent); font-weight: bold;">✓</span> ${h}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="${basePath}pages/contact.html?interest=Clubhouse%20Tour" class="btn btn-primary">
            <span>Schedule Amenity Tour</span>
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
