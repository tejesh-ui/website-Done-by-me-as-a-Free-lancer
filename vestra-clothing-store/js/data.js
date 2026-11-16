/* =========================================================================
   VESTRA — site data
   -------------------------------------------------------------------------
   The single place to edit business details, products, stores and
   testimonials. Every page reads from here.

   Image paths are relative to the project root (no leading slash).
   Prices are in Indian rupees and are SAMPLE values — replace them with your
   real prices (or set price: null to hide the price on a product).
   ========================================================================= */

/* ---- Business settings ------------------------------------------------- */
/* TODO before launch: the phone / WhatsApp number below is a placeholder.
   Replace it with the real 10-digit number. WhatsApp format = country code +
   number, digits only (for India: 91XXXXXXXXXX).                           */
const SITE = {
    name: 'VESTRA',            /* placeholder store name — also change the page titles in the HTML files */
    shortName: 'VESTRA',
    tagline: 'Clothing Store',
    phoneDisplay: '+91 00000 00000',
    phoneHref: '+910000000000',
    whatsapp: '910000000000',
    email: 'hello@vestrastore.com',
    office: ['Head Office', 'Address to be added,', 'Hyderabad, Telangana'],
    /* Set to e.g. 'Open daily, 10:30 AM – 9:30 PM' once confirmed. */
    hours: null,
    social: {
        instagram: '',
        facebook: '',
        youtube: ''
    }
};

/* Size guide shown on product pages. */
const SIZES = {
    tops: ['S', 'M', 'L', 'XL', 'XXL'],
    womenTops: ['XS', 'S', 'M', 'L', 'XL'],
    waist: ['28', '30', '32', '34', '36', '38'],
    womenBottoms: ['26', '28', '30', '32', '34'],
    free: ['Free size']
};

/* ---- Men --------------------------------------------------------------- */
/* featured: true  → shown with a "Bestseller" tag
   image: null     → shows a branded "photo coming soon" tile                */
const menData = [
    { id: 'm1', name: 'Classic White Oxford Shirt', category: 'Shirts', price: 1799, sizes: SIZES.tops, colors: 'White', image: 'assets/images/men/white-oxford-shirt.jpg', featured: true, description: 'A crisp cotton oxford with a button-down collar — equally at home with chinos or a blazer.' },
    { id: 'm2', name: 'Navy Check Casual Shirt', category: 'Shirts', price: 1599, sizes: SIZES.tops, colors: 'Navy check', image: 'assets/images/men/navy-check-shirt.jpg', description: 'A soft, breathable check shirt for weekends and relaxed work days.' },
    { id: 'm3', name: 'Sky Blue Striped Shirt', category: 'Shirts', price: 1699, sizes: SIZES.tops, colors: 'Sky blue', image: 'assets/images/men/sky-blue-striped-shirt.jpg', description: 'Fine vertical stripes on lightweight cotton, cut for a clean, regular fit.' },
    { id: 'm4', name: 'Olive Linen Shirt', category: 'Shirts', price: 1999, sizes: SIZES.tops, colors: 'Olive', image: 'assets/images/men/olive-linen-shirt.jpg', description: 'A relaxed linen-blend shirt that stays cool through the warmest days.' },

    { id: 'm5', name: 'Essential Black Tee', category: 'T-Shirts', price: 799, sizes: SIZES.tops, colors: 'Black', image: 'assets/images/men/black-essential-tee.jpg', description: 'A heavyweight cotton crew-neck tee that holds its shape wash after wash.' },
    { id: 'm6', name: 'Heather Grey Crew Tee', category: 'T-Shirts', price: 799, sizes: SIZES.tops, colors: 'Heather grey', image: 'assets/images/men/grey-crew-tee.jpg', description: 'A soft everyday tee in a classic marl grey.' },
    { id: 'm7', name: 'Mustard Polo T-Shirt', category: 'T-Shirts', price: 1099, sizes: SIZES.tops, colors: 'Mustard', image: 'assets/images/men/mustard-polo.jpg', description: 'A smart piqué polo with a ribbed collar and two-button placket.' },
    { id: 'm8', name: 'Striped Breton Tee', category: 'T-Shirts', price: 999, sizes: SIZES.tops, colors: 'Off-white / navy', image: 'assets/images/men/striped-breton-tee.jpg', description: 'A nautical-striped tee in soft jersey — a wardrobe staple.' },

    { id: 'm9', name: 'Slim Fit Khaki Chinos', category: 'Pants', price: 1899, sizes: SIZES.waist, colors: 'Khaki', image: 'assets/images/men/khaki-chinos.jpg', description: 'Stretch-cotton chinos with a tapered leg and a comfortable mid-rise.' },
    { id: 'm10', name: 'Charcoal Formal Trousers', category: 'Pants', price: 2199, sizes: SIZES.waist, colors: 'Charcoal pinstripe', image: 'assets/images/men/charcoal-trousers.jpg', description: 'Tailored pinstripe trousers with a flat front and a clean break.' },
    { id: 'm11', name: 'Beige Cargo Pants', category: 'Pants', price: 2099, sizes: SIZES.waist, colors: 'Beige', image: 'assets/images/men/beige-cargo-pants.jpg', description: 'Utility cargo pants with roomy thigh pockets and a relaxed taper.' },

    { id: 'm12', name: 'Dark Indigo Slim Jeans', category: 'Jeans', price: 2299, sizes: SIZES.waist, colors: 'Dark indigo', image: 'assets/images/men/indigo-slim-jeans.jpg', description: 'Slim-fit stretch denim in a deep indigo wash with contrast stitching.' },
    { id: 'm13', name: 'Light Wash Straight Jeans', category: 'Jeans', price: 2199, sizes: SIZES.waist, colors: 'Light blue', image: 'assets/images/men/light-wash-jeans.jpg', description: 'A straight-leg jean in a faded light wash for easy everyday wear.' },

    { id: 'm14', name: 'Oversized Black Hoodie', category: 'Hoodies', price: 1899, sizes: SIZES.tops, colors: 'Black', image: 'assets/images/men/black-oversized-hoodie.jpg', featured: true, description: 'A heavyweight fleece hoodie with a roomy fit, kangaroo pocket and ribbed cuffs.' },
    { id: 'm15', name: 'Grey Zip Hoodie', category: 'Hoodies', price: 1999, sizes: SIZES.tops, colors: 'Grey', image: 'assets/images/men/grey-zip-hoodie.jpg', description: 'A full-zip hoodie in soft brushed fleece — easy to layer.' },

    { id: 'm16', name: 'Charcoal Pinstripe Blazer', category: 'Blazers', price: 4499, sizes: SIZES.tops, colors: 'Charcoal', image: 'assets/images/men/charcoal-blazer.jpg', featured: true, description: 'A single-breasted blazer in a fine pinstripe, tailored for meetings and evenings out.' },
    { id: 'm17', name: 'Navy Slim Blazer', category: 'Blazers', price: 4799, sizes: SIZES.tops, colors: 'Navy', image: 'assets/images/men/navy-slim-blazer.jpg', description: 'A slim-cut navy blazer with notch lapels and a half-lined finish.' },

    { id: 'm18', name: 'Olive Bomber Jacket', category: 'Jackets', price: 3299, sizes: SIZES.tops, colors: 'Olive', image: 'assets/images/men/olive-bomber-jacket.jpg', description: 'A lightweight bomber with ribbed trims and a full zip front.' },
    { id: 'm19', name: 'Classic Denim Jacket', category: 'Jackets', price: 2799, sizes: SIZES.tops, colors: 'Mid blue', image: 'assets/images/men/denim-jacket.jpg', description: 'A timeless trucker-style denim jacket with chest flap pockets.' }
];

/* ---- Women ------------------------------------------------------------- */
const womenData = [
    { id: 'w1', name: 'White Button Blouse', category: 'Tops', price: 1499, sizes: SIZES.womenTops, colors: 'White', image: 'assets/images/women/white-button-blouse.jpg', description: 'A light cotton blouse with short sleeves and a classic collar.' },
    { id: 'w2', name: 'Rose V-Neck Top', category: 'Tops', price: 899, sizes: SIZES.womenTops, colors: 'Rose', image: 'assets/images/women/rose-v-neck-top.jpg', description: 'A soft jersey V-neck top — easy to wear on its own or layered.' },
    { id: 'w3', name: 'Black Fitted Crop Top', category: 'Tops', price: 799, sizes: SIZES.womenTops, colors: 'Black', image: 'assets/images/women/black-crop-top.jpg', description: 'A fitted, cropped V-neck top that pairs with high-rise bottoms.' },

    { id: 'w4', name: 'Floral Midi Dress', category: 'Dresses', price: 2499, sizes: SIZES.womenTops, colors: 'Cream floral', image: 'assets/images/women/floral-midi-dress.jpg', featured: true, description: 'A flowing midi dress in a pretty floral print with a defined waist.' },
    { id: 'w5', name: 'Black Wrap Dress', category: 'Dresses', price: 2799, sizes: SIZES.womenTops, colors: 'Black', image: 'assets/images/women/black-wrap-dress.jpg', description: 'A flattering wrap dress with a tie waist, made for dinners and occasions.' },
    { id: 'w6', name: 'Mustard Summer Dress', category: 'Dresses', price: 1999, sizes: SIZES.womenTops, colors: 'Mustard', image: 'assets/images/women/mustard-summer-dress.jpg', description: 'A light strappy dress with an A-line skirt, ideal for warm days.' },

    { id: 'w7', name: 'Teal Printed Kurti', category: 'Kurtis', price: 1399, sizes: SIZES.womenTops, colors: 'Teal', image: 'assets/images/women/teal-printed-kurti.jpg', featured: true, description: 'A straight-cut cotton kurti with a geometric print and a golden hem border.' },
    { id: 'w8', name: 'Maroon Embroidered Kurti', category: 'Kurtis', price: 1699, sizes: SIZES.womenTops, colors: 'Maroon', image: 'assets/images/women/maroon-embroidered-kurti.jpg', description: 'A rich maroon kurti with yoke embroidery and a contrast border.' },
    { id: 'w9', name: 'Mustard Cotton Kurti', category: 'Kurtis', price: 1299, sizes: SIZES.womenTops, colors: 'Mustard', image: 'assets/images/women/mustard-cotton-kurti.jpg', description: 'An everyday cotton kurti with a small dot print and a bold hem.' },

    { id: 'w10', name: 'High-Rise Skinny Jeans', category: 'Jeans & Pants', price: 2199, sizes: SIZES.womenBottoms, colors: 'Indigo', image: 'assets/images/women/high-rise-skinny-jeans.jpg', description: 'High-rise stretch jeans that sit comfortably and hold their shape.' },
    { id: 'w11', name: 'Beige Wide-Leg Trousers', category: 'Jeans & Pants', price: 2099, sizes: SIZES.womenBottoms, colors: 'Beige', image: 'assets/images/women/beige-wide-leg-trousers.jpg', description: 'Fluid wide-leg trousers with a high waist, for work and weekends.' },
    { id: 'w12', name: 'Black Straight Pants', category: 'Jeans & Pants', price: 1899, sizes: SIZES.womenBottoms, colors: 'Black', image: 'assets/images/women/black-straight-pants.jpg', description: 'Straight-cut black pants with a clean line — a dependable basic.' },

    { id: 'w13', name: 'Lilac Cropped Hoodie', category: 'Hoodies', price: 1799, sizes: SIZES.womenTops, colors: 'Lilac', image: 'assets/images/women/lilac-cropped-hoodie.jpg', description: 'A soft cropped hoodie in lilac with a kangaroo pocket.' },
    { id: 'w14', name: 'Cream Oversized Hoodie', category: 'Hoodies', price: 1899, sizes: SIZES.womenTops, colors: 'Cream', image: 'assets/images/women/cream-oversized-hoodie.jpg', description: 'An oversized, cosy hoodie in a warm cream fleece.' },

    { id: 'w15', name: 'Beige Tailored Blazer', category: 'Blazers', price: 4299, sizes: SIZES.womenTops, colors: 'Beige', image: 'assets/images/women/beige-tailored-blazer.jpg', featured: true, description: 'A tailored single-breasted blazer in a warm beige, for the office and beyond.' },
    { id: 'w16', name: 'Black Double-Breasted Blazer', category: 'Blazers', price: 4699, sizes: SIZES.womenTops, colors: 'Black', image: 'assets/images/women/black-double-breasted-blazer.jpg', description: 'A sharp double-breasted blazer with four buttons and structured shoulders.' },

    { id: 'w17', name: 'Pleated Midi Skirt', category: 'Skirts', price: 1599, sizes: SIZES.womenBottoms, colors: 'Sage green', image: 'assets/images/women/pleated-midi-skirt.jpg', description: 'A flowing pleated midi skirt with an elasticated, comfortable waist.' },
    { id: 'w18', name: 'Denim A-Line Skirt', category: 'Skirts', price: 1499, sizes: SIZES.womenBottoms, colors: 'Mid blue', image: 'assets/images/women/denim-a-line-skirt.jpg', description: 'An A-line denim skirt with contrast stitching and front pockets.' }
];

/* ---- Accessories ------------------------------------------------------- */
const accessoryData = [
    { id: 'a1', name: 'Cotton Cap', category: 'Accessories', price: 599, sizes: SIZES.free, colors: 'Navy', image: 'assets/images/accessories/cotton-cap.jpg', description: 'A soft cotton cap with an adjustable strap.' },
    { id: 'a2', name: 'Leather Belt', category: 'Accessories', price: 999, sizes: SIZES.waist, colors: 'Brown', image: 'assets/images/accessories/leather-belt.jpg', description: 'A classic leather belt with a brushed metal buckle.' },
    { id: 'a3', name: 'Wool Scarf', category: 'Accessories', price: 1199, sizes: SIZES.free, colors: 'Rust / cream', image: 'assets/images/accessories/wool-scarf.jpg', description: 'A warm striped scarf with fringed ends.' },
    { id: 'a4', name: 'Canvas Tote Bag', category: 'Accessories', price: 899, sizes: SIZES.free, colors: 'Natural', image: 'assets/images/accessories/canvas-tote.jpg', description: 'A sturdy canvas tote for daily errands and weekends.' },
    { id: 'a5', name: 'Ribbed Beanie', category: 'Accessories', price: 499, sizes: SIZES.free, colors: 'Teal', image: 'assets/images/accessories/ribbed-beanie.jpg', description: 'A snug ribbed beanie with a soft pom-pom.' },
    { id: 'a6', name: 'Crew Socks (Pack of 3)', category: 'Accessories', price: 449, sizes: SIZES.free, colors: 'Assorted', image: 'assets/images/accessories/crew-socks-pack.jpg', description: 'Three pairs of soft cotton-blend crew socks.' }
];

const allProducts = [...menData, ...womenData, ...accessoryData];

/* Which shop page a product belongs to (used for breadcrumbs/links). */
const SECTIONS = {
    men: { label: 'Men', page: 'pages/men.html', items: menData },
    women: { label: 'Women', page: 'pages/women.html', items: womenData },
    accessories: { label: 'Accessories', page: 'pages/accessories.html', items: accessoryData }
};

/* ---- Stores ------------------------------------------------------------ */
/* PLACEHOLDER — the store names, areas and map links below are samples for
   layout. Replace them with your real stores, or delete entries you do not
   need (every page that lists stores updates automatically).               */
const STORES = [
    { name: 'Main Store', area: 'Address to be added', image: 'assets/images/stores/store-one.jpg', map: 'https://www.google.com/maps/search/?api=1&query=VESTRA+clothing+store+Hyderabad' },
    { name: 'Second Store', area: 'Address to be added', image: 'assets/images/stores/store-two.jpg', map: 'https://www.google.com/maps/search/?api=1&query=VESTRA+clothing+store+Hyderabad' },
    { name: 'Third Store', area: 'Address to be added', image: 'assets/images/stores/store-three.jpg', map: 'https://www.google.com/maps/search/?api=1&query=VESTRA+clothing+store+Hyderabad' }
];

/* ---- Testimonials ------------------------------------------------------ */
/* PLACEHOLDER — sample quotes written for layout only. Replace with genuine
   customer reviews (with permission) before launch, or set this array to []
   to hide the section.                                                      */
const TESTIMONIALS = [
    { quote: 'The shirts fit well and the fabric feels good. Sizing advice over WhatsApp saved me a trip.', name: '', context: 'Shirts & chinos' },
    { quote: 'Found a blazer and two kurtis in one visit. The team was helpful without being pushy.', name: '', context: 'Wardrobe refresh' },
    { quote: 'We ordered matching polos for our team and they were ready on time.', name: '', context: 'Team uniforms' }
];

window.SITE = SITE;
