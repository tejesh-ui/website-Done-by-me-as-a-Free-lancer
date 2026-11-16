/**
 * Green Haven Residences - Photo Gallery & Lightbox Logic
 * Handles dynamic photo rendering, category filters, and interactive lightbox navigation.
 */

let galleryData = null;
let currentActiveIndex = 0;
let currentActiveList = [];

const FALLBACK_GALLERY = [
  {
    id: "gallery-1",
    title: "Architectural Facade & Central Boulevard",
    category: "Exterior",
    image: "assets/images/gallery/gallery-1.jpg",
    description: "Modern multi-tier residential towers rising above lush landscaped boulevards at sunset."
  },
  {
    id: "gallery-2",
    title: "Sunlit Open Living Salon",
    category: "Apartments",
    image: "assets/images/gallery/gallery-2.jpg",
    description: "Spacious family living area featuring floor-to-ceiling glass and scenic terrace views."
  },
  {
    id: "gallery-3",
    title: "Central Community Park & Meadow",
    category: "Parks",
    image: "assets/images/gallery/gallery-3.jpg",
    description: "4.5 acres of rolling green meadows, manicured topiary, and shaded relaxation benches."
  },
  {
    id: "gallery-4",
    title: "Infinity Swimming Pool & Aqua Deck",
    category: "Amenities",
    image: "assets/images/gallery/gallery-4.jpg",
    description: "Resort-style infinity lap pool with heated jacuzzi and teakwood sun lounger cabanas."
  },
  {
    id: "gallery-5",
    title: "The Grand Clubhouse Portico",
    category: "Clubhouse",
    image: "assets/images/gallery/gallery-5.jpg",
    description: "35,000 sq.ft. architectural centerpiece welcoming residents to recreation and luxury."
  },
  {
    id: "gallery-6",
    title: "Master Suite with Garden Panorama",
    category: "Apartments",
    image: "assets/images/gallery/gallery-6.jpg",
    description: "Tranquil master bedroom with private balcony, warm acoustic wood paneling, and walk-in closet."
  },
  {
    id: "gallery-7",
    title: "Conditioning Gymnasium & Cardio Studio",
    category: "Amenities",
    image: "assets/images/gallery/gallery-7.jpg",
    description: "High-tech biomechanical training equipment overlooking the botanical garden perimeter."
  },
  {
    id: "gallery-8",
    title: "Botanical Floral Sanctuary",
    category: "Parks",
    image: "assets/images/gallery/gallery-8.jpg",
    description: "Aroma trail with over 150 identified indigenous medicinal and flowering botanical specimens."
  },
  {
    id: "gallery-9",
    title: "Children's Adventure Playground",
    category: "Lifestyle",
    image: "assets/images/gallery/gallery-9.jpg",
    description: "Safe shock-absorbent eco-play grounds, timber climbing structures, and toddler slides."
  },
  {
    id: "gallery-10",
    title: "Tower B Terrace & Skylight Terraces",
    category: "Exterior",
    image: "assets/images/gallery/gallery-10.jpg",
    description: "Clean geometric lines, expansive double-glazed glazing, and deep shaded balconies."
  },
  {
    id: "gallery-11",
    title: "Contemporary Italian-Style Modular Kitchen",
    category: "Apartments",
    image: "assets/images/gallery/gallery-11.jpg",
    description: "Ergonomic quartz countertops, built-in cooktops, soft-close cabinetry, and utility balcony access."
  },
  {
    id: "gallery-12",
    title: "Tree-Canopied Morning Jogging Track",
    category: "Lifestyle",
    image: "assets/images/gallery/gallery-12.jpg",
    description: "Cushioned polyurethane running track winding under the dense emerald foliage of mature trees."
  }
];

export async function loadGalleryData() {
  if (galleryData) return galleryData;
  try {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    const res = await fetch(`${basePath}data/gallery.json`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    galleryData = await res.json();
  } catch (err) {
    console.warn('Loading fallback gallery data (local file or network offline):', err);
    galleryData = FALLBACK_GALLERY;
  }
  return galleryData;
}

export function renderGallery(items, containerId = 'galleryContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  currentActiveList = items;
  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  container.innerHTML = items.map((item, idx) => `
    <figure class="gallery-card" data-category="${item.category}" data-index="${idx}" tabindex="0" role="button" aria-label="View photo ${item.title}">
      <img src="${basePath}${item.image}" alt="${item.title}" class="gallery-img" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-cat-badge">${item.category}</span>
        <figcaption class="gallery-item-title">${item.title}</figcaption>
        <div class="gallery-zoom-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
    </figure>
  `).join('');

  attachGalleryListeners();
}

export function initGalleryFilters(items) {
  const filterBtns = document.querySelectorAll('.filter-btn[data-gallery-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-gallery-filter');
      if (filterVal === 'all') {
        renderGallery(items);
      } else {
        const filtered = items.filter(i => i.category.toLowerCase() === filterVal.toLowerCase());
        renderGallery(filtered);
      }
    });
  });
}

function attachGalleryListeners() {
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    const clickHandler = () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    };

    card.addEventListener('click', clickHandler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
  });
}

export function initLightbox() {
  let modal = document.getElementById('galleryLightboxModal');
  if (modal) return;

  modal = document.createElement('div');
  modal.id = 'galleryLightboxModal';
  modal.className = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Image lightbox view');

  modal.innerHTML = `
    <div class="lightbox-content-box">
      <button class="lightbox-close-btn" id="lightboxCloseBtn" aria-label="Close image lightbox">✕</button>
      
      <button class="lightbox-nav-btn lightbox-prev" id="lightboxPrevBtn" aria-label="Previous image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div class="lightbox-image-wrap">
        <img src="" alt="" class="lightbox-image" id="lightboxImage">
      </div>

      <button class="lightbox-nav-btn lightbox-next" id="lightboxNextBtn" aria-label="Next image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div class="lightbox-caption-bar">
        <div>
          <h3 class="lightbox-title" id="lightboxTitle"></h3>
          <p class="lightbox-desc" id="lightboxDesc"></p>
        </div>
        <span class="badge badge-gold" id="lightboxCategory"></span>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });
}

export function openLightbox(index) {
  initLightbox();
  currentActiveIndex = index;
  updateLightboxContent();

  const modal = document.getElementById('galleryLightboxModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function updateLightboxContent() {
  if (!currentActiveList.length) return;
  const item = currentActiveList[currentActiveIndex];
  if (!item) return;

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  const imgEl = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const catEl = document.getElementById('lightboxCategory');

  if (imgEl) {
    imgEl.src = `${basePath}${item.image}`;
    imgEl.alt = item.title;
  }
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.description;
  if (catEl) catEl.textContent = item.category;
}

function showPrevImage() {
  if (!currentActiveList.length) return;
  currentActiveIndex = (currentActiveIndex - 1 + currentActiveList.length) % currentActiveList.length;
  updateLightboxContent();
}

function showNextImage() {
  if (!currentActiveList.length) return;
  currentActiveIndex = (currentActiveIndex + 1) % currentActiveList.length;
  updateLightboxContent();
}

export function closeLightbox() {
  const modal = document.getElementById('galleryLightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
