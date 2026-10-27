/* Shared content for both Maisha Beverages concepts.
   Flavour copy is HOLA's own (hola.co.ke), with dashes rewritten. */
window.MB = window.MB || {};

MB.company = {
  name: 'Maisha Beverages Limited',
  brand: 'HOLA',
  tagline: 'The home of explosive flavours',
  phone: '0715 537 575',
  phoneHref: 'tel:+254715537575',
  email: 'info@hola.co.ke',
  emailHref: 'mailto:info@hola.co.ke?subject=Trade%20enquiry',
  street: 'Spectrum Business Park, Baba Dogo Road',
  city: 'Nairobi, Kenya',
  pobox: 'P.O. Box 49510, 00100 Nairobi',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=-1.2460012%2C36.8875478',
  mapsPlace: 'https://www.google.com/maps/place/Maisha+Beverages+Limited/@-1.2460012,36.8875478,17z',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.874916447874!2d36.8875478!3d-1.2460012000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f15baffe6ede1%3A0xd61bb411f2a1bb7d!2sMaisha%20Beverages%20Limited!5e0!3m2!1sen!2ske!4v1793005391041!5m2!1sen!2ske',
  instagram: 'https://www.instagram.com/hola_beverages/',
  facebook: 'https://www.facebook.com/holabeverages/',
  youtube: 'https://www.youtube.com/watch?v=F2DqzdPeuTY',
  youtubeId: 'F2DqzdPeuTY',
  videoTitle: 'Maisha Beverages: refreshing Kenyans with world class beverages at an affordable price'
};

/* color = label colour used for glows, tints and shadows */
MB.flavours = [
  {
    id: 'cola', name: 'Cola', kind: 'Soft drink', color: '#D3262E', fruit: null,
    line: 'Feisty, full bodied, packs a punch.',
    desc: 'Feisty, full bodied, certainly packs a punch. Our HOLA Cola will leave your taste buds popping with the lingering sweet taste of luscious caramel. So smooth, it’s the stuff that dreams are made of.',
    notes: ['Caramel', 'Full bodied', 'Classic cola']
  },
  {
    id: 'orange', name: 'Orange', kind: 'Soft drink', color: '#F47A1F', fruit: 'orange',
    line: 'Bright, bold, beautiful.',
    desc: 'Bright, bold, beautiful. This one delivers big on flavour. Glass always full, HOLA Orange will make sure you never run out of juice.',
    notes: ['Sweet orange', 'Bright', 'Family favourite']
  },
  {
    id: 'mango', name: 'Mango Special', kind: 'Soft drink', color: '#EE9B12', fruit: 'mango',
    line: 'Juicy and daringly courageous.',
    desc: 'Juicy and daringly courageous. Don’t expect just your average mango. Big on boldness and extra on attitude, it’s no wonder we call it Special.',
    notes: ['Ripe mango', 'Juicy', 'Bold']
  },
  {
    id: 'limao', name: 'Sweet Limão', kind: 'Soft drink', color: '#E9C514', fruit: 'limao',
    line: 'Sunny, smooth and oh so good.',
    desc: 'When life gave us lemons, we made HOLA Sweet Limão. Sunny, smooth and oh so good, just pour over ice and then sit back, sip and smile.',
    notes: ['Sweet lemon', 'Smooth', 'Best over ice']
  },
  {
    id: 'mojito', name: 'Mojito', kind: 'Soft drink', color: '#6DB52D', fruit: 'mojito',
    line: 'Lemony, limey, slightly minted.',
    desc: 'Lemony, limey, slightly minted. Sweet and tangy, cool as the breeze across the Indian Ocean. On a hot day, HOLA Mojito is your answer. Always crisp on the uptake, it’ll leave you feeling so fresh and so clean.',
    notes: ['Lime', 'Mint', 'Alcohol free']
  },
  {
    id: 'berry', name: 'Very Berry', kind: 'Soft drink', color: '#8A2FB0', fruit: 'berry',
    line: 'Fruity, free, lip-smackingly good.',
    desc: 'Fruity and free, lip-smackingly good. HOLA Very Berry is berrylicious to level 100, a flavour straight from the future with no rules and no holding back. This one’s like a ride on a rollercoaster through Flavour Town.',
    notes: ['Mixed berries', 'Fruity', 'Vibrant']
  },
  {
    id: 'rose', name: 'Rosé', kind: 'Soft drink', color: '#E2317C', fruit: 'rose',
    line: 'Vivacious, vibrant, delicately sweet.',
    desc: 'Vivacious and vibrant, delicately sweet. HOLA Rosé is subtle yet sassy. Before the day is over, this hot number will definitely have you singing “sip me baby one more time”.',
    notes: ['Rose petal', 'Delicate', 'Alcohol free']
  },
  {
    id: 'energy', name: 'Energy', kind: 'Energy drink', color: '#5A2E96', fruit: 'energy',
    line: 'Our liquid gold.',
    desc: 'BOOM! HOLA Energy is the most explosive, most energizing drink in town. Dangerously tasty, extraordinarily revitalizing. We call it our Liquid Gold.',
    notes: ['Carbonated energy', 'Liquid gold', 'Also in Red and Green']
  }
];

MB.energyRange = [
  { id: 'energy', name: 'HOLA Energy', img: 'studio/energy.webp', color: '#5A2E96',
    desc: 'The original. Dangerously tasty, extraordinarily revitalizing. We call it our Liquid Gold.' },
  { id: 'energy-red', name: 'Energy Red Berries', img: 'studio/energy-red.webp', color: '#D9381F',
    desc: 'Deep and fruity. The fruity twist you’ll shake your hips to, with a touch of tropical swagger.' },
  { id: 'energy-green', name: 'Energy Green Peach & Lemongrass', img: 'studio/energy-green.webp', color: '#4FA82A',
    desc: 'Zesty, earthy, full of pizzazz. Spicy and subtle with a lot of bubbles. Can you handle the oomph?' }
];

MB.partners = [
  {
    id: 'distributor', name: 'Distributors', short: 'Distributors', icon: 'truck',
    line: 'Take HOLA into your territory with an agreed area and steady supply.',
    points: ['Agree your coverage area with our trade team', 'Order all ten flavours from one supplier', 'Point of sale material for the outlets you serve', 'A direct line to our trade desk in Nairobi']
  },
  {
    id: 'wholesaler', name: 'Wholesalers', short: 'Wholesalers', icon: 'boxes',
    line: 'Fast moving flavours at a price your stockists can sell.',
    points: ['Bulk case orders for your stockists', 'A price point that keeps stock turning', 'New flavours your customers will ask for', 'Regular restocks from our Nairobi plant']
  },
  {
    id: 'supermarket', name: 'Supermarkets', short: 'Supermarkets', icon: 'cart',
    line: 'A full, colourful range that earns its place on the shelf.',
    points: ['Seven soft drinks and three energy drinks', 'Bright labels that stand out in a busy aisle', 'Support for listings and in-store promotions', 'One account for the whole range']
  },
  {
    id: 'shop', name: 'Shops and kiosks', short: 'Shops and kiosks', icon: 'store',
    line: 'Single-serve bottles at a pocket friendly price.',
    points: ['Grab and go bottles that sell from the fridge', 'Save your shilling pricing for your customers', 'Orders through your nearest HOLA distributor', 'Posters and fridge stickers for your shop']
  },
  {
    id: 'hospitality', name: 'Hotels, restaurants and bars', short: 'Hotels and bars', icon: 'glass',
    line: 'Mojito and Rosé mix into easy alcohol free menus.',
    points: ['Mocktail friendly flavours like Mojito and Rosé', 'Mixers for bars that want something new', 'Steady supply for busy weekends', 'Menu ideas from the HOLA team']
  },
  {
    id: 'events', name: 'Events and institutions', short: 'Events and schools', icon: 'calendar',
    line: 'Weddings, schools, offices and events, sorted in one order.',
    points: ['Volume orders planned around your date', 'A mix of flavours so every guest finds one', 'Delivery agreed ahead of the event', 'Quotes from the trade desk']
  }
];

MB.businessTypes = ['Distributor', 'Wholesaler', 'Supermarket or minimart', 'Shop or kiosk', 'Hotel, restaurant or bar', 'Events or institution', 'Export partner'];
MB.partnerToType = { distributor: 'Distributor', wholesaler: 'Wholesaler', supermarket: 'Supermarket or minimart', shop: 'Shop or kiosk', hospitality: 'Hotel, restaurant or bar', events: 'Events or institution' };

MB.volumes = ['Under 50 cases a month', '50 to 200 cases a month', '200 to 1,000 cases a month', 'Over 1,000 cases a month', 'Not sure yet'];

MB.counties = ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Murang’a', 'Nakuru', 'Mombasa', 'Kisumu', 'Uasin Gishu', 'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kakamega', 'Kericho', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Vihiga', 'Wajir', 'West Pokot', 'Outside Kenya'];

MB.faq = [
  { q: 'How do I open a trade account?', a: 'Send the distributor form on this page or call the trade line on 0715 537 575. Our trade team takes your details, then agrees area, volumes and pricing with you.' },
  { q: 'Which flavours can I order?', a: 'Cola, Orange, Mango Special, Sweet Limão, Mojito, Very Berry and Rosé, plus HOLA Energy in original, Red Berries and Green Peach & Lemongrass.' },
  { q: 'Do you deliver to my county?', a: 'We are growing the HOLA distribution network across Kenya. Tell us your county in the form and we will confirm coverage and the nearest distributor.' },
  { q: 'Can I get a price list?', a: 'Yes. Trade prices depend on your area and volumes, so the trade team sends the current list once they have your details.' },
  { q: 'Do you supply hotels and events?', a: 'Yes. Mojito and Rosé are popular for alcohol free menus. Share your dates and volumes and we will quote.' }
];

MB.img = function (path) { return (window.MB_ROOT || '../shared/') + 'img/' + path; };
MB.flavour = function (id) { return MB.flavours.find(function (f) { return f.id === id; }); };
