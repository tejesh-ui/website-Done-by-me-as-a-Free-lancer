let activeSweetCategory = 'All';

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.querySelector('[aria-controls="mobile-menu"]');
    if (!menu) return;

    menu.classList.toggle('hidden');
    if (button) button.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
}

function toggleSearch() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;

    const input = document.getElementById('search-input');
    const opening = modal.classList.contains('hidden');
    if (opening) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        document.body.style.overflow = 'hidden';
        if (input) {
            input.value = '';
            input.focus();
        }
        const results = document.getElementById('search-results');
        const status = document.getElementById('search-status');
        if (results) results.replaceChildren();
        if (status) status.textContent = 'Start typing to search...';
    } else {
        modal.classList.add('opacity-0');
        window.setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    window.setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function setActiveFilter(selectedButton) {
    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.classList.remove('active', 'bg-primary', 'text-white');
        button.classList.add('bg-neutral-100', 'text-neutral-800');
    });

    selectedButton.classList.remove('bg-neutral-100', 'text-neutral-800');
    selectedButton.classList.add('active', 'bg-primary', 'text-white');
}

function initializePage() {
    if (typeof window.renderHeader === 'function') window.renderHeader();
    if (typeof window.renderFooter === 'function') window.renderFooter();
    if (typeof window.renderSearch === 'function') window.renderSearch();
    if (typeof window.renderProducts === 'function') window.renderProducts();

    window.toggleMobileMenu = toggleMobileMenu;
    window.toggleSearch = toggleSearch;
    window.showToast = showToast;

    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.addEventListener('click', () => {
            setActiveFilter(button);
            activeSweetCategory = button.dataset.filter || 'All';
            const sweetsGrid = document.getElementById('sweets-container');
            if (sweetsGrid) {
                sweetsGrid.dataset.expanded = 'false';
                window.renderSweetsGrid(activeSweetCategory);
            }
        });
    });

    document.querySelectorAll('[data-view-more-for]').forEach((button) => {
        button.addEventListener('click', () => {
            const grid = document.getElementById(button.dataset.viewMoreFor);
            if (!grid) return;
            grid.dataset.expanded = grid.dataset.expanded !== 'true' ? 'true' : 'false';
            window.updateProductGridVisibility(grid);
            if (grid.dataset.expanded === 'false') {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            const resultsContainer = document.getElementById('search-results');
            const status = document.getElementById('search-status');
            if (!resultsContainer || !status) return;

            if (query.length < 2) {
                resultsContainer.replaceChildren();
                status.textContent = 'Start typing to search...';
                return;
            }

            const results = allProducts.filter((product) =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
            status.textContent = results.length
                ? `Found ${results.length} results`
                : `No results found for "${query}"`;
            resultsContainer.innerHTML = results
                .map((product) => window.createProductCard(product))
                .join('');
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const modal = document.getElementById('search-modal');
            if (modal && !modal.classList.contains('hidden')) toggleSearch();
        }
    });

    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (header) header.classList.toggle('shadow-md', window.scrollY > 10);
    });
}

initializePage();
