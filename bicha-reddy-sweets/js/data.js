// --- DATA ---
// Note: Image URLs use high quality Unsplash placeholders for local environment usage.

// Sweets Data
const sweetsData = [
    { id: 's1', name: 'Laddu', category: 'Laddu', image: '../images/products/Laddu.jpg' },
    { id: 's2', name: 'Motichoor Laddu', category: 'Laddu', image: '../images/products/Motichoor Laddu.jpg', featured: true },
    { id: 's3', name: 'Anjeer Laddu', category: 'Laddu', image: '../images/products/Anjeer Laddu.jpg' },
    { id: 's4', name: 'Besan Laddu', category: 'Laddu', image: '../images/products/Besan Laddu.jpg' },
    { id: 's5', name: 'Rava Laddu', category: 'Laddu', image: '../images/products/Rava Laddu.jpg' },
    { id: 's6', name: 'Coconut Laddu', category: 'Laddu', image: '../images/products/Coconut Laddu.jpg' },

    { id: 's7', name: 'Badam Halwa', category: 'Halwa', image: '../images/products/Badam Halwa.jpg' },
    { id: 's8', name: 'Kaju Katli', category: 'Kaju', image: '../images/products/Kaju Katli.jpg', featured: true },
    { id: 's9', name: 'Malai Kaju Katli', category: 'Kaju', image: '../images/products/Malai Kaju Katli.jpg' },

    { id: 's10', name: 'Kaju Pista Roll', category: 'Kaju', image: '../images/products/Kaju Pista Roll.jpg' },
    { id: 's11', name: 'Kaju Anjeer Roll', category: 'Kaju', image: '../images/products/Kaju Anjeer Roll.jpg' },
    { id: 's12', name: 'Kaju Badam Roll', category: 'Kaju', image: '../images/products/Kaju Badam Roll.jpg' },

    { id: 's13', name: 'Kaju Pista', category: 'Kaju', image: '../images/products/Kaju Pista.jpg' },
    { id: 's14', name: 'Kaju Chocolate', category: 'Kaju', image: '../images/products/Kaju Chocolate.jpg' },

    { id: 's15', name: 'Dry Fruit Halwa', category: 'Halwa', image: '../images/products/Dry Fruit Halwa.jpg' },
    { id: 's16', name: 'Dry Fruit Roll', category: 'Dry Fruit', image: '../images/products/Dry Fruit Roll.jpg' },

    { id: 's17', name: 'Pista Burfi', category: 'Burfi', image: '../images/products/Pista Burfi.jpg', featured: true },
    { id: 's18', name: 'Kaju Burfi', category: 'Burfi', image: '../images/products/Kaju Burfi.jpg' },

    { id: 's19', name: 'Pista Kaju', category: 'Kaju', image: '../images/products/Pista Kaju.jpg' },
    { id: 's20', name: 'Kaju Pista Chocolate', category: 'Kaju', image: '../images/products/Kaju Pista Chocolate.jpg' },

    { id: 's21', name: 'Special Assorted', category: 'Special', image: '../images/products/Special Assorted.jpg', featured: true }
];


// Chai Spot Data
const chaiSpotData = [
    { id: 'c1', name: 'Samosa Ragda', category: 'Chai Spot', image: '../images/products/Samosa Ragda.jpg' },
    { id: 'c2', name: 'Cutlet Ragda', category: 'Chai Spot', image: '../images/products/Ragda Cutlet.jpg' },
    { id: 'c3', name: 'Kachori Ragda', category: 'Chai Spot', image: '../images/products/Ragda Kachori.jpg' },
    { id: 'c4', name: 'Papdi Ragda', category: 'Chai Spot', image: '../images/products/Ragda Papdi.jpg' },
    { id: 'c5', name: 'Aloo Tikki', category: 'Chai Spot', image: '../images/products/Ragda Aloo Tikki.jpg' },

    { id: 'c6', name: 'Bhel Puri', category: 'Chai Spot', image: '../images/products/Bhelpuri.jpg' },
    { id: 'c7', name: 'Sev Puri', category: 'Chai Spot', image: '../images/products/Sev Puri.jpg' },
    { id: 'c8', name: 'Masala Puri', category: 'Chai Spot', image: '../images/products/Masala Puri.jpg' },

    { id: 'c9', name: 'Vada Pav', category: 'Chai Spot', image: '../images/products/Pav.jpg' },
    { id: 'c10', name: 'Cheese Vada Pav', category: 'Chai Spot', image: '../images/products/Cheese Vada Pav.jpg' },
    { id: 'c11', name: 'Schezwan Vada Pav', category: 'Chai Spot', image: '../images/products/Schezwan Vada Pav.jpg' },

    { id: 'c12', name: 'Dahi Puri', category: 'Chai Spot', image: '../images/products/Dahi Puri.jpg' },
    { id: 'c13', name: 'Dahi Papdi', category: 'Chai Spot', image: '../images/products/Dahi Papdi.jpg' },
    { id: 'c14', name: 'Dahi Cutlet', category: 'Chai Spot', image: '../images/products/Dahi Cutlet.jpg' },
    { id: 'c15', name: 'Dahi Kachori', category: 'Chai Spot', image: '../images/products/Dahi Kachori.jpg' },
    { id: 'c16', name: 'Dahi Bhel', category: 'Chai Spot', image: '../images/products/Dahi Bhel.jpg' },
    { id: 'c17', name: 'Dahi Bundi', category: 'Chai Spot', image: '../images/products/Dahi Bundi.jpg' },

    { id: 'c18', name: 'Pav Bhaji', category: 'Chai Spot', image: '../images/products/Pav.jpg' },
    { id: 'c19', name: 'Cheese Pav Bhaji', category: 'Chai Spot', image: '../images/products/Cheese Pav Bhaji.jpg' },
    { id: 'c20', name: 'Masala Pav Bhaji', category: 'Chai Spot', image: '../images/products/Masala Pav Bhaji.jpg' },
    { id: 'c21', name: 'Paneer Pav Bhaji', category: 'Chai Spot', image: '../images/products/Paneer Pav Bhaji.jpg' },
    { id: 'c22', name: 'Spl. Pav Bhaji', category: 'Chai Spot', image: '../images/products/Spl. Pav Bhaji.jpg' },
    { id: 'c23', name: 'Extra Pav', category: 'Chai Spot', image: '../images/products/Extra Pav.jpg' },

    { id: 'c24', name: 'Panipuri (8 pcs)', category: 'Chai Spot', image: '../images/products/Panipuri (8 pcs).jpg' }
];


// Bakery Data
const bakeryData = [
    { id: 'b1', name: 'Butter Cookies (500g)', category: 'Bakery', image: '../images/products/Butter Cookies (500g).jpg' },
    { id: 'b2', name: 'Black Forest Cake', category: 'Bakery', image: '../images/products/Black Forest Cake.jpg' },
    { id: 'b3', name: 'Veg Puff (Set of 4)', category: 'Bakery', image: '../images/products/Veg Puff (Set of 4).jpg' },
    { id: 'b4', name: 'Fruit Cake Rusk', category: 'Bakery', image: '../images/products/Fruit Cake Rusk.jpg' },
    { id: 'b5', name: 'Butter Cake', category: 'Bakery', image: '../images/products/Butter Cake.jpg' },
    { id: 'b6', name: 'Chocolate Cake', category: 'Bakery', image: '../images/products/Chocolate Cake.jpg' },
    { id: 'b7', name: 'Pineapple Cake', category: 'Bakery', image: '../images/products/Pineapple Cake.jpg' }
];


const allProducts = [
    ...sweetsData,
    ...chaiSpotData,
    ...bakeryData
];
