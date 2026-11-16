/* =========================================================================
   Navigation — renders shared chrome, sticky header state, menu search.
   Depends on: bootstrap.bundle, data.js, components.js
   ========================================================================= */
(function () {
    'use strict';

    UI.renderHeader();
    UI.renderFooter();
    UI.renderSearch();

    const header = document.querySelector('.site-header');
    const root = document.documentElement;

    /* Expose header height to CSS for anchor offsets & hero spacing. */
    function syncHeaderHeight() {
        if (header) root.style.setProperty('--header-h', `${header.offsetHeight}px`);
    }
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight, { passive: true });

    /* Compact header once the page is scrolled. */
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            header?.classList.toggle('is-scrolled', window.scrollY > 24);
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Menu search ------------------------------------------------------- */
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const status = document.getElementById('search-status');

    if (modal && input) {
        modal.addEventListener('shown.bs.modal', () => input.focus());
        modal.addEventListener('hidden.bs.modal', () => {
            input.value = '';
            results.replaceChildren();
            status.textContent = 'Type at least two letters to search.';
        });

        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                results.replaceChildren();
                status.textContent = 'Type at least two letters to search.';
                return;
            }
            const matches = allProducts.filter((p) =>
                p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
            status.textContent = matches.length
                ? `${matches.length} ${matches.length === 1 ? 'item' : 'items'} found`
                : `Nothing matches “${input.value.trim()}”. Try a dish like biryani or paneer, or browse the full menu.`;
            results.innerHTML = matches
                .map((p) => `<div class="col-6 col-md-4 col-lg-3">${UI.productCard(p, { badge: false })}</div>`)
                .join('');
        });
    }
})();
