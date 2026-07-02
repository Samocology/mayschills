export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Smoothies" | "Juices" | "Salads" | "Wraps" | "Detox Packs" | "Bundles";
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  description: string;
  shortDescription: string;
  rating: number;
  reviews: number;
  sold: number;
  badge?: "Best Seller" | "New" | "Popular" | "Vegan" | "20% Off" | "Bundle";
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  sizes?: { label: string; volume: string; price: number }[];
  toppings?: { label: string; price: number }[];
  ingredients?: { name: string; note: string; amount: string }[];
  nutrition?: { calories: number; fat: string; carbs: string; fibre: string; sugars: string; protein: string };
  dietary?: string[];
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

export const products: Product[] = [
  {
    id: "p1", slug: "mango-bliss-smoothie", name: "Mango Bliss Smoothie",
    category: "Smoothies", price: 2500, originalPrice: 3000,
    image: img("photo-1623065422902-30a2d299bbe4"),
    gallery: [img("photo-1623065422902-30a2d299bbe4"), img("photo-1546173159-315724a31696"), img("photo-1546039907-7fa05f864c02"), img("photo-1638176067000-9e2d4e74c4f8")],
    description: "A tropical escape in every sip. Creamy mango blended with ripe banana, coconut milk and supercharged with chia seeds. 100% natural, zero added sugar — just pure, delicious goodness.",
    shortDescription: "Mango, pineapple, coconut water, chia seeds — refreshing tropical blend",
    rating: 4.9, reviews: 243, sold: 890, badge: "Best Seller", stock: "In Stock",
    sizes: [
      { label: "Small", volume: "250ml", price: 1800 },
      { label: "Medium", volume: "400ml", price: 2500 },
      { label: "Large", volume: "600ml", price: 3400 },
      { label: "Family", volume: "1 Litre", price: 5200 },
    ],
    toppings: [
      { label: "Chia Seeds", price: 200 }, { label: "Granola", price: 300 }, { label: "Flaxseed", price: 250 },
      { label: "Protein Powder", price: 600 }, { label: "Honey Drizzle", price: 150 }, { label: "Coconut Flakes", price: 200 },
    ],
    ingredients: [
      { name: "Fresh Mango", note: "Packed with Vitamin C & antioxidants", amount: "150g" },
      { name: "Ripe Banana", note: "Natural sweetener, rich in potassium", amount: "80g" },
      { name: "Coconut Milk", note: "Healthy fats, creamy texture", amount: "120ml" },
      { name: "Chia Seeds", note: "Omega-3 fatty acids & fibre", amount: "10g" },
      { name: "Fresh Lime Juice", note: "Bright flavour, immune booster", amount: "15ml" },
    ],
    nutrition: { calories: 286, fat: "8.4g", carbs: "48g", fibre: "6.2g", sugars: "36g", protein: "4.8g" },
    dietary: ["Vegan", "Gluten-free", "No added sugar"],
  },
  {
    id: "p2", slug: "green-detox-juice", name: "Green Detox Juice", category: "Juices", price: 1500,
    image: img("photo-1610970881699-44a5587cabec"),
    description: "Spinach, cucumber, lemon, ginger — ultra-cleansing morning detox.",
    shortDescription: "Spinach, cucumber, lemon, ginger — ultra-cleansing morning detox",
    rating: 4.8, reviews: 198, sold: 287, badge: "New", stock: "In Stock",
    dietary: ["Vegan", "Gluten-free"],
  },
  {
    id: "p3", slug: "watermelon-breeze", name: "Watermelon Breeze", category: "Juices", price: 1200,
    image: img("photo-1571575173700-afb9492e6a50"),
    description: "Cold-pressed watermelon with fresh mint. Hydrating & light.",
    shortDescription: "Fresh watermelon, mint, lime — cooling and hydrating summer juice",
    rating: 5.0, reviews: 176, sold: 502, badge: "Popular", stock: "In Stock",
  },
  {
    id: "p4", slug: "caesar-power-salad", name: "Caesar Power Salad", category: "Salads", price: 2400,
    image: img("photo-1546069901-ba9599a7e63c"),
    description: "Grilled chicken, romaine, parmesan, house caesar dressing.",
    shortDescription: "Grilled chicken, romaine, parmesan, house caesar dressing",
    rating: 4.7, reviews: 124, sold: 198, stock: "Low Stock",
  },
  {
    id: "p5", slug: "avocado-chicken-wrap", name: "Avocado Chicken Wrap", category: "Wraps", price: 2100,
    image: img("photo-1626700051175-6818013e1d4f"),
    description: "Grilled chicken, smashed avocado, cherry tomatoes, whole grain wrap.",
    shortDescription: "Grilled chicken, smashed avocado, cherry tomatoes, whole grain wrap",
    rating: 4.6, reviews: 89, sold: 155, stock: "In Stock",
  },
  {
    id: "p6", slug: "strawberry-protein-shake", name: "Strawberry Protein Shake", category: "Smoothies", price: 2200,
    image: img("photo-1553530666-ba11a7da3888"),
    description: "Strawberry, banana, whey protein, almond milk, honey.",
    shortDescription: "Strawberry, banana, whey protein, almond milk, honey",
    rating: 4.9, reviews: 267, sold: 334, stock: "Out of Stock",
    dietary: ["High Protein"],
  },
  {
    id: "p7", slug: "watermelon-refresh", name: "Watermelon Refresh", category: "Juices", price: 1200,
    image: img("photo-1502741126161-b048400d085d"),
    description: "Fresh watermelon, mint, lime — cooling and hydrating summer juice.",
    shortDescription: "Fresh watermelon, mint, lime — cooling and hydrating summer juice",
    rating: 4.8, reviews: 132, sold: 502, badge: "Vegan", stock: "In Stock",
    dietary: ["Vegan"],
  },
  {
    id: "p8", slug: "quinoa-buddha-bowl", name: "Quinoa Buddha Bowl", category: "Salads", price: 2800,
    image: img("photo-1543339308-43e59d6b73a6"),
    description: "Roasted veggies, quinoa, chickpeas, avocado & tahini drizzle.",
    shortDescription: "Roasted veggies, quinoa, chickpeas, avocado & tahini drizzle",
    rating: 4.8, reviews: 143, sold: 144, stock: "In Stock",
    dietary: ["Vegan", "High Protein"],
  },
  {
    id: "p9", slug: "7-day-detox-bundle", name: "7-Day Detox Bundle", category: "Bundles", price: 18500,
    image: img("photo-1622597467836-f3285f2131b8"),
    description: "Full week plan: 3 smoothies + 2 juices + 2 salads daily, auto-delivered.",
    shortDescription: "A curated 7-day pack of our top detox drinks. Save 15% vs individual pricing.",
    rating: 5.0, reviews: 304, sold: 80, badge: "Bundle", stock: "In Stock",
  },
  {
    id: "p10", slug: "tropical-mango-blast", name: "Tropical Mango Blast", category: "Smoothies", price: 1800,
    image: img("photo-1546039907-7fa05f864c02"),
    description: "Mango, pineapple, coconut water & lime — pure tropical energy.",
    shortDescription: "Mango, pineapple, coconut water & lime — pure tropical energy",
    rating: 4.9, reviews: 214, sold: 412, badge: "Best Seller", stock: "In Stock",
    dietary: ["Vegan"],
  },
  {
    id: "p11", slug: "orange-carrot-ginger", name: "Orange Carrot Ginger", category: "Juices", price: 1200,
    image: img("photo-1622597467836-f3285f2131b8"),
    description: "Cold-pressed orange, carrot & ginger — immunity booster.",
    shortDescription: "Cold-pressed orange, carrot & ginger — immunity booster",
    rating: 4.8, reviews: 132, sold: 290, badge: "Vegan", stock: "In Stock",
    dietary: ["Vegan"],
  },
  {
    id: "p12", slug: "berry-boost-bowl", name: "Berry Boost Bowl", category: "Smoothies", price: 2600,
    image: img("photo-1490474418585-ba9bad8fd0ea"),
    description: "Mixed berries, granola, banana, almond milk — antioxidant bowl.",
    shortDescription: "Mixed berries, banana, granola, almond milk — antioxidant powerhouse",
    rating: 4.9, reviews: 102, sold: 220, stock: "In Stock",
  },
];

export const categories = [
  { name: "All Items", value: "all", count: products.length },
  { name: "Smoothies", value: "Smoothies", count: products.filter(p => p.category === "Smoothies").length },
  { name: "Juices", value: "Juices", count: products.filter(p => p.category === "Juices").length },
  { name: "Salads", value: "Salads", count: products.filter(p => p.category === "Salads").length },
  { name: "Wraps", value: "Wraps", count: products.filter(p => p.category === "Wraps").length },
  { name: "Detox Packs", value: "Bundles", count: products.filter(p => p.category === "Bundles").length },
];

export function getProduct(slug: string) {
  return products.find(p => p.slug === slug);
}

export function ngn(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}
