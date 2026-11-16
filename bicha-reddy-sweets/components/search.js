function renderSearch() {
    const host = document.getElementById('site-search');
    if (!host) return;

    host.innerHTML = `
        <div id="search-modal" class="fixed inset-0 z-[100] bg-white hidden opacity-0 transition-opacity" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <div class="max-w-[1000px] mx-auto px-4 py-8 h-full flex flex-col">
                <div class="flex justify-between items-center mb-8">
                    <h2 id="search-title" class="font-serif text-2xl font-bold text-neutral-900">Search Products</h2>
                    <button type="button" onclick="toggleSearch()" class="text-neutral-500 hover:text-primary p-2 bg-neutral-100 rounded-full" aria-label="Close search">
                        <i class="ph ph-x text-2xl" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="relative mb-8">
                    <i class="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-2xl" aria-hidden="true"></i>
                    <input type="search" id="search-input" placeholder="Search for Kaju, Laddu, Samosa..." class="w-full bg-neutral-100 border-2 border-neutral-200 rounded-lg py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-primary transition-colors">
                </div>
                <div class="flex-grow overflow-y-auto">
                    <p class="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4" id="search-status" aria-live="polite">Start typing to search...</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="search-results"></div>
                </div>
            </div>
        </div>
    `;
}

window.renderSearch = renderSearch;
