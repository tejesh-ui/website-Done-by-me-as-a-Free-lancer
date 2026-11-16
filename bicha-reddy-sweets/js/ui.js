function resolveProductImage(imagePath) {
    return imagePath.replace(/^\.\.\//, '');
}

function createProductCard(product, isFeatured = false) {
    return `
        <article class="product-card relative">
            ${isFeatured ? `
                <div class="absolute top-3 left-3 bg-accent-gold text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded z-10">
                    Popular
                </div>
            ` : ''}
            <div class="img-container">
                <img src="${resolveProductImage(product.image)}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info text-center">
                <h3 class="font-serif text-xl font-bold text-neutral-900 mb-2">${product.name}</h3>
            </div>
        </article>
    `;
}

function renderGrid(container, products, isFeatured = false) {
    if (!container) return;
    container.innerHTML = products
        .map((product) => createProductCard(product, isFeatured))
        .join('');
    container.dataset.totalCount = String(products.length);
    updateProductGridVisibility(container);
}

function updateProductGridVisibility(container) {
    const target = container || document.querySelector('[data-product-grid]');
    if (!target) return;

    const limit = Number.parseInt(target.dataset.limit || '5', 10);
    const products = Array.from(target.children);
    const button = document.querySelector(`[data-view-more-for="${target.id}"]`);
    const expanded = target.dataset.expanded === 'true';
    const canExpand = Number.isFinite(limit) && limit > 0 && products.length > limit;

    products.forEach((card, index) => {
        card.hidden = canExpand && !expanded && index >= limit;
    });

    if (button) {
        button.hidden = !canExpand;
        button.textContent = expanded ? 'Show Less' : 'View More';
        button.setAttribute('aria-expanded', String(expanded));
    }
}

function renderSweetsGrid(filterCategory = 'All') {
    const container = document.getElementById('sweets-container');
    if (!container) return;
    container.dataset.expanded = 'false';

    const filteredSweets = filterCategory === 'All'
        ? sweetsData
        : sweetsData.filter((sweet) => sweet.category === filterCategory);

    renderGrid(container, filteredSweets);
}

function renderProducts() {
    const featuredContainer = document.getElementById('featured-products-container');
    if (featuredContainer) {
        const featuredSweets = sweetsData
            .filter((sweet) => sweet.featured)
            .slice(0, 4);
        renderGrid(featuredContainer, featuredSweets, true);
    }

    const sweetsContainer = document.getElementById('sweets-container');
    if (sweetsContainer) renderSweetsGrid('All');

    const bakeryContainer = document.getElementById('bakery-container');
    if (bakeryContainer) renderGrid(bakeryContainer, bakeryData);

    const chaiContainer = document.getElementById('chai-spot-container');
    if (chaiContainer) renderGrid(chaiContainer, chaiSpotData);
}

window.createProductCard = createProductCard;
window.renderProducts = renderProducts;
window.renderSweetsGrid = renderSweetsGrid;
window.updateProductGridVisibility = updateProductGridVisibility;
