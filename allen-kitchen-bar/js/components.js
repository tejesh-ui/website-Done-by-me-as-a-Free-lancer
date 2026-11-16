/* =========================================================================
   Shared components — header, footer, search, cards, enquiry form, icons.
   Depends on: data.js
   ========================================================================= */
(function () {
    'use strict';

    /* Every page sets <body data-root="">  (root)  or  data-root="../"  (pages/). */
    const ROOT = document.body.dataset.root || '';
    const url = (path) => (path ? ROOT + path : '');

    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    /* ---- Icons (inline SVG, 24px grid, stroke-based) ----------------------- */
    const ICON_PATHS = {
        menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
        close: '<path d="M6 6l12 12M18 6 6 18"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        whatsapp: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M9 8.8c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .3-.1.9-.6 1.2-.4.3-1 .5-1.7.4-1-.1-2.3-.7-3.5-1.8-1.2-1.1-2-2.5-2.2-3.6-.1-.7.1-1.4.4-1.8Z"/>',
        pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        left: '<path d="m15 18-6-6 6-6"/>',
        right: '<path d="m9 18 6-6-6-6"/>',
        down: '<path d="m6 9 6 6 6-6"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.5 9 8 12 8zm0 0s1.5-4.5 4-3.5S15 8 12 8z"/>',
        drop: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
        leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 9-7"/>',
        sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
        shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
        box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
        heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
        briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
        rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="m10 5 2-2 2 2-2 2z"/>',
        lamp: '<path d="M4 15c0 2.8 3.6 5 8 5s8-2.2 8-5H4z"/><path d="M12 4c-1.5 2-2 3.4-2 4.5a2 2 0 0 0 4 0C14 7.4 13.5 6 12 4z"/>',
        users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
        check: '<path d="m5 12 5 5 9-10"/>',
        quote: '<path d="M7 17c-2 0-3-1.5-3-3.5C4 10 6.5 7 9.5 6M17 17c-2 0-3-1.5-3-3.5 0-3.5 2.5-6.5 5.5-7.5"/>',
        instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
        facebook: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>',
        youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
        expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
        store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M10 20v-5h4v5"/>',
        utensils: '<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18"/><path d="M17 21V3s-3 2-3 7c0 2 1.5 3 3 3"/>',
        glass: '<path d="M4 4h16l-8 9z"/><path d="M12 13v8M8 21h8"/>',
        flame: '<path d="M12 3c1 3.5 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
        cake: '<path d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M12 12V8M12 8c-1 0-1.5-.8-1.5-1.5S12 4 12 4s1.5 1.8 1.5 2.5S13 8 12 8z"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
        music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'
    };

    function icon(name, className = '') {
        return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`;
    }

    /* ---- Navigation map ---------------------------------------------------- */
    const NAV = [
        { label: 'Home', href: 'index.html', key: 'home' },
        { label: 'About', href: 'pages/about.html', key: 'about' },
        {
            label: 'Our Menu', key: 'menu', children: [
                { label: 'All categories', href: 'pages/categories.html', key: 'categories' },
                { label: 'Kitchen', href: 'pages/kitchen.html', key: 'kitchen' },
                { label: 'Bar', href: 'pages/bar.html', key: 'bar' },
                { label: 'Desserts', href: 'pages/desserts.html', key: 'desserts' }
            ]
        },
        { label: 'Party Platters', href: 'pages/party-platters.html', key: 'party-platters' },
        {
            label: 'Events', key: 'events', children: [
                { label: 'Special nights', href: 'pages/special-nights.html', key: 'special-nights' },
                { label: 'Private dining', href: 'pages/private-dining.html', key: 'private-dining' },
                { label: 'Corporate events', href: 'pages/corporate-events.html', key: 'corporate-events' }
            ]
        },
        { label: 'Gallery', href: 'pages/gallery.html', key: 'gallery' },
        { label: 'Outlets', href: 'pages/stores.html', key: 'stores' },
        { label: 'Contact', href: 'pages/contact.html', key: 'contact' }
    ];

    const PAGE = document.body.dataset.page || '';
    const isActive = (item) => item.key === PAGE || (item.children || []).some((c) => c.key === PAGE);
    const current = (item) => (item.key === PAGE ? ' aria-current="page"' : '');

    /* ---- Logo ---------------------------------------------------------------
       The logo uses its own classes (allen-logo, allen-logo__img …) so it can
       be restyled or swapped without touching anything else.
       To use your own logo: replace assets/images/logo/allen-logo.png (same
       file name) and, if needed, adjust the "ALLEN LOGO" block in
       css/components.css.                                                    */
    function renderLogo(variant = '') {
        return `
            <a href="${url('index.html')}" class="allen-logo ${variant}" aria-label="${escapeHTML(SITE.name)} ${escapeHTML(SITE.tagline)} — home">
                <img class="allen-logo__img" src="${url('assets/images/logo/allen-logo.png')}" alt="" width="160" height="160">
                <span class="allen-logo__text">
                    <span class="allen-logo__name">${escapeHTML(SITE.name)}</span>
                    <span class="allen-logo__tag">${escapeHTML(SITE.tagline)}</span>
                </span>
            </a>`;
    }

    function desktopNavItem(item) {
        if (!item.children) {
            return `<li class="nav-item"><a class="nav-link${isActive(item) ? ' active' : ''}" href="${url(item.href)}"${current(item)}>${item.label}</a></li>`;
        }
        return `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle${isActive(item) ? ' active' : ''}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">${item.label}</a>
                <ul class="dropdown-menu">
                    ${item.children.map((c) => `<li><a class="dropdown-item${c.key === PAGE ? ' active' : ''}" href="${url(c.href)}"${current(c)}>${c.label}</a></li>`).join('')}
                </ul>
            </li>`;
    }

    function mobileNavItem(item) {
        if (!item.children) {
            return `<li><a class="mobile-nav__link${isActive(item) ? ' active' : ''}" href="${url(item.href)}"${current(item)}>${item.label}</a></li>`;
        }
        return `
            <li class="mobile-nav__group">
                <span class="mobile-nav__heading">${item.label}</span>
                <ul>${item.children.map((c) => `<li><a class="mobile-nav__link mobile-nav__link--sub${c.key === PAGE ? ' active' : ''}" href="${url(c.href)}"${current(c)}>${c.label}</a></li>`).join('')}</ul>
            </li>`;
    }

    function renderHeader() {
        const host = document.getElementById('site-header');
        if (!host) return;

        host.outerHTML = `
            <a class="skip-link" href="#main">Skip to content</a>
            <header class="site-header" id="site-header">
                <div class="announce">
                    <div class="container announce__inner">
                        <p>Birthdays, parties and corporate events — <a href="${url('pages/private-dining.html')}">enquire for bookings</a></p>
                        <a class="announce__phone" href="tel:${SITE.phoneHref}">${icon('phone')}<span>${SITE.phoneDisplay}</span></a>
                    </div>
                </div>
                <nav class="navbar navbar-expand-xl site-nav" aria-label="Main navigation">
                    <div class="container">
                        ${renderLogo()}
                        <ul class="navbar-nav d-none d-xl-flex mx-auto">${NAV.map(desktopNavItem).join('')}</ul>
                        <div class="site-nav__actions">
                            <button type="button" class="icon-btn" data-bs-toggle="modal" data-bs-target="#search-modal" aria-label="Search the menu">${icon('search')}</button>
                            <a href="${url('pages/contact.html')}#enquiry" class="btn btn-brand btn-sm d-none d-sm-inline-flex">Book a table</a>
                            <button type="button" class="icon-btn d-xl-none" data-bs-toggle="offcanvas" data-bs-target="#mobile-nav" aria-controls="mobile-nav" aria-label="Open menu">${icon('menu')}</button>
                        </div>
                    </div>
                </nav>
            </header>

            <div class="offcanvas offcanvas-end mobile-nav" tabindex="-1" id="mobile-nav" aria-labelledby="mobile-nav-title">
                <div class="offcanvas-header">
                    <h2 class="visually-hidden" id="mobile-nav-title">Menu</h2>
                    ${renderLogo('allen-logo--sm')}
                    <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Close menu">${icon('close')}</button>
                </div>
                <div class="offcanvas-body">
                    <ul class="mobile-nav__list">${NAV.map(mobileNavItem).join('')}</ul>
                    <div class="mobile-nav__cta">
                        <a href="${url('pages/contact.html')}#enquiry" class="btn btn-brand w-100">Book a table</a>
                        <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="btn btn-outline-brand w-100">${icon('whatsapp')} WhatsApp us</a>
                        <a href="tel:${SITE.phoneHref}" class="mobile-nav__phone">${icon('phone')} ${SITE.phoneDisplay}</a>
                    </div>
                </div>
            </div>`;
    }

    function footerLinks(items) {
        return items.map(([label, href]) => `<li><a href="${url(href)}">${label}</a></li>`).join('');
    }

    function renderFooter() {
        const host = document.getElementById('site-footer');
        if (!host) return;
        const year = new Date().getFullYear();
        const socials = Object.entries(SITE.social).filter(([, link]) => link);

        host.outerHTML = `
            <footer class="site-footer" id="site-footer">
                <div class="container">
                    <div class="row gx-4 gy-5 gx-lg-5">
                        <div class="col-lg-4">
                            ${renderLogo('allen-logo--light')}
                            <p class="site-footer__about">A multi-cuisine kitchen and bar serving North Indian, South Indian, Chinese and Continental plates with handcrafted drinks — for easy evenings and big celebrations.</p>
                            <div class="social-row" aria-label="Contact and social links">
                                <a href="tel:${SITE.phoneHref}" aria-label="Call us">${icon('phone')}</a>
                                <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp us">${icon('whatsapp')}</a>
                                <a href="mailto:${SITE.email}" aria-label="Email us">${icon('mail')}</a>
                                ${socials.map(([name, link]) => `<a href="${escapeHTML(link)}" target="_blank" rel="noopener" aria-label="${name}">${icon(name)}</a>`).join('')}
                            </div>
                        </div>
                        <div class="col-6 col-md-4 col-lg-2">
                            <h2 class="site-footer__title">Explore</h2>
                            <ul class="site-footer__links">${footerLinks([['Home', 'index.html'], ['About us', 'pages/about.html'], ['Gallery', 'pages/gallery.html'], ['Our outlets', 'pages/stores.html'], ['FAQs', 'pages/faq.html'], ['Contact', 'pages/contact.html']])}</ul>
                        </div>
                        <div class="col-6 col-md-4 col-lg-2">
                            <h2 class="site-footer__title">Our menu</h2>
                            <ul class="site-footer__links">${footerLinks([['Kitchen', 'pages/kitchen.html'], ['Bar', 'pages/bar.html'], ['Desserts', 'pages/desserts.html'], ['Party platters', 'pages/party-platters.html'], ['Special nights', 'pages/special-nights.html'], ['Private dining', 'pages/private-dining.html'], ['Corporate events', 'pages/corporate-events.html']])}</ul>
                        </div>
                        <div class="col-md-4 col-lg-4">
                            <h2 class="site-footer__title">Visit &amp; contact</h2>
                            <ul class="site-footer__contact">
                                <li>${icon('pin')}<span>${SITE.office.join('<br>')}</span></li>
                                <li>${icon('clock')}<span>${SITE.hours ? escapeHTML(SITE.hours) : 'Opening hours vary by outlet — call ahead to confirm.'}</span></li>
                                <li>${icon('phone')}<a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></li>
                                <li>${icon('mail')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
                            </ul>
                            <p class="site-footer__stores">Outlets at ${STORES.map((s) => s.name).join(', ')}. <a href="${url('pages/stores.html')}">Get directions</a></p>
                        </div>
                    </div>
                    <div class="site-footer__bottom">
                        <p>&copy; ${year} ${SITE.name} ${SITE.tagline}. All rights reserved.</p>
                        <ul>${footerLinks([['Privacy policy', 'pages/privacy-policy.html'], ['Terms &amp; conditions', 'pages/terms-conditions.html'], ['Refund &amp; cancellation', 'pages/refund-policy.html']])}</ul>
                    </div>
                    <p class="site-footer__notice">Alcohol is served only to guests of legal drinking age. Please drink responsibly.</p>
                </div>
            </footer>
            <a class="float-wa" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}</a>`;
    }

    function renderSearch() {
        if (document.getElementById('search-modal')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal fade search-modal" id="search-modal" tabindex="-1" aria-labelledby="search-title" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title" id="search-title">Search our menu</h2>
                            <button type="button" class="icon-btn" data-bs-dismiss="modal" aria-label="Close search">${icon('close')}</button>
                        </div>
                        <div class="modal-body">
                            <label for="search-input" class="visually-hidden">Search kitchen, bar and desserts</label>
                            <div class="search-field">
                                ${icon('search')}
                                <input type="search" id="search-input" class="form-control" placeholder="Try biryani, paneer, mojito…" autocomplete="off">
                            </div>
                            <p class="search-status" id="search-status" aria-live="polite">Type at least two letters to search.</p>
                            <div class="row g-3 g-md-4" id="search-results"></div>
                        </div>
                    </div>
                </div>
            </div>`);
    }

    /* ---- Cards ------------------------------------------------------------- */
    function sectionOf(product) {
        if (product.id.startsWith('b')) return 'bar';
        if (product.id.startsWith('d')) return 'desserts';
        return 'kitchen';
    }

    function productImage(product, sizes = '') {
        if (!product.image) {
            return `<div class="img-placeholder" role="img" aria-label="${escapeHTML(product.name)} — photo coming soon">
                        <img src="${url('assets/images/logo/allen-logo.png')}" alt="" width="60" height="60"><span>Photo coming soon</span>
                    </div>`;
        }
        return `<img src="${url(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async"${sizes}>`;
    }

    function productCard(product, options = {}) {
        const href = url(`pages/product-details.html?id=${encodeURIComponent(product.id)}`);
        const label = SECTIONS[sectionOf(product)].label;
        const badge = product.featured && options.badge !== false ? '<span class="product-card__badge">Chef\u2019s pick</span>' : '';
        return `
            <article class="product-card">
                <a class="product-card__media" href="${href}" tabindex="-1" aria-hidden="true">${productImage(product)}${badge}</a>
                <div class="product-card__body">
                    <p class="product-card__cat">${escapeHTML(product.category === label ? label : `${label} · ${product.category}`)}</p>
                    <h3 class="product-card__title"><a href="${href}">${escapeHTML(product.name)}</a></h3>
                    ${options.description ? `<p class="product-card__desc">${escapeHTML(product.description)}</p>` : ''}
                </div>
            </article>`;
    }

    function storeCard(store) {
        return `
            <article class="store-card">
                <img src="${url(store.image)}" alt="${escapeHTML(store.name)} outlet" loading="lazy" decoding="async">
                <div class="store-card__body">
                    <h3>${escapeHTML(store.name)}</h3>
                    <p>${icon('pin')}${escapeHTML(store.area)}</p>
                    <a href="${store.map}" target="_blank" rel="noopener" class="btn btn-outline-brand btn-sm">Get directions<span class="visually-hidden"> to ${escapeHTML(store.name)} (opens Google Maps)</span></a>
                </div>
            </article>`;
    }

    function testimonialCard(t) {
        return `
            <figure class="testimonial">
                ${icon('quote', 'testimonial__mark')}
                <blockquote><p>${escapeHTML(t.quote)}</p></blockquote>
                <figcaption>${t.name ? `<strong>${escapeHTML(t.name)}</strong>` : ''}<span>${escapeHTML(t.context)}</span></figcaption>
            </figure>`;
    }

    /* ---- Enquiry form -------------------------------------------------------
       Static site: there is no server, so the form validates, then opens a
       pre-filled WhatsApp message (or email) the visitor can send. */
    const ENQUIRY_TYPES = {
        reservation: 'Table reservation',
        order: 'Takeaway / food order',
        platters: 'Party platters & takeaway boxes',
        celebration: 'Private dining / celebration',
        corporate: 'Corporate event / catering',
        festival: 'Festival / special night',
        other: 'Something else'
    };

    function enquiryForm(defaultType = 'reservation') {
        const options = Object.entries(ENQUIRY_TYPES)
            .map(([value, text]) => `<option value="${value}"${value === defaultType ? ' selected' : ''}>${text}</option>`).join('');
        const stores = ['Any outlet', ...STORES.map((s) => s.name)].map((s) => `<option>${escapeHTML(s)}</option>`).join('');
        return `
            <form class="enquiry-form needs-validation" novalidate data-enquiry-form>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label" for="enq-name">Your name</label>
                        <input class="form-control" id="enq-name" name="name" autocomplete="name" required>
                        <div class="invalid-feedback">Enter your name so we know who to reply to.</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="enq-phone">Phone number</label>
                        <input class="form-control" id="enq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" pattern="[0-9+\\s\\-]{10,15}" required>
                        <div class="invalid-feedback">Enter a 10-digit phone number.</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="enq-type">What are you planning?</label>
                        <select class="form-select" id="enq-type" name="type">${options}</select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="enq-date">Preferred date <span class="form-optional">optional</span></label>
                        <input class="form-control" id="enq-date" name="date" type="date">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="enq-qty">Number of guests <span class="form-optional">optional</span></label>
                        <input class="form-control" id="enq-qty" name="quantity" placeholder="e.g. 4 guests, or 60 for an event">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="enq-store">Preferred outlet</label>
                        <select class="form-select" id="enq-store" name="store">${stores}</select>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="enq-msg">Tell us more</label>
                        <textarea class="form-control" id="enq-msg" name="message" rows="4" placeholder="Dishes or drinks you'd like, preferred time, seating, budget per head, dine-in or takeaway…" required minlength="5"></textarea>
                        <div class="invalid-feedback">Add a short note about what you need.</div>
                    </div>
                    <div class="col-12 enquiry-form__actions">
                        <button type="submit" class="btn btn-brand">${icon('whatsapp')} Send enquiry on WhatsApp</button>
                        <button type="submit" class="btn btn-link-brand" data-send="email">Send by email instead</button>
                    </div>
                    <p class="col-12 form-note">Your details are only used to reply to this enquiry. Table availability, pricing and menu details are confirmed by our team.</p>
                    <div class="col-12" data-form-status aria-live="polite"></div>
                </div>
            </form>`;
    }

    window.UI = { ROOT, url, icon, escapeHTML, renderLogo, renderHeader, renderFooter, renderSearch, productCard, productImage, storeCard, testimonialCard, enquiryForm, ENQUIRY_TYPES, sectionOf };
})();
