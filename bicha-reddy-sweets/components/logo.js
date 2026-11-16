function renderLogo(className = '') {
    return `
        <a href="index.html" class="brand-logo ${className}" aria-label="Sweets demo home">
            <span class="brand-logo-copy">
                <span class="font-serif text-xl font-bold leading-tight">Sweets demo</span>
            </span>
        </a>
    `;
}

window.renderLogo = renderLogo;
