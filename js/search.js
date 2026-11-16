/**
 * Green Haven Residences - Community Universal Search & Filter Logic
 * Provides real-time instant search across Apartments, Amenities, Parks, and Towers.
 */

export function initCommunitySearch({ apartments = [], amenities = [], parks = [], towers = [] } = {}) {
  const searchInput = document.getElementById('communitySearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchFilterCategory = document.getElementById('searchCategorySelect');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (!searchInput) return;

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = searchFilterCategory ? searchFilterCategory.value : 'all';

    if (!searchResultsContainer) return;

    if (!query && selectedCategory === 'all') {
      searchResultsContainer.style.display = 'none';
      searchResultsContainer.innerHTML = '';
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      return;
    }

    if (searchClearBtn) searchClearBtn.style.display = 'block';

    const results = [];

    // Search Apartments
    if (selectedCategory === 'all' || selectedCategory === 'apartments') {
      apartments.forEach(item => {
        const matchTitle = (item.title || '').toLowerCase().includes(query);
        const matchType = (item.type || '').toLowerCase().includes(query);
        const matchDesc = (item.subtitle || '').toLowerCase().includes(query);
        if (matchTitle || matchType || matchDesc || !query) {
          results.push({
            type: 'Apartment',
            title: item.title,
            desc: `${item.type} • ${item.area} • ${item.parking}`,
            link: `pages/apartments.html#${item.id}`,
            badge: 'Residence'
          });
        }
      });
    }

    // Search Towers
    if (selectedCategory === 'all' || selectedCategory === 'buildings') {
      towers.forEach(item => {
        const matchName = (item.name || '').toLowerCase().includes(query);
        const matchDesc = (item.tagline || '').toLowerCase().includes(query);
        if (matchName || matchDesc || !query) {
          results.push({
            type: 'Building',
            title: item.name,
            desc: `${item.floors} Floors • ${item.units} Units • ${item.completion}`,
            link: `pages/apartments.html#towers`,
            badge: 'Tower'
          });
        }
      });
    }

    // Search Amenities
    if (selectedCategory === 'all' || selectedCategory === 'amenities') {
      amenities.forEach(item => {
        const matchName = (item.name || '').toLowerCase().includes(query);
        const matchDesc = (item.shortDescription || '').toLowerCase().includes(query);
        if (matchName || matchDesc || !query) {
          results.push({
            type: 'Amenity',
            title: item.name,
            desc: `${item.category} • ${item.shortDescription}`,
            link: `pages/amenities.html#${item.id}`,
            badge: 'Amenity'
          });
        }
      });
    }

    // Search Parks
    if (selectedCategory === 'all' || selectedCategory === 'parks') {
      parks.forEach(item => {
        const matchName = (item.name || '').toLowerCase().includes(query);
        const matchDesc = (item.description || '').toLowerCase().includes(query);
        if (matchName || matchDesc || !query) {
          results.push({
            type: 'Park',
            title: item.name,
            desc: `${item.area} • ${item.tagline || item.description}`,
            link: `pages/parks.html#${item.id}`,
            badge: 'Green Space'
          });
        }
      });
    }

    renderSearchResults(results, query);
  }

  function renderSearchResults(results, query) {
    if (!searchResultsContainer) return;
    searchResultsContainer.style.display = 'block';

    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
          <p>No community features found matching "<strong>${escapeHtml(query)}</strong>".</p>
          <span style="font-size: 0.85rem;">Try searching for "2 BHK", "Park", "Gym", "Pool", or "Tower B".</span>
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = `
      <div style="padding: 1rem 1.5rem; background: var(--color-bg-subtle); border-bottom: 1px solid var(--color-border); font-size: 0.85rem; font-weight: 600; color: var(--color-primary-dark);">
        Found ${results.length} Community Results
      </div>
      <div style="max-height: 380px; overflow-y: auto;">
        ${results.map(r => `
          <a href="${basePath}${r.link}" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-border); text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='var(--color-primary-soft)'" onmouseout="this.style.background='transparent'">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge badge-gold" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">${r.badge}</span>
                <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">${r.title}</strong>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0; line-height: 1.4;">${r.desc}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-accent); flex-shrink: 0; margin-left: 1rem;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        `).join('')}
      </div>
    `;
  }

  // Event Listeners
  searchInput.addEventListener('input', performSearch);
  if (searchFilterCategory) {
    searchFilterCategory.addEventListener('change', performSearch);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (searchFilterCategory) searchFilterCategory.value = 'all';
      performSearch();
      searchInput.focus();
    });
  }

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (searchResultsContainer && !searchResultsContainer.contains(e.target) && e.target !== searchInput) {
      searchResultsContainer.style.display = 'none';
    }
  });

  // Re-open if clicking on search input with value
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      performSearch();
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
