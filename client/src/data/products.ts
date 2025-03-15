export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  featuredLabel?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Vape Device",
    description: "Advanced temperature control with long battery life and premium build quality.",
    price: 69.99,
    image: "/vapecave-logo.png",
    category: "devices",
    featured: true,
    featuredLabel: "Featured"
  },
  {
    id: 2,
    name: "Fruit Fusion E-Liquid",
    description: "A refreshing blend of tropical fruits with notes of mango and pineapple.",
    price: 24.99,
    image: "/vapecave-logo.png",
    category: "e-liquids",
    featured: true,
    featuredLabel: "Best Seller"
  },
  {
    id: 3,
    name: "Replacement Coil Pack",
    description: "High-quality replacement coils compatible with most popular devices.",
    price: 19.99,
    image: "/vapecave-logo.png",
    category: "accessories"
  },
  {
    id: 4,
    name: "Compact Vape Pen",
    description: "Sleek, portable design perfect for on-the-go vaping with quick USB charging.",
    price: 34.99,
    image: "/vapecave-logo.png",
    category: "devices",
    featured: true,
    featuredLabel: "New Arrival"
  },
  {
    id: 5,
    name: "Menthol Ice E-Liquid",
    description: "Refreshing menthol flavor with a cool, icy finish. Perfect for mint lovers.",
    price: 22.99,
    image: "/vapecave-logo.png",
    category: "e-liquids"
  },
  {
    id: 6,
    name: "Vape Carrying Case",
    description: "Protective carrying case with dedicated compartments for your device and accessories.",
    price: 29.99,
    image: "/vapecave-logo.png",
    category: "accessories",
    featured: true,
    featuredLabel: "Popular"
  },
  {
    id: 7,
    name: "Advanced Box Mod",
    description: "High-powered box mod with customizable settings and temperature control.",
    price: 89.99,
    image: "/vapecave-logo.png",
    category: "devices"
  },
  {
    id: 8,
    name: "Vanilla Custard E-Liquid",
    description: "Rich, creamy vanilla custard flavor with a smooth exhale.",
    price: 24.99,
    image: "/vapecave-logo.png",
    category: "e-liquids"
  },
  {
    id: 9,
    name: "Battery Charger",
    description: "Fast charging external battery charger for vape batteries.",
    price: 15.99,
    image: "/vapecave-logo.png",
    category: "accessories"
  },
  {
    id: 10,
    name: "Pod System Kit",
    description: "Compact pod system with auto-draw activation and refillable pods.",
    price: 39.99,
    image: "/vapecave-logo.png",
    category: "devices"
  },
  {
    id: 11,
    name: "Strawberry Milkshake E-Liquid",
    description: "Sweet strawberry milkshake flavor with creamy undertones.",
    price: 23.99,
    image: "/vapecave-logo.png",
    category: "e-liquids"
  },
  {
    id: 12,
    name: "Cotton Wick Pack",
    description: "Premium Japanese cotton for optimal flavor and wicking performance.",
    price: 8.99,
    image: "/vapecave-logo.png",
    category: "accessories"
  }
];
