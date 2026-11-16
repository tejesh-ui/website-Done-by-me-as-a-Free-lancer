/* =========================================================================
   ALLEN Kitchen & Bar — site data
   -------------------------------------------------------------------------
   This is the single place to edit business details, menu items, outlets and
   testimonials. Every page reads from here.

   Image paths are relative to the project root (no leading slash); the
   renderer prefixes them correctly for pages inside /pages.
   ========================================================================= */

/* ---- Business settings ------------------------------------------------- */
/* TODO before launch: the phone / WhatsApp number below is a placeholder.
   Replace it with the real 10-digit number. WhatsApp format = country code +
   number, digits only (for India: 91XXXXXXXXXX).                           */
const SITE = {
    name: 'ALLEN',
    shortName: 'ALLEN',
    tagline: 'Kitchen & Bar',
    phoneDisplay: '+91 00000 00000',
    phoneHref: '+910000000000',
    whatsapp: '910000000000',
    email: 'hello@allenkitchenbar.com',
    office: ['Head Office', 'Address to be added,', 'Hyderabad, Telangana'],
    /* Set to e.g. 'Open daily, 12:00 PM – 11:00 PM' once confirmed.
       While null, the site asks visitors to call for today's hours. */
    hours: null,
    /* Add full profile URLs to show the icons in the footer. Empty = hidden. */
    social: {
        instagram: '',
        facebook: '',
        youtube: ''
    }
};

/* ---- Kitchen ----------------------------------------------------------- */
/* featured: true  → shown as a chef's pick
   image: null     → shows a branded "photo coming soon" tile              */
const kitchenData = [
    { id: 'k1', name: 'Paneer Tikka', category: 'Starters', image: 'assets/images/kitchen/paneer-tikka.jpg', featured: true, description: 'Soft paneer cubes marinated in spiced yoghurt and charred in the tandoor with peppers and onions.' },
    { id: 'k2', name: 'Chicken 65', category: 'Starters', image: 'assets/images/kitchen/chicken-65.jpg', description: 'Crisp, fiery fried chicken tossed with curry leaves and green chillies — the Hyderabad bar-side classic.' },
    { id: 'k3', name: 'Crispy Corn', category: 'Starters', image: 'assets/images/kitchen/crispy-corn.jpg', description: 'Golden fried sweet corn tossed with onions, peppers and a peppery seasoning.' },
    { id: 'k4', name: 'Hara Bhara Kebab', category: 'Starters', image: 'assets/images/kitchen/hara-bhara-kebab.jpg', description: 'Spinach, peas and potato patties, pan-seared and served with mint chutney.' },
    { id: 'k5', name: 'Chilli Chicken', category: 'Starters', image: 'assets/images/kitchen/chilli-chicken.jpg', description: 'Wok-tossed chicken with capsicum, spring onion and a glossy chilli-soy glaze.' },
    { id: 'k6', name: 'Fish Fingers', category: 'Starters', image: 'assets/images/kitchen/fish-fingers.jpg', description: 'Crumb-coated fish strips fried crisp and served with a tangy tartare dip.' },

    { id: 'k7', name: 'Hyderabadi Chicken Biryani', category: 'Biryani', image: 'assets/images/kitchen/hyderabadi chicken biryani.jpg', featured: true, description: 'Fragrant basmati layered with marinated chicken and slow-cooked dum style, served with raita.' },
    { id: 'k8', name: 'Veg Dum Biryani', category: 'Biryani', image: 'assets/images/kitchen/veg-dum-briyani.jpg', description: 'Seasonal vegetables and aromatic rice sealed and steamed together for a rich, layered flavour.' },
    { id: 'k9', name: 'Mutton Biryani', category: 'Biryani', image: 'assets/images/kitchen/mutton biryani.jpg', description: 'Tender mutton and long-grain rice cooked slowly with whole spices and fried onions.' },

    { id: 'k10', name: 'Butter Chicken', category: 'Mains', image: 'assets/images/kitchen/butter-chicken.jpg', featured: true, description: 'Tandoori chicken simmered in a silky tomato and butter gravy — best with garlic naan.' },
    { id: 'k11', name: 'Paneer Butter Masala', category: 'Mains', image: 'assets/images/kitchen/paneer-butter-masala.jpg', description: 'Soft paneer in a creamy, mildly sweet tomato gravy finished with butter.' },
    { id: 'k12', name: 'Dal Makhani', category: 'Mains', image: 'assets/images/kitchen/dal-makhani.jpg', description: 'Black lentils and kidney beans slow-cooked overnight until velvety and rich.' },

    { id: 'k13', name: 'Masala Dosa', category: 'South Indian', image: 'assets/images/kitchen/masala dosa.jpg', description: 'A thin, crisp dosa folded around spiced potato, served with sambar and chutneys.' },
    { id: 'k14', name: 'Andhra Chicken Curry', category: 'South Indian', image: 'assets/images/kitchen/andhra-chicken-curry.jpg', description: 'A bold, peppery Andhra-style curry with roasted spices and fresh curry leaves.' },

    { id: 'k15', name: 'Veg Hakka Noodles', category: 'Oriental', image: 'assets/images/kitchen/veg hakka noodles.jpg', description: 'Wok-fired noodles tossed with crunchy vegetables and soy.' },
    { id: 'k16', name: 'Basil Rice Chicken', category: 'Oriental', image: 'assets/images/kitchen/basil-rice-chicken.jpg', description: 'Aromatic basil-scented rice topped with spicy stir-fried chicken.' },
    { id: 'k17', name: 'Veg Manchurian', category: 'Oriental', image: 'assets/images/kitchen/veg manchurian.jpg', description: 'Crisp vegetable dumplings in a garlicky, tangy Manchurian sauce.' },
    { id: 'k18', name: 'Kung Pao Chicken', category: 'Oriental', image: 'assets/images/kitchen/kung-pao-chicken.jpg', description: 'Diced chicken, peanuts and dried chillies in a sweet-savoury wok sauce.' },

    { id: 'k19', name: 'Penne Alfredo', category: 'Continental', image: 'assets/images/kitchen/penne alfredo.jpg', description: 'Penne in a creamy white sauce with garlic, herbs and parmesan.' },
    { id: 'k20', name: 'Margherita Pizza', category: 'Continental', image: 'assets/images/desserts/Margherita Pizza.jpg', description: 'Thin crust, tomato sauce, fresh mozzarella and basil.' },
    { id: 'k21', name: 'Grilled Chicken Steak', category: 'Continental', image: 'assets/images/kitchen/grilled-chicken-steak.jpg', description: 'Juicy grilled chicken with sautéed vegetables, mash and a peppercorn sauce.' },
    { id: 'k22', name: 'Caesar Salad', category: 'Continental', image: 'assets/images/kitchen/caesar salad.jpg', description: 'Crisp romaine, croutons and parmesan shavings in a classic Caesar dressing.' },

    { id: 'k23', name: "ALLEN Chef's Platter", category: 'Signature', image: 'assets/images/kitchen/chefs-platter.jpg', featured: true, description: 'A sharing platter of our favourite starters — the easiest way to order a little of everything.' }
];

/* ---- Bar --------------------------------------------------------------- */
const barData = [
    { id: 'b1', name: 'Mojito', category: 'Cocktails', image: 'assets/images/bar/mojito.jpg', description: 'Muddled mint and lime, a splash of soda and crushed ice.' },
    { id: 'b2', name: 'Long Island Iced Tea', category: 'Cocktails', image: 'assets/images/bar/fresh-lime-soda.jpg', description: 'A tall, strong classic topped with cola and a lemon twist.' },
    { id: 'b3', name: 'Old Fashioned', category: 'Cocktails', image: 'assets/images/bar/old-fashioned.jpg', description: 'Whisky stirred slowly with bitters and a hint of sugar over a large ice cube.' },
    { id: 'b4', name: 'Margarita', category: 'Cocktails', image: 'assets/images/bar/margarita.jpg', description: 'Tequila, lime and orange liqueur with a salted rim.' },
    { id: 'b5', name: 'Cosmopolitan', category: 'Cocktails', image: 'assets/images/bar/cosmopolitan.jpg', description: 'Vodka, cranberry and lime, shaken cold and served in a coupe.' },
    { id: 'b6', name: 'Whisky Sour', category: 'Cocktails', image: 'assets/images/bar/whisy-sour.jpg', description: 'Whisky, lemon and sugar shaken to a smooth, tangy finish.' },

    { id: 'b7', name: 'Virgin Mojito', category: 'Mocktails', image: 'assets/images/bar/virgin mojito.jpg', description: 'All the mint and lime of a mojito, without the alcohol.' },
    { id: 'b8', name: 'Blue Lagoon', category: 'Mocktails', image: 'assets/images/bar/blue-lagoon.jpg', description: 'Blue curaçao syrup, lemon and soda over ice — bright and refreshing.' },
    { id: 'b9', name: 'Watermelon Cooler', category: 'Mocktails', image: 'assets/images/bar/watermelon cooler.jpg', description: 'Fresh watermelon, mint and lime served ice-cold.' },
    { id: 'b10', name: 'Fresh Lime Soda', category: 'Mocktails', image: 'assets/images/bar/fresh-lime-soda.jpg', description: 'Sweet, salted or mixed — the everyday thirst-quencher.' },
    { id: 'b11', name: 'Passion Fruit Fizz', category: 'Mocktails', image: 'assets/images/bar/passion-fruit-fizz.jpg', description: 'Tropical passion fruit with a sparkling finish.' },
    { id: 'b12', name: 'Mango Ginger Cooler', category: 'Mocktails', image: 'assets/images/bar/mango-ginger-cooler.jpg', description: 'Sweet mango and a warm ginger kick over crushed ice.' },

    { id: 'b13', name: 'Draught Beer', category: 'Beer & Wine', image: 'assets/images/bar/draught-beer.jpg', description: 'A cold, crisp pint to go with the starters.' },
    { id: 'b14', name: 'Red Wine', category: 'Beer & Wine', image: 'assets/images/bar/red-wine.jpg', description: 'A smooth red by the glass — ask our team for today\'s pour.' },
    { id: 'b15', name: 'White Wine', category: 'Beer & Wine', image: 'assets/images/bar/white-wine.jpg', description: 'A light, chilled white by the glass — ask our team for today\'s pour.' },

    { id: 'b16', name: 'Filter Coffee', category: 'Coffee & Tea', image: 'assets/images/bar/filter-coffee.jpg', description: 'Strong South Indian filter coffee, frothy and served hot.' },
    { id: 'b17', name: 'Masala Chai', category: 'Coffee & Tea', image: 'assets/images/bar/masala-chai.jpg', description: 'Tea simmered with milk, ginger and warming spices.' },
    { id: 'b18', name: 'Cold Coffee', category: 'Coffee & Tea', image: 'assets/images/bar/cold-coffee.jpg', description: 'Chilled blended coffee, creamy and lightly sweet.' }
];

/* ---- Desserts ---------------------------------------------------------- */
const dessertData = [
    { id: 'd1', name: 'Sizzling Brownie', category: 'Desserts', image: 'assets/images/desserts/sizzling brownie.jpg', featured: true, description: 'A warm chocolate brownie on a sizzling plate with vanilla ice cream and chocolate sauce.' },
    { id: 'd2', name: 'Gulab Jamun with Ice Cream', category: 'Desserts', image: 'assets/images/desserts/gulab jamun ice cream.jpg', description: 'Soft, syrup-soaked gulab jamun served warm with a scoop of vanilla.' },
    { id: 'd3', name: 'Tiramisu', category: 'Desserts', image: 'assets/images/desserts/tirmisu.jpg', description: 'Coffee-soaked sponge layered with mascarpone cream and dusted with cocoa.' },
    { id: 'd4', name: 'New York Cheesecake', category: 'Desserts', image: 'assets/images/desserts/new-york-cheesecake.jpg', description: 'Dense, creamy baked cheesecake on a buttery biscuit base.' },
    { id: 'd5', name: 'Rasmalai', category: 'Desserts', image: 'assets/images/desserts/rasmalai.jpg', description: 'Soft paneer discs soaked in chilled saffron-cardamom milk.' },
    { id: 'd6', name: 'Chocolate Lava Cake', category: 'Desserts', image: 'assets/images/desserts/chocolate lava cake.jpg', description: 'A warm chocolate cake with a molten centre.' },
    { id: 'd7', name: 'Crème Brûlée', category: 'Desserts', image: 'assets/images/desserts/creme-brulee.jpg', description: 'Silky vanilla custard under a crackling caramelised sugar top.' }
];

const allProducts = [...kitchenData, ...barData, ...dessertData];

/* Which menu page a product belongs to (used for breadcrumbs/links). */
const SECTIONS = {
    kitchen: { label: 'Kitchen', page: 'pages/kitchen.html', items: kitchenData },
    bar: { label: 'Bar', page: 'pages/bar.html', items: barData },
    desserts: { label: 'Desserts', page: 'pages/desserts.html', items: dessertData }
};

/* ---- Outlets ------------------------------------------------------------ */
/* PLACEHOLDER — the outlet names, areas and map links below are samples for
   layout. Replace them with your real outlets, or delete entries you do not
   need (every page that lists outlets updates automatically).              */
const STORES = [
    { name: 'Madhapur', area: 'Address to be added', image: 'assets/images/stores/madhapur.jpg', map: 'https://www.google.com/maps/search/?api=1&query=ALLEN+Kitchen+and+Bar+Madhapur+Hyderabad' },
    { name: 'Jubilee Hills', area: 'Address to be added', image: 'assets/images/stores/jubilee-hills.jpg', map: 'https://www.google.com/maps/search/?api=1&query=ALLEN+Kitchen+and+Bar+Jubilee+Hills+Hyderabad' },
    { name: 'Gachibowli', area: 'Address to be added', image: 'assets/images/stores/gachibowli.jpg', map: 'https://www.google.com/maps/search/?api=1&query=ALLEN+Kitchen+and+Bar+Gachibowli+Hyderabad' }
];

/* ---- Testimonials ------------------------------------------------------ */
/* PLACEHOLDER — these are sample quotes written for layout only.
   Replace with genuine guest reviews (e.g. from Google reviews, with
   permission) before launch, or set this array to [] to hide the section. */
const TESTIMONIALS = [
    { quote: 'The biryani arrived piping hot and the starters kept coming. A great spot for a relaxed dinner with friends.', name: '', context: 'Dinner with friends' },
    { quote: 'We booked ALLEN for a team celebration. The staff were warm, the drinks were well made and the food came out on time.', name: '', context: 'Team celebration' },
    { quote: 'Lovely ambience and a menu with something for everyone — the dessert platter was the perfect finish.', name: '', context: 'Family evening' }
];

window.SITE = SITE;
