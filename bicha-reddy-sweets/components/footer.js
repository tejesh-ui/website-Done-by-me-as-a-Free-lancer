function renderFooter() {
    const host = document.getElementById('site-footer');
    if (!host) return;

    const contactNumber = '+9134567890';
    const whatsappNumber = '9134567890';
    const emailAddress = 'info@bichareddysweets.com';

    host.innerHTML = `
        <footer class="bg-primary-light text-neutral-800 pt-16 pb-8">
            <div class="max-w-[1400px] mx-auto px-4 md:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div>
                        <div class="mb-6">${renderLogo('text-primary')}</div>
                        <p class="text-sm text-neutral-600 mb-6 leading-relaxed">
                            Crafting traditional Indian sweets and savory snacks with uncompromising quality and authentic recipes since 1994.
                        </p>
                        <div class="flex gap-3" aria-label="Contact Sweets demo">
                            <a href="tel:${contactNumber}" aria-label="Call Sweets demo at +91 34567890" title="Call us" class="w-11 h-11 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                                <svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 8.71a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z"/></svg>
                            </a>
                            <a href="mailto:${emailAddress}" aria-label="Email ${emailAddress}" title="Email us" class="w-11 h-11 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                                <svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                            </a>
                            <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Sweets demo on WhatsApp at +91 34567890" title="WhatsApp us" class="w-11 h-11 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                                <svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M9 8.8c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .3-.1.9-.6 1.2-.4.3-1 .5-1.7.4-1-.1-2.3-.7-3.5-1.8-1.2-1.1-2-2.5-2.2-3.6-.1-.7.1-1.4.4-1.8Z"/></svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-neutral-900 font-serif font-bold text-lg mb-6">Quick Links</h2>
                        <ul class="space-y-3 text-sm">
                            <li><a href="index.html" class="hover:text-primary">Home</a></li>
                            <li><a href="sweets.html" class="hover:text-primary">Sweets</a></li>
                            <li><a href="bakery.html" class="hover:text-primary">Bakery</a></li>
                            <li><a href="chai-spot.html" class="hover:text-primary">Chai Spot</a></li>
                            <li><a href="about.html" class="hover:text-primary">About Us</a></li>
                            <li><a href="stores.html" class="hover:text-primary">Our Stores</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-neutral-900 font-serif font-bold text-lg mb-6">Customer Service</h2>
                        <ul class="space-y-3 text-sm">
                            <li><button type="button" onclick="toggleSearch()" class="hover:text-primary">Search Products</button></li>
                            <li><a href="mailto:${emailAddress}" class="hover:text-primary">Contact Us</a></li>
                            <li><span>Terms &amp; Conditions</span></li>
                            <li><span>Privacy Policy</span></li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-neutral-900 font-serif font-bold text-lg mb-6">Contact Us</h2>
                        <ul class="space-y-4 text-sm">
                            <li><a href="tel:${contactNumber}" aria-label="Call +91 34567890" class="inline-flex items-center gap-3 hover:text-primary"><svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 8.71a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z"/></svg><span>+91 34567890</span></a></li>
                            <li><a href="mailto:${emailAddress}" aria-label="Email ${emailAddress}" class="inline-flex items-center gap-3 hover:text-primary"><svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span>${emailAddress}</span></a></li>
                            <li><a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp at +91 34567890" class="inline-flex items-center gap-3 hover:text-primary"><svg aria-hidden="true" viewBox="0 0 24 24" class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M9 8.8c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .3-.1.9-.6 1.2-.4.3-1 .5-1.7.4-1-.1-2.3-.7-3.5-1.8-1.2-1.1-2-2.5-2.2-3.6-.1-.7.1-1.4.4-1.8Z"/></svg><span>WhatsApp</span></a></li>
                            <li class="flex items-start gap-3"><i class="ph ph-map-pin text-xl text-primary"></i><span>Corporate Office:<br>Chintal, Hyderabad,<br>Telangana - 500054</span></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-neutral-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
                    <p>&copy; 2026 Sweets demo. All rights reserved.</p>
                    <div class="flex items-center gap-2"><span>Quality &amp; Tradition</span><i class="ph ph-heart text-lg"></i></div>
                </div>
            </div>
        </footer>
    `;
}

window.renderFooter = renderFooter;
