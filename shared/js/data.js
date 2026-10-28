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

/* Social links shown in headers, footers and the social sections. TikTok is left out until
   the client confirms their handle (the link supplied was TikTok's general About page). */
MB.socials = [
  { id: 'instagram', name: 'Instagram', handle: '@hola_beverages', label: 'HOLA on Instagram', href: MB.company.instagram },
  { id: 'facebook', name: 'Facebook', handle: 'HOLA Beverages', label: 'HOLA on Facebook', href: MB.company.facebook },
  { id: 'youtube', name: 'YouTube', handle: 'Our story on video', label: 'Watch the Maisha Beverages story on YouTube', href: MB.company.youtube }
];

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
  { id: 'energy', name: 'HOLA Energy', img: 'bottles/energy.webp', color: '#5A2E96',
    desc: 'The original. Dangerously tasty, extraordinarily revitalizing. We call it our Liquid Gold.' },
  { id: 'energy-red', name: 'Energy Red Berries', img: 'bottles/energy-red.webp', color: '#D9381F',
    desc: 'Deep and fruity. The fruity twist you’ll shake your hips to, with a touch of tropical swagger.' },
  { id: 'energy-green', name: 'Energy Green Peach & Lemongrass', img: 'bottles/energy-green.webp', color: '#4FA82A',
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
  { q: 'How does the order desk work?', a: 'Pick your flavours by the case, add your business details and choose a delivery day. The trade desk calls to confirm prices and stock before anything is loaded.' },
  { q: 'Is there a minimum order?', a: 'Minimums depend on your area and delivery route. The trade desk confirms yours on the first call, and you can mix any flavours to reach it.' },
  { q: 'How do I become a distributor?', a: 'Send the distributor form on this page or call the trade line on 0715 537 575. Our trade team takes your details, then agrees area, volumes and pricing with you.' },
  { q: 'Which flavours can I order?', a: 'Cola, Orange, Mango Special, Sweet Limão, Mojito, Very Berry and Rosé, plus HOLA Energy in original, Red Berries and Green Peach & Lemongrass.' },
  { q: 'Do you deliver to my county?', a: 'We are growing the HOLA distribution network across Kenya. Tell us your county and we will confirm coverage, the nearest distributor and your delivery day.' },
  { q: 'Can I get a price list?', a: 'Yes. Trade prices depend on your area and volumes, so the trade team sends the current list once they have your details.' },
  { q: 'Do you supply hotels and events?', a: 'Yes. Mojito, Rosé and Very Berry make easy alcohol free menus, and the recipes on this page are free to use. Share your dates and volumes and we will quote.' }
];

/* Full-bleed colours per flavour: bg for sections and cards, ink for text that sits on bg */
MB.tones = {
  cola: { bg: '#D7282F', ink: '#FFF4E6' },
  orange: { bg: '#F47A1F', ink: '#3F1203' },
  mango: { bg: '#F6A623', ink: '#3F1E00' },
  limao: { bg: '#F4D03A', ink: '#3D2B00' },
  mojito: { bg: '#74B843', ink: '#0E2D06' },
  berry: { bg: '#8C3BBA', ink: '#FFF4E6' },
  rose: { bg: '#F0699D', ink: '#4A0322' },
  energy: { bg: '#4B2F9C', ink: '#FFF4E6' },
  'energy-red': { bg: '#D93A22', ink: '#FFF4E6' },
  'energy-green': { bg: '#66B53A', ink: '#0E2D06' }
};

/* What the order desk sells: every flavour, by the case */
MB.skus = MB.flavours.map(function (f) {
  return { id: f.id, name: f.name, short: f.name, kind: f.kind, color: f.color, group: f.kind === 'Energy drink' ? 'energy' : 'soft' };
}).concat([
  { id: 'energy-red', name: 'Energy Red Berries', short: 'Energy Red', kind: 'Energy drink', color: '#D9381F', group: 'energy' },
  { id: 'energy-green', name: 'Energy Green Peach & Lemongrass', short: 'Energy Green', kind: 'Energy drink', color: '#4FA82A', group: 'energy' }
]);
MB.sku = function (id) { return MB.skus.find(function (s) { return s.id === id; }); };

MB.recipeTypes = [
  { id: 'food', name: 'With food', one: 'Food pairing' },
  { id: 'mocktail', name: 'Mocktails', one: 'Mocktail' },
  { id: 'cocktail', name: 'Cocktails', one: 'Cocktail' }
];

/* Pairings and mixes. Photos: Unsplash and Pexels (see CREDITS). */
MB.recipes = [
  {
    id: 'choma-cola', type: 'food', flavour: 'cola', img: 'recipes/choma.webp', name: 'Nyama choma with HOLA Cola',
    serves: 'Serves 4', time: '1 hour on the grill',
    intro: 'Goat or beef ribs, salted and slow grilled over charcoal, then chopped on the board with kachumbari. The caramel in an ice cold HOLA Cola meets the smoky char halfway.',
    need: ['1 kg goat or beef ribs', 'Coarse salt', '2 tomatoes, 1 red onion and 1 green chilli for kachumbari', 'A handful of dhania and 1 lemon', '4 bottles HOLA Cola, chilled'],
    steps: ['Salt the meat well and grill it slowly over medium charcoal, turning often, for about 50 minutes.', 'Dice the tomatoes, onion and chilli, then toss with chopped dhania and a squeeze of lemon.', 'Chop the meat into bite sized pieces on a board and serve it with the kachumbari.', 'Pour HOLA Cola straight from the fridge into glasses over ice.'],
    tip: 'Offer it as a choma combo: half a kilo with a cold HOLA Cola on one ticket.'
  },
  {
    id: 'chicken-mango', type: 'food', flavour: 'mango', img: 'recipes/chicken.webp', name: 'Pilipili BBQ chicken with Mango Special',
    serves: 'Serves 4', time: '40 minutes',
    intro: 'Chicken skewers brushed with chilli, garlic and lemon, grilled until charred at the edges. Mango Special brings ripe sweetness that cools the heat.',
    need: ['800 g chicken thighs, cubed', '2 tbsp oil and 2 cloves garlic, crushed', '1 red chilli, chopped, and the juice of 1 lemon', '1 red onion and 1 green pepper, in chunks', '4 bottles HOLA Mango Special, chilled'],
    steps: ['Mix the oil, garlic, chilli, lemon, salt and pepper, coat the chicken and leave it for 20 minutes.', 'Thread chicken, onion and pepper onto skewers.', 'Grill over hot charcoal for 12 to 15 minutes, turning, until cooked through.', 'Serve with HOLA Mango Special over ice.'],
    tip: 'Mango Special and Orange both suit spicy grills, so keep both cold for weekend crowds.'
  },
  {
    id: 'ugali-orange', type: 'food', flavour: 'orange', img: 'recipes/ugali-stew.webp', name: 'Ugali, sukuma and fried steak with HOLA Orange',
    credit: { by: 'Napendakukula', licence: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Fried_Steak,_Ugali_and_Sukuma_Wiki_(Embu).JPG' },
    serves: 'Serves 4', time: '40 minutes',
    intro: 'Kenya’s everyday favourite: firm ugali, sukuma wiki, sweet carrots and a pan fried steak. Bright HOLA Orange lifts the whole plate.',
    need: ['4 beef steaks', 'Salt, black pepper and 1 onion', '1 bunch sukuma wiki, finely sliced', '3 carrots, sliced', '2 cups maize flour and 4 cups water', '4 bottles HOLA Orange, chilled'],
    steps: ['Season the steaks and fry them in a hot pan with the onion, 4 to 5 minutes a side.', 'Fry the sukuma for 3 to 4 minutes so it stays green, and boil the carrots until just soft.', 'Boil the water, stir in the maize flour a little at a time and keep turning until the ugali is firm.', 'Plate it all together and pour HOLA Orange over ice.'],
    tip: 'A lunch special with a soft drink included is an easy sell, and Orange suits the whole family.'
  },
  {
    id: 'ugali-limao', type: 'food', flavour: 'limao', img: 'recipes/ugali-fish.webp', name: 'Ugali and fried tilapia with Sweet Limão',
    credit: { by: 'Napendakukula', licence: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Fried_Tilapia,_Ugali,_Sukuma_Wiki_and_Kachumbari_(From_Kisumu).JPG' },
    serves: 'Serves 2', time: '30 minutes',
    intro: 'Crispy fried tilapia with ugali and kachumbari, the lakeside classic. Sweet Limão works like a squeeze of lemon over the fish.',
    need: ['2 whole tilapia, cleaned', 'Salt, lemon and a pinch of chilli', 'Oil for frying', '1 cup maize flour and 2 cups water', '2 bottles HOLA Sweet Limão, chilled'],
    steps: ['Score the fish, rub it with salt, lemon and chilli, and rest it for 10 minutes.', 'Deep fry until golden and crisp, about 6 minutes a side.', 'Make firm ugali and serve it with the fish and kachumbari.', 'Pour Sweet Limão over plenty of ice.'],
    tip: 'Fish restaurants can list Sweet Limão and Mojito together as the citrus pair.'
  },
  {
    id: 'mojito-fresca', type: 'mocktail', flavour: 'mojito', img: 'recipes/mojito.webp', name: 'HOLA Mojito Fresca',
    serves: '1 glass', time: '3 minutes',
    intro: 'The quickest crowd pleaser on any bar menu. HOLA Mojito already brings the lime and mint, so you only add the fresh stuff.',
    need: ['1 bottle HOLA Mojito, chilled', '6 fresh mint leaves', '2 lime wedges', 'Crushed ice'],
    steps: ['Press the mint and lime gently in a tall glass to release the oils.', 'Fill the glass to the top with crushed ice.', 'Top up with HOLA Mojito and stir once.', 'Finish with a sprig of mint.'],
    tip: 'Prep the mint and lime before service and each glass takes under a minute.'
  },
  {
    id: 'rose-spritz', type: 'mocktail', flavour: 'rose', img: 'recipes/rose.webp', name: 'Rosé Sunset Spritz',
    serves: '1 glass', time: '3 minutes',
    intro: 'A pink, alcohol free spritz for weddings and brunches: HOLA Rosé and fresh orange in a big wine glass.',
    need: ['1 bottle HOLA Rosé, chilled', '50 ml fresh orange juice', '1 orange wheel', 'Ice cubes', 'A sprig of rosemary, if you have it'],
    steps: ['Fill a large wine glass with ice.', 'Add the orange juice.', 'Pour HOLA Rosé slowly down the side of the glass to keep the bubbles.', 'Finish with the orange wheel and rosemary.'],
    tip: 'Serve it as the welcome drink at events. It looks like a cocktail and suits every guest.'
  },
  {
    id: 'mango-chilli', type: 'mocktail', flavour: 'mango', img: 'recipes/mango.webp', name: 'Mango Chilli Cooler',
    serves: '1 glass', time: '4 minutes',
    intro: 'Inspired by street mango with pilipili and salt. Sweet, sour and a little hot.',
    need: ['1 bottle HOLA Mango Special, chilled', 'Juice of half a lime', 'Chilli powder and salt for the rim', 'Ice', 'A slice of mango'],
    steps: ['Mix a pinch of chilli powder with salt on a saucer.', 'Wet the rim of the glass with lime and dip it in the chilli salt.', 'Add ice, the lime juice and HOLA Mango Special.', 'Finish with the slice of mango.'],
    tip: 'The chilli rim gets people talking. Put it on the menu as your signature mocktail.'
  },
  {
    id: 'berry-punch', type: 'mocktail', flavour: 'berry', also: 'orange', img: 'recipes/punch.webp', name: 'Very Berry Party Punch',
    serves: 'Serves 12', time: '10 minutes',
    intro: 'One bowl, a dozen glasses. Very Berry and Orange with chopped fruit, made for parties, schools and events.',
    need: ['6 bottles HOLA Very Berry, chilled', '3 bottles HOLA Orange, chilled', '2 cups chopped fruit such as pineapple, watermelon and orange', '1 lime, sliced', 'Plenty of ice'],
    steps: ['Put the fruit and lime slices in a large punch bowl.', 'Add the ice just before guests arrive.', 'Pour in Very Berry and Orange and stir gently.', 'Ladle into glasses with a little fruit in each.'],
    tip: 'Order Very Berry and Orange together for events and the punch is covered.'
  },
  {
    id: 'limao-dawa', type: 'cocktail', flavour: 'limao', img: 'recipes/dawa.webp', name: 'Sweet Limão Dawa',
    serves: '1 glass', time: '4 minutes',
    intro: 'A twist on Kenya’s famous Dawa: lime, honey and vodka, lengthened with HOLA Sweet Limão.',
    need: ['50 ml vodka', '1 lime, cut in wedges', '1 tbsp honey', 'Crushed ice', 'HOLA Sweet Limão to top up'],
    steps: ['Muddle the lime wedges with the honey in a short glass.', 'Add crushed ice and the vodka.', 'Top up with HOLA Sweet Limão.', 'Serve with a honey stick to keep stirring.'],
    tip: 'Leave out the vodka and it becomes a Dawa mocktail for drivers.'
  },
  {
    id: 'cola-kick', type: 'cocktail', flavour: 'cola', img: 'recipes/cola.webp', name: 'HOLA Cola Kick',
    serves: '1 glass', time: '2 minutes',
    intro: 'Rum, fresh lime and HOLA Cola. Two ingredients and a wedge, easy to pour on a busy night.',
    need: ['50 ml dark or white rum', '2 lime wedges', 'Ice cubes', '1 bottle HOLA Cola, chilled'],
    steps: ['Fill a tall glass with ice.', 'Squeeze in one lime wedge and drop it in.', 'Add the rum and top up with HOLA Cola.', 'Stir once and add the second wedge.'],
    tip: 'Keep Cola as your house mixer and this one pours itself.'
  },
  {
    id: 'orange-sunrise', type: 'cocktail', flavour: 'orange', also: 'berry', img: 'recipes/sunrise.webp', name: 'Orange Sunrise',
    serves: '1 glass', time: '3 minutes',
    intro: 'Tequila and HOLA Orange with a slow sunset of Very Berry sinking through the glass.',
    need: ['40 ml tequila', '1 bottle HOLA Orange, chilled', '30 ml HOLA Very Berry', 'Ice', 'An orange slice'],
    steps: ['Fill a glass with ice and add the tequila.', 'Top up with HOLA Orange.', 'Pour the Very Berry slowly down the side so it sinks to the bottom.', 'Finish with the orange slice and serve without stirring.'],
    tip: 'Two HOLA flavours in one glass. It sells best at sundowner time.'
  },
  {
    id: 'berry-smash', type: 'cocktail', flavour: 'berry', img: 'recipes/berry-gin.webp', name: 'Very Berry Gin Smash',
    serves: '1 glass', time: '4 minutes',
    intro: 'Gin, crushed berries and HOLA Very Berry in a coupe. Deep, fruity and very easy to like.',
    need: ['40 ml gin', 'A handful of berries', 'Juice of half a lime', 'Ice', 'HOLA Very Berry to top up'],
    steps: ['Crush half the berries with the lime juice in a shaker or jug.', 'Add the gin and ice, then stir until cold.', 'Strain into a coupe and top up with HOLA Very Berry.', 'Finish with the rest of the berries on a pick.'],
    tip: 'Swap the gin for extra Very Berry and it works as a mocktail too.'
  }
];
MB.recipe = function (id) { return MB.recipes.find(function (r) { return r.id === id; }); };

MB.img = function (path) { return (window.MB_ROOT || '../shared/') + 'img/' + path; };
MB.flavour = function (id) { return MB.flavours.find(function (f) { return f.id === id; }); };
