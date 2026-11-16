/**
 * Green Haven Residences - Main Application Controller
 * Orchestrates component rendering, data fetching, global search, and page lifecycle.
 */

import { initNavigation } from './navigation.js';
import { loadApartmentsData, renderApartments, renderTowers, initApartmentFilters } from './apartments.js';
import { loadParksData, renderParks, initParkFilters } from './parks.js';
import { loadAmenitiesData, renderAmenities, initAmenityFilters } from './amenities.js';
import { loadGalleryData, renderGallery, initGalleryFilters } from './gallery.js';
import { initCommunitySearch } from './search.js';
import { initContactForm } from './contact.js';

// Fallback locations data
const FALLBACK_LOCATIONS = [
  { category: "Schools & Education", name: "Oakridge International Academy", distance: "5 min", miles: "1.8 km", description: "Pre-K through Grade 12 IB world school." },
  { category: "Schools & Education", name: "Greenwood Valley High", distance: "8 min", miles: "3.2 km", description: "Top-tier STEM curriculum and arts campus." },
  { category: "Healthcare & Hospitals", name: "Apollo Super-Speciality Hospital", distance: "8 min", miles: "2.9 km", description: "24/7 trauma emergency care & multispeciality wing." },
  { category: "Healthcare & Hospitals", name: "Columbia Asia Care Centre", distance: "12 min", miles: "4.5 km", description: "Renowned diagnostic laboratories & clinics." },
  { category: "Shopping & Entertainment", name: "The Grand Galleria Mall", distance: "10 min", miles: "3.8 km", description: "Multiplex cinema, luxury flagship stores & dining." },
  { category: "Shopping & Entertainment", name: "Nature's Basket Gourmet Market", distance: "4 min", miles: "1.2 km", description: "Artisanal bakery, organic produce & daily groceries." },
  { category: "Restaurants & Cafes", name: "Artisan Roasters & Lakeside Bistros", distance: "6 min", miles: "2.1 km", description: "Specialty coffees, Italian trattorias & bakeries." },
  { category: "Public Transport", name: "Central Metro Station (Blue Line)", distance: "6 min", miles: "2.4 km", description: "Rapid direct metro link to airport & financial core." },
  { category: "Public Transport", name: "Greenfield Expressway Junction", distance: "4 min", miles: "1.5 km", description: "Interstate corridor connection." },
  { category: "IT & Business Districts", name: "CyberTech Innovation Tech Park", distance: "15 min", miles: "6.2 km", description: "Corporate offices of Fortune 500 tech companies." },
  { category: "IT & Business Districts", name: "Financial City Hub", distance: "18 min", miles: "7.5 km", description: "Banking district, incubators & business hotels." }
];

async function initApp() {
  console.log('🌱 Initializing Green Haven Residences Portal...');

  // Initialize Header & Mobile Drawer
  initNavigation();

  // Initialize Contact form if present on the page
  initContactForm();

  // Pre-load data entities for current page needs and cross-search
  const [apartmentsData, parksData, amenitiesData, galleryData] = await Promise.all([
    loadApartmentsData(),
    loadParksData(),
    loadAmenitiesData(),
    loadGalleryData()
  ]);

  // Render Apartments / Towers if containers exist
  if (document.getElementById('towersContainer')) {
    renderTowers(apartmentsData.towers, 'towersContainer');
  }

  if (document.getElementById('apartmentsContainer')) {
    renderApartments(apartmentsData.units, 'apartmentsContainer');
    initApartmentFilters(apartmentsData.units);
  }

  // Render Parks if container exists
  if (document.getElementById('parksContainer')) {
    renderParks(parksData, 'parksContainer');
    initParkFilters(parksData);
  }

  // Render Amenities if container exists
  if (document.getElementById('amenitiesContainer')) {
    renderAmenities(amenitiesData, 'amenitiesContainer');
    initAmenityFilters(amenitiesData);
  }

  // Render Gallery if container exists
  if (document.getElementById('galleryContainer')) {
    renderGallery(galleryData, 'galleryContainer');
    initGalleryFilters(galleryData);
  }

  // Render Location Landmarks if container exists
  if (document.getElementById('landmarksContainer')) {
    renderLandmarks(FALLBACK_LOCATIONS, 'landmarksContainer');
  }

  // Initialize Community Universal Search if search bar exists
  initCommunitySearch({
    apartments: apartmentsData.units || [],
    towers: apartmentsData.towers || [],
    amenities: amenitiesData || [],
    parks: parksData || []
  });

  console.log('✓ Green Haven Residences portal ready.');
}

function renderLandmarks(landmarks, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = landmarks.map(lm => `
    <div class="landmark-card">
      <div class="landmark-info">
        <span class="landmark-cat">${lm.category}</span>
        <h4 class="landmark-name">${lm.name}</h4>
      </div>
      <div class="landmark-distance">
        <span>${lm.distance}</span>
        <span style="font-weight: normal; font-size: 0.75rem; color: var(--color-text-muted);">(${lm.miles})</span>
      </div>
    </div>
  `).join('');
}

// Bootstrap on DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
