/* =========================================================================
   Page features. Each feature only runs when its markup exists on the page.
   Depends on: bootstrap.bundle, data.js, components.js, navigation.js
   ========================================================================= */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));

    /* ---- Hero: stacked cards ---------------------------------------------- */
    function initHeroStack(stack) {
        const cards = $$('.hero-card', stack);
        const count = cards.length;
        if (!count) return;
        const counter = $('[data-hero-counter]', stack);
        const live = $('[data-hero-live]', stack);
        let active = 0;
        let timer = null;

        function render(announce) {
            cards.forEach((card, i) => {
                const pos = (i - active + count) % count;
                card.dataset.pos = pos === count - 1 && count > 3 ? 'out' : String(pos);
                const front = pos === 0;
                card.setAttribute('aria-hidden', String(!front));
                card.querySelectorAll('a').forEach((a) => { a.tabIndex = front ? 0 : -1; });
            });
            if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
            if (announce && live) live.textContent = `Showing ${cards[active].dataset.name}, ${active + 1} of ${count}`;
        }

        const go = (step) => { active = (active + step + count) % count; render(true); };

        $('[data-hero-prev]', stack)?.addEventListener('click', () => { go(-1); restart(); });
        $('[data-hero-next]', stack)?.addEventListener('click', () => { go(1); restart(); });

        /* Clicking a card peeking from behind brings it forward. */
        cards.forEach((card, i) => card.addEventListener('click', (e) => {
            if (card.dataset.pos === '0') return;
            e.preventDefault();
            active = i; render(true); restart();
        }));

        stack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { go(-1); restart(); }
            if (e.key === 'ArrowRight') { go(1); restart(); }
        });

        /* Swipe on touch devices. */
        let startX = null;
        const deck = $('.hero-stack__deck', stack);
        deck.addEventListener('pointerdown', (e) => { startX = e.clientX; });
        deck.addEventListener('pointerup', (e) => {
            if (startX === null) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
            startX = null;
        });

        function start() { if (!reduceMotion) timer = window.setInterval(() => go(1), 6000); }
        function stop() { window.clearInterval(timer); timer = null; }
        function restart() { stop(); start(); }
        stack.addEventListener('mouseenter', stop);
        stack.addEventListener('mouseleave', start);
        stack.addEventListener('focusin', stop);
        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : restart()));

        render(false);
        requestAnimationFrame(() => stack.classList.add('is-ready'));
        start();
    }

    /* ---- Product grids ----------------------------------------------------- */
    function productsFor(grid) {
        const source = grid.dataset.source;
        if (source === 'featured') return allProducts.filter((p) => p.featured);
        if (grid.dataset.ids) return grid.dataset.ids.split(',').map((id) => byId[id.trim()]).filter(Boolean);
        return SECTIONS[source]?.items || [];
    }

    function renderGrid(grid, products) {
        const col = grid.dataset.col || 'col-6 col-md-4 col-lg-3';
        const opts = { description: grid.hasAttribute('data-descriptions') };
        grid.innerHTML = products.map((p) => `<div class="${col}">${UI.productCard(p, opts)}</div>`).join('');
        updateVisibility(grid);
    }

    function updateVisibility(grid) {
        const limit = parseInt(grid.dataset.limit || '0', 10);
        const items = Array.from(grid.children);
        const expanded = grid.dataset.expanded === 'true';
        const canExpand = limit > 0 && items.length > limit;
        items.forEach((item, i) => { item.hidden = canExpand && !expanded && i >= limit; });
        const button = $(`[data-view-more-for="${grid.id}"]`);
        if (button) {
            button.hidden = !canExpand;
            button.textContent = expanded ? 'Show fewer' : `View all ${items.length}`;
            button.setAttribute('aria-expanded', String(expanded));
        }
    }

    function initGrids() {
        $$('[data-product-grid]').forEach((grid) => renderGrid(grid, productsFor(grid)));

        $$('[data-view-more-for]').forEach((button) => button.addEventListener('click', () => {
            const grid = document.getElementById(button.dataset.viewMoreFor);
            if (!grid) return;
            grid.dataset.expanded = grid.dataset.expanded === 'true' ? 'false' : 'true';
            updateVisibility(grid);
            if (grid.dataset.expanded === 'false') grid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }));

        /* Category filter chips (Men and Women pages). */
        $$('[data-filter-for]').forEach((group) => {
            const grid = document.getElementById(group.dataset.filterFor);
            const all = productsFor(grid);
            const chips = $$('button[data-filter]', group);
            const apply = (value) => {
                chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === value)));
                grid.dataset.expanded = 'false';
                renderGrid(grid, value === 'All' ? all : all.filter((p) => p.category === value));
            };
            chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.filter)));
            /* Deep links such as men.html?filter=Shirts */
            const requested = new URLSearchParams(location.search).get('filter');
            if (requested && chips.some((c) => c.dataset.filter === requested)) apply(requested);
        });
    }

    /* ---- Stores & testimonials -------------------------------------------- */
    function initLists() {
        $$('[data-stores]').forEach((host) => {
            const col = host.dataset.col || 'col-sm-6 col-lg-4';
            host.innerHTML = STORES.map((s) => `<div class="${col}">${UI.storeCard(s)}</div>`).join('');
        });
        $$('[data-testimonials]').forEach((host) => {
            if (!TESTIMONIALS.length) { host.closest('section')?.remove(); return; }
            host.innerHTML = TESTIMONIALS.map((t) => `<div class="col-md-4">${UI.testimonialCard(t)}</div>`).join('');
        });
    }

    /* ---- Enquiry form ------------------------------------------------------ */
    function initEnquiry() {
        const params = new URLSearchParams(location.search);
        $$('[data-enquiry]').forEach((host) => {
            const requested = params.get('type');
            const type = UI.ENQUIRY_TYPES[requested] ? requested : (host.dataset.enquiry || 'order');
            host.innerHTML = UI.enquiryForm(type);
            const form = $('form', host);
            const product = params.get('product');
            if (product) form.message.value = `I'm interested in: ${product}\n`;

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const status = $('[data-form-status]', form);
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    form.querySelector(':invalid')?.focus();
                    return;
                }
                const d = Object.fromEntries(new FormData(form));
                const lines = [
                    `Hello ${SITE.shortName}, I'd like to make an enquiry.`,
                    '',
                    `Name: ${d.name}`,
                    `Phone: ${d.phone}`,
                    `Enquiry: ${UI.ENQUIRY_TYPES[d.type]}`,
                    d.date ? `Needed by: ${d.date}` : null,
                    d.quantity ? `Size & quantity: ${d.quantity}` : null,
                    `Preferred store: ${d.store}`,
                    '',
                    d.message.trim()
                ].filter((line) => line !== null);
                const text = lines.join('\n');
                const viaEmail = event.submitter?.dataset.send === 'email';
                const target = viaEmail
                    ? `mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${UI.ENQUIRY_TYPES[d.type]}`)}&body=${encodeURIComponent(text)}`
                    : `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

                if (viaEmail) window.location.href = target;
                else window.open(target, '_blank', 'noopener');

                status.innerHTML = `<div class="form-success">${UI.icon('check')}<div><strong>Your message is ready.</strong> ${viaEmail
                    ? 'Your email app has opened with the details filled in — press send to reach us.'
                    : 'WhatsApp opened in a new tab with your details — press send there to reach us.'} You can also call <a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a>.</div></div>`;
                form.classList.remove('was-validated');
            });
        });
    }

    /* ---- Product details page --------------------------------------------- */
    function initProductDetail() {
        const host = $('[data-product-detail]');
        if (!host) return;
        const product = byId[new URLSearchParams(location.search).get('id')];

        if (!product) {
            host.innerHTML = `
                <div class="empty-state">
                    <h1>We couldn't find that item</h1>
                    <p>The link may be out of date. Browse the shop to find what you're looking for.</p>
                    <a class="btn btn-brand" href="${UI.url('pages/categories.html')}">Browse the shop</a>
                </div>`;
            $('[data-related]')?.closest('section')?.remove();
            return;
        }

        const sectionKey = UI.sectionOf(product);
        const section = SECTIONS[sectionKey];
        document.title = `${product.name} | ${SITE.name}`;
        $('meta[name="description"]')?.setAttribute('content', `${product.name} — ${product.description}`);
        const crumb = $('[data-crumb-section]');
        if (crumb) { crumb.textContent = section.label; crumb.href = UI.url(section.page); }
        const crumbItem = $('[data-crumb-item]');
        if (crumbItem) crumbItem.textContent = product.name;

        const sizes = product.sizes || [];
        const price = product.price ? UI.formatPrice(product.price) : '';
        host.innerHTML = `
            <div class="row g-4 g-lg-5 align-items-center">
                <div class="col-lg-6">
                    <div class="detail-media">${UI.productImage(product)}</div>
                </div>
                <div class="col-lg-6">
                    <p class="kicker">${UI.escapeHTML(section.label)}${product.category !== section.label ? ` · ${UI.escapeHTML(product.category)}` : ''}</p>
                    <h1 class="detail-title">${UI.escapeHTML(product.name)}</h1>
                    ${price ? `<p class="detail-price">${price}</p>` : ''}
                    <p class="detail-lead">${UI.escapeHTML(product.description)}</p>
                    ${sizes.length ? `
                    <div class="size-picker" role="group" aria-label="Choose a size">
                        <p class="size-picker__label">Size${product.colors ? ` · <span class="text-soft">${UI.escapeHTML(product.colors)}</span>` : ''}</p>
                        <div class="size-picker__options">${sizes.map((s) => `<button type="button" class="size-chip" data-size="${UI.escapeHTML(s)}" aria-pressed="false">${UI.escapeHTML(s)}</button>`).join('')}</div>
                    </div>` : ''}
                    <ul class="detail-points">
                        <li>${UI.icon('ruler')}Not sure of your size? Message us and we'll help you choose</li>
                        <li>${UI.icon('refresh')}Easy exchanges — see our returns policy</li>
                        <li>${UI.icon('pin')}Stock can vary by store — call or WhatsApp to confirm</li>
                    </ul>
                    <div class="btn-row">
                        <a class="btn btn-brand" data-order-link href="#" target="_blank" rel="noopener">${UI.icon('whatsapp')} Order on WhatsApp</a>
                        <a class="btn btn-outline-brand" href="tel:${SITE.phoneHref}">${UI.icon('phone')} Call to order</a>
                    </div>
                    <a class="link-arrow" href="${UI.url('pages/contact.html')}?type=gifting&product=${encodeURIComponent(product.name)}#enquiry">Add it to a gift or bulk enquiry</a>
                </div>
            </div>`;

        /* Selected size is added to the WhatsApp message. */
        let chosenSize = '';
        const orderLink = $('[data-order-link]', host);
        const updateOrder = () => {
            const text = `Hello ${SITE.shortName}, I'd like to order ${product.name}${chosenSize ? ` in size ${chosenSize}` : ''}. Could you confirm availability${price ? '' : ' and price'}?`;
            orderLink.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
        };
        $$('.size-chip', host).forEach((chip) => chip.addEventListener('click', () => {
            chosenSize = chip.dataset.size;
            $$('.size-chip', host).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
            updateOrder();
        }));
        updateOrder();

        const related = $('[data-related]');
        if (related) {
            const pool = section.items.filter((p) => p.id !== product.id);
            const picks = [...pool.filter((p) => p.category === product.category), ...pool.filter((p) => p.category !== product.category)].slice(0, 4);
            renderGrid(related, picks);
        }
    }

    /* ---- Gallery lightbox -------------------------------------------------- */
    function initGallery() {
        const items = $$('[data-gallery-item]');
        if (!items.length) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal fade lightbox" id="lightbox" tabindex="-1" aria-label="Photo viewer" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <button type="button" class="icon-btn lightbox__close" data-bs-dismiss="modal" aria-label="Close photo">${UI.icon('close')}</button>
                        <figure class="lightbox__figure"><figcaption></figcaption></figure>
                        <button type="button" class="icon-btn lightbox__nav lightbox__nav--prev" aria-label="Previous photo">${UI.icon('left')}</button>
                        <button type="button" class="icon-btn lightbox__nav lightbox__nav--next" aria-label="Next photo">${UI.icon('right')}</button>
                    </div>
                </div>
            </div>`);
        const box = document.getElementById('lightbox');
        const modal = bootstrap.Modal.getOrCreateInstance(box);
        const img = document.createElement('img');
        $('.lightbox__figure', box).prepend(img);
        const cap = $('figcaption', box);
        let index = 0;
        const show = (i) => { /* image element is filled on first open */
            index = (i + items.length) % items.length;
            const item = items[index];
            img.src = item.getAttribute('href');
            img.alt = $('img', item)?.alt || '';
            cap.textContent = item.dataset.caption || img.alt;
        };
        items.forEach((item, i) => item.addEventListener('click', (e) => { e.preventDefault(); show(i); modal.show(); }));
        $('.lightbox__nav--prev', box).addEventListener('click', () => show(index - 1));
        $('.lightbox__nav--next', box).addEventListener('click', () => show(index + 1));
        box.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') show(index - 1);
            if (e.key === 'ArrowRight') show(index + 1);
        });
    }

    /* ---- Year stamp, broken image fallback --------------------------------- */
    function initMisc() {
        $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
        document.addEventListener('error', (e) => {
            const el = e.target;
            if (el.tagName === 'IMG' && !el.dataset.fallback) {
                el.dataset.fallback = '1';
                el.src = UI.url('assets/images/logo/vestra-logo.png');
                el.classList.add('img-fallback');
            }
        }, true);
    }

    initMisc();
    $$('[data-hero-stack]').forEach(initHeroStack);
    initGrids();
    initLists();
    initEnquiry();
    initProductDetail();
    initGallery();
})();
