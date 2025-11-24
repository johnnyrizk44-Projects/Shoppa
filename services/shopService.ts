import { Product, RetailerName, ProductCategory, NutritionPer100, PricePoint } from '../types';

// --- Health Calculation Logic (MVP) ---
export const calculateHealthRating = (n: NutritionPer100): number => {
  // Baseline start
  let score = 3.0;

  // Penalties
  if (n.sugarg > 40) score -= 1.5;
  else if (n.sugarg > 22) score -= 1.0;
  else if (n.sugarg > 10) score -= 0.5;

  if (n.saturatedFatg > 5) score -= 1.0;
  else if (n.saturatedFatg > 2) score -= 0.5;

  if (n.sodiummg > 800) score -= 1.0;
  else if (n.sodiummg > 400) score -= 0.5;

  // Bonuses
  if (n.fiberg > 6) score += 1.0;
  else if (n.fiberg > 3) score += 0.5;

  if (n.proteing > 10) score += 1.0;
  else if (n.proteing > 5) score += 0.5;

  // Clamp
  return Math.min(5, Math.max(0.5, score));
};

export const getHealthLabel = (rating: number): string => {
  if (rating >= 4.5) return "Excellent Choice";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 2.5) return "Okay in Moderation";
  if (rating >= 1.5) return "Not So Good";
  return "Treat Only";
};

// --- Real-World Australian Mock Data ---

const AUSTRALIAN_PRODUCTS: Product[] = [
  // --- SOFT DRINKS ---
  {
    id: 'sd_1',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    size: '1.25L',
    category: ProductCategory.SOFT_DRINKS,
    image: 'https://placehold.co/300x300/DD2C00/FFF?text=Coke+Classic',
    description: "The classic cola taste that has been refreshing the world since 1886.",
    nutrition: { energykJ: 180, sugarg: 10.6, saturatedFatg: 0, sodiummg: 10, proteing: 0, fiberg: 0 },
    prices: [
      { retailer: RetailerName.COLES, price: 2.85, unitPriceStr: "$2.28/L", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 3.15, unitPriceStr: "$2.52/L", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' },
      { retailer: RetailerName.IGA, price: 3.50, unitPriceStr: "$2.80/L", inStock: true, storeDistanceKm: 0.2, lastUpdated: '1hr ago' }
    ]
  },
  {
    id: 'sd_2',
    name: 'Pepsi Max',
    brand: 'Pepsi',
    size: '1.25L',
    category: ProductCategory.SOFT_DRINKS,
    image: 'https://placehold.co/300x300/000000/FFF?text=Pepsi+Max',
    description: "Maximum taste, no sugar. The low calorie cola.",
    nutrition: { energykJ: 2, sugarg: 0, saturatedFatg: 0, sodiummg: 12, proteing: 0.1, fiberg: 0 },
    prices: [
      { retailer: RetailerName.COLES, price: 2.20, unitPriceStr: "$1.76/L", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Special' },
      { retailer: RetailerName.WOOLWORTHS, price: 2.20, unitPriceStr: "$1.76/L", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Special' }
    ]
  },
  {
    id: 'sd_3',
    name: 'Solo Original Lemon',
    brand: 'Schweppes',
    size: '1.25L',
    category: ProductCategory.SOFT_DRINKS,
    image: 'https://placehold.co/300x300/FBC02D/000?text=Solo+Lemon',
    description: "The original lemon squash. Thirst crushing refreshment.",
    nutrition: { energykJ: 200, sugarg: 11.5, saturatedFatg: 0, sodiummg: 8, proteing: 0, fiberg: 0 },
    prices: [
      { retailer: RetailerName.WOOLWORTHS, price: 2.60, unitPriceStr: "$2.08/L", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'sd_4',
    name: 'Sprite',
    brand: 'Coca-Cola',
    size: '1.25L',
    category: ProductCategory.SOFT_DRINKS,
    image: 'https://placehold.co/300x300/00796B/FFF?text=Sprite',
    description: "Lemon-lime flavoured soft drink. Crisp and clean taste.",
    nutrition: { energykJ: 140, sugarg: 8.0, saturatedFatg: 0, sodiummg: 9, proteing: 0, fiberg: 0 },
    prices: [
       { retailer: RetailerName.COLES, price: 2.85, unitPriceStr: "$2.28/L", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' }
    ]
  },

  // --- DAIRY ---
  {
    id: 'da_1',
    name: 'Full Cream Milk',
    brand: 'Dairy Farmers',
    size: '2L',
    category: ProductCategory.DAIRY,
    image: 'https://placehold.co/300x300/1976D2/FFF?text=Full+Cream+Milk',
    description: "Rich and creamy milk from Australian farms.",
    nutrition: { energykJ: 265, sugarg: 4.8, saturatedFatg: 2.3, sodiummg: 45, proteing: 3.3, fiberg: 0 },
    prices: [
      { retailer: RetailerName.COLES, price: 3.10, unitPriceStr: "$1.55/L", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 3.10, unitPriceStr: "$1.55/L", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' },
      { retailer: RetailerName.ALDI, price: 3.09, unitPriceStr: "$1.54/L", inStock: true, storeDistanceKm: 2.5, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'da_2',
    name: 'Bega Tasty Cheese Block',
    brand: 'Bega',
    size: '500g',
    category: ProductCategory.DAIRY,
    image: 'https://placehold.co/300x300/FFA000/FFF?text=Bega+Cheese',
    description: "A mild, tasty cheddar cheese perfect for sandwiches.",
    nutrition: { energykJ: 1700, sugarg: 1.0, saturatedFatg: 21.0, sodiummg: 720, proteing: 25.0, fiberg: 0 },
    prices: [
      { retailer: RetailerName.COLES, price: 9.50, unitPriceStr: "$19.00/kg", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 8.00, unitPriceStr: "$16.00/kg", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Special' }
    ]
  },
  {
    id: 'da_3',
    name: 'Greek Yogurt Plain',
    brand: 'Chobani',
    size: '907g',
    category: ProductCategory.DAIRY,
    image: 'https://placehold.co/300x300/EEEEEE/000?text=Chobani+Yogurt',
    description: "Thick and creamy strained greek yogurt. High protein.",
    nutrition: { energykJ: 245, sugarg: 2.8, saturatedFatg: 0, sodiummg: 35, proteing: 9.7, fiberg: 0 },
    prices: [
      { retailer: RetailerName.WOOLWORTHS, price: 7.50, unitPriceStr: "$0.83/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'da_4',
    name: 'Soy Milk Original',
    brand: 'Vitasoy',
    size: '1L',
    category: ProductCategory.DAIRY,
    image: 'https://placehold.co/300x300/8D6E63/FFF?text=Soy+Milk',
    description: "Made from whole Australian soybeans. High in calcium.",
    nutrition: { energykJ: 220, sugarg: 1.5, saturatedFatg: 0.4, sodiummg: 45, proteing: 3.0, fiberg: 0.5 },
    prices: [
      { retailer: RetailerName.COLES, price: 2.80, unitPriceStr: "$2.80/L", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' }
    ]
  },

  // --- CEREAL ---
  {
    id: 'ce_1',
    name: 'Weet-Bix',
    brand: 'Sanitarium',
    size: '1.2kg',
    category: ProductCategory.CEREAL,
    image: 'https://placehold.co/300x300/1565C0/FFF?text=Weet-Bix',
    description: "Australia's favorite breakfast cereal. 97% wholegrain.",
    nutrition: { energykJ: 1490, sugarg: 3.3, saturatedFatg: 0.3, sodiummg: 270, proteing: 12.4, fiberg: 11 },
    prices: [
      { retailer: RetailerName.COLES, price: 5.00, unitPriceStr: "$0.42/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Half Price' },
      { retailer: RetailerName.WOOLWORTHS, price: 9.00, unitPriceStr: "$0.75/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'ce_2',
    name: 'Nutri-Grain',
    brand: 'Kelloggs',
    size: '290g',
    category: ProductCategory.CEREAL,
    image: 'https://placehold.co/300x300/FFD600/000?text=Nutri-Grain',
    description: "Iron man food. Corn, oats and wheat cereal.",
    nutrition: { energykJ: 1620, sugarg: 26.7, saturatedFatg: 0.2, sodiummg: 380, proteing: 21.8, fiberg: 2.7 },
    prices: [
      { retailer: RetailerName.COLES, price: 6.70, unitPriceStr: "$2.31/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'ce_3',
    name: 'Corn Flakes',
    brand: 'Kelloggs',
    size: '725g',
    category: ProductCategory.CEREAL,
    image: 'https://placehold.co/300x300/388E3C/FFF?text=Corn+Flakes',
    description: "Crispy golden flakes of corn.",
    nutrition: { energykJ: 1600, sugarg: 9.0, saturatedFatg: 0.1, sodiummg: 400, proteing: 7.0, fiberg: 2.0 },
    prices: [
       { retailer: RetailerName.WOOLWORTHS, price: 7.20, unitPriceStr: "$0.99/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },

  // --- PANTRY ---
  {
    id: 'pa_1',
    name: 'Tomato Sauce',
    brand: 'Heinz',
    size: '500ml',
    category: ProductCategory.PANTRY,
    image: 'https://placehold.co/300x300/D32F2F/FFF?text=Heinz+Ketchup',
    description: "Classic tomato ketchup. No preservatives.",
    nutrition: { energykJ: 480, sugarg: 25.4, saturatedFatg: 0.1, sodiummg: 950, proteing: 1.2, fiberg: 0.5 },
    prices: [
      { retailer: RetailerName.IGA, price: 4.20, unitPriceStr: "$0.84/100ml", inStock: true, storeDistanceKm: 0.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 3.50, unitPriceStr: "$0.70/100ml", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'pa_2',
    name: 'Vegemite',
    brand: 'Bega',
    size: '380g',
    category: ProductCategory.PANTRY,
    image: 'https://placehold.co/300x300/FFEB3B/000?text=Vegemite',
    description: "Concentrated yeast extract. Tastes like Australia.",
    nutrition: { energykJ: 765, sugarg: 1.0, saturatedFatg: 0.1, sodiummg: 3300, proteing: 25.0, fiberg: 8.0 },
    prices: [
      { retailer: RetailerName.COLES, price: 7.00, unitPriceStr: "$1.84/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'pa_3',
    name: 'Spaghetti Pasta',
    brand: 'San Remo',
    size: '500g',
    category: ProductCategory.PANTRY,
    image: 'https://placehold.co/300x300/BCAAA4/FFF?text=Spaghetti',
    description: "100% Durum wheat pasta. No artificial colours or flavours.",
    nutrition: { energykJ: 1530, sugarg: 1.5, saturatedFatg: 0.5, sodiummg: 15, proteing: 12.0, fiberg: 3.0 },
    prices: [
      { retailer: RetailerName.COLES, price: 2.95, unitPriceStr: "$0.59/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 1.95, unitPriceStr: "$0.39/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Special' }
    ]
  },
  {
    id: 'pa_4',
    name: 'Tuna in Springwater',
    brand: 'John West',
    size: '95g',
    category: ProductCategory.PANTRY,
    image: 'https://placehold.co/300x300/4FC3F7/000?text=Tuna+Can',
    description: "Skipjack tuna chunks in springwater.",
    nutrition: { energykJ: 430, sugarg: 0, saturatedFatg: 0.2, sodiummg: 280, proteing: 25.0, fiberg: 0 },
    prices: [
      { retailer: RetailerName.COLES, price: 2.30, unitPriceStr: "$24.21/kg", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.ALDI, price: 0.99, unitPriceStr: "$10.42/kg", inStock: true, storeDistanceKm: 2.5, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'pa_5',
    name: 'Baked Beans',
    brand: 'Heinz',
    size: '300g',
    category: ProductCategory.PANTRY,
    image: 'https://placehold.co/300x300/00838F/FFF?text=Baked+Beans',
    description: "Baked beans in rich tomato sauce. High in fibre.",
    nutrition: { energykJ: 350, sugarg: 4.8, saturatedFatg: 0.1, sodiummg: 380, proteing: 4.5, fiberg: 5.0 },
    prices: [
       { retailer: RetailerName.WOOLWORTHS, price: 2.00, unitPriceStr: "$0.67/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },

  // --- SNACKS ---
  {
    id: 'sn_1',
    name: 'Original Chips',
    brand: 'Smiths',
    size: '170g',
    category: ProductCategory.SNACKS,
    image: 'https://placehold.co/300x300/1E88E5/FFF?text=Smiths+Original',
    description: "Crinkle cut potato chips with sea salt.",
    nutrition: { energykJ: 2260, sugarg: 0.5, saturatedFatg: 2.4, sodiummg: 486, proteing: 6.6, fiberg: 3.5 },
    prices: [
      { retailer: RetailerName.COLES, price: 4.80, unitPriceStr: "$2.82/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 2.40, unitPriceStr: "$1.41/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Half Price' }
    ]
  },
  {
    id: 'sn_2',
    name: 'Tim Tam Original',
    brand: 'Arnotts',
    size: '200g',
    category: ProductCategory.SNACKS,
    image: 'https://placehold.co/300x300/5D4037/FFF?text=Tim+Tams',
    description: "The most irresistible chocolate biscuit.",
    nutrition: { energykJ: 2200, sugarg: 49.2, saturatedFatg: 14.5, sodiummg: 180, proteing: 4.5, fiberg: 1.2 },
    prices: [
      { retailer: RetailerName.COLES, price: 4.50, unitPriceStr: "$2.25/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.WOOLWORTHS, price: 3.50, unitPriceStr: "$1.75/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Special' }
    ]
  },
  {
    id: 'sn_3',
    name: 'Dairy Milk Chocolate',
    brand: 'Cadbury',
    size: '180g',
    category: ProductCategory.SNACKS,
    image: 'https://placehold.co/300x300/7B1FA2/FFF?text=Dairy+Milk',
    description: "Classic milk chocolate block. A glass and a half of milk.",
    nutrition: { energykJ: 2240, sugarg: 56.0, saturatedFatg: 19.0, sodiummg: 85, proteing: 7.4, fiberg: 0.8 },
    prices: [
      { retailer: RetailerName.COLES, price: 6.00, unitPriceStr: "$3.33/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' },
      { retailer: RetailerName.ALDI, price: 5.50, unitPriceStr: "$3.05/100g", inStock: true, storeDistanceKm: 2.5, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'sn_4',
    name: 'Shapes Pizza',
    brand: 'Arnotts',
    size: '190g',
    category: ProductCategory.SNACKS,
    image: 'https://placehold.co/300x300/D32F2F/FFF?text=Shapes+Pizza',
    description: "Oven baked savoury biscuits with pizza flavour.",
    nutrition: { energykJ: 2050, sugarg: 2.1, saturatedFatg: 4.5, sodiummg: 800, proteing: 7.6, fiberg: 3.0 },
    prices: [
      { retailer: RetailerName.WOOLWORTHS, price: 3.50, unitPriceStr: "$1.84/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  },

  // --- READY MEALS ---
  {
    id: 'rm_1',
    name: 'Butter Chicken',
    brand: 'Youfoodz',
    size: '350g',
    category: ProductCategory.READY_MEALS,
    image: 'https://placehold.co/300x300/F57C00/FFF?text=Butter+Chicken',
    description: "Tender chicken in a creamy tomato sauce with rice.",
    nutrition: { energykJ: 600, sugarg: 3.5, saturatedFatg: 4.2, sodiummg: 350, proteing: 9.0, fiberg: 1.5 },
    prices: [
      { retailer: RetailerName.COLES, price: 9.95, unitPriceStr: "$2.84/100g", inStock: true, storeDistanceKm: 1.2, lastUpdated: 'Now' }
    ]
  },
  {
    id: 'rm_2',
    name: 'Beef Lasagne',
    brand: 'McCain',
    size: '400g',
    category: ProductCategory.READY_MEALS,
    image: 'https://placehold.co/300x300/8E24AA/FFF?text=Lasagne',
    description: "Classic beef lasagne with rich bolognese sauce.",
    nutrition: { energykJ: 550, sugarg: 3.0, saturatedFatg: 3.5, sodiummg: 400, proteing: 8.0, fiberg: 2.0 },
    prices: [
       { retailer: RetailerName.WOOLWORTHS, price: 6.00, unitPriceStr: "$1.50/100g", inStock: true, storeDistanceKm: 0.8, lastUpdated: 'Now' }
    ]
  }
];

// --- Service Methods ---

export const getProducts = async (): Promise<Product[]> => {
  // Shorter latency for better UX
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return AUSTRALIAN_PRODUCTS.map(p => ({
    ...p,
    healthStarRating: calculateHealthRating(p.nutrition)
  }));
};

// Allow searching both existing and potentially AI-added products (in a real app this would be a DB query)
export const getProductById = async (id: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  // Check standard mock products
  let product = AUSTRALIAN_PRODUCTS.find(p => p.id === id);
  
  // If not found, we check if it was cached in session storage (from AI generation)
  if (!product) {
    try {
      const cached = sessionStorage.getItem(`ai_product_${id}`);
      if (cached) {
        product = JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Failed to retrieve AI product", e);
    }
  }

  if (product) {
    return {
      ...product,
      healthStarRating: calculateHealthRating(product.nutrition)
    };
  }
  return undefined;
};

export const getCheapestPrice = (product: Product): PricePoint | undefined => {
  if (!product.prices || product.prices.length === 0) return undefined;
  return product.prices.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
};

// Helper to generate mock prices for AI generated products
export const generateMockPrices = (): PricePoint[] => {
  const retailers = [RetailerName.COLES, RetailerName.WOOLWORTHS, RetailerName.IGA, RetailerName.ALDI];
  const basePrice = (Math.random() * 5) + 2; // Random base price between $2 and $7

  return retailers
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 3) // Take 3 random retailers
    .map(retailer => {
      const variance = (Math.random() * 1) - 0.5; // +/- $0.50
      const finalPrice = Math.max(1.5, Number((basePrice + variance).toFixed(2)));
      return {
        retailer,
        price: finalPrice,
        unitPriceStr: `$${(finalPrice / 2.5).toFixed(2)}/100g`, // Mock unit price
        inStock: Math.random() > 0.1,
        storeDistanceKm: Number((Math.random() * 5).toFixed(1)),
        lastUpdated: 'Just now'
      };
    });
};