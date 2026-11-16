function renderHeader() {
    const host = document.getElementById('site-header');
    if (!host) return;

    const links = [
        ['Home', 'index.html'],
        ['Sweets', 'sweets.html'],
        ['Bakery', 'bakery.html'],
        ['Chai Spot', 'chai-spot.html'],
        ['About Us', 'about.html'],
        ['Our Stores', 'stores.html'],
        ['Contact Us', '#site-footer']
    ];

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const linkMarkup = links.map(([label, href]) => {
        const active = currentPage === href;
        return `<a href="${href}" class="site-nav-link hover:text-primary transition-colors${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');

    host.innerHTML = `
        <header class="site-header bg-neutral-100 border-b border-neutral-300 shadow-sm transition-all duration-300" id="main-header">
            <div class="max-w-[1400px] mx-auto px-4 md:px-8">
                <div class="site-header-inner">
                    <button class="site-mobile-toggle p-2 -ml-2 text-primary" type="button" onclick="toggleMobileMenu()" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">
                        <i class="ph ph-list text-2xl" aria-hidden="true"></i>
                    </button>
                    ${renderLogo('text-primary')}
                    <nav class="site-desktop-nav font-medium text-sm text-neutral-800" aria-label="Main navigation">
                        ${linkMarkup}
                    </nav>
                    <div class="site-header-actions">
                        <button type="button" onclick="toggleSearch()" class="text-neutral-800 hover:text-primary transition-colors" aria-label="Search products">
                            <i class="ph ph-magnifying-glass text-xl md:text-2xl" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="text-neutral-800 hover:text-primary transition-colors hidden sm:block" aria-label="Account">
                            <i class="ph ph-user text-xl md:text-2xl" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="mobile-menu" class="site-mobile-menu hidden bg-neutral-100 border-b border-neutral-300 shadow-lg">
                <nav class="flex flex-col py-4 px-6 gap-4 text-base font-medium text-neutral-800" aria-label="Mobile navigation">
                    ${links.map(([label, href]) => {
                        const active = currentPage === href;
                        return `<a href="${href}" onclick="toggleMobileMenu()" class="hover:text-primary${active ? ' font-semibold' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
                    }).join('')}
                    <div class="h-px bg-neutral-300 my-2"></div>
                    <button type="button" onclick="toggleSearch(); toggleMobileMenu()" class="flex items-center gap-3 hover:text-primary text-left">
                        <i class="ph ph-magnifying-glass text-xl" aria-hidden="true"></i> Search Products
                    </button>
                </nav>
            </div>
        </header>
    `;
}

window.renderHeader = renderHeader;
