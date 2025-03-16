export interface Brand {
  name: string;
  image: string;
  description: string;
}

export interface BrandCategory {
  category: string;
  brands: Brand[];
  bgClass?: string;
}

// Using placeholder for all brands until real brand images are available
const placeholderImage = "/brand-logos/placeholder.svg";
export const featuredBrands: BrandCategory[] = [
  {
    category: "Disposables Nicotine",
    bgClass: "bg-gradient-to-br from-gray-900 to-gray-800",
    brands: [
      {
        name: "Elf Bar",
        image: placeholderImage,
        description: "Premium rechargeable disposables with long-lasting flavor"
      },
      {
        name: "Lost Mary",
        image: placeholderImage,
        description: "High-quality rechargeable disposables with unique flavors"
      },
      {
        name: "Hyde",
        image: placeholderImage,
        description: "Innovative disposables with vibrant flavor profiles"
      },
      {
        name: "Fume",
        image: placeholderImage,
        description: "Ultra-convenient disposables with exceptional taste"
      }
    ]
  },
  {
    category: "Delta",
    bgClass: "bg-gradient-to-br from-gray-900 to-indigo-900/40",
    brands: [
      {
        name: "Delta 8",
        image: placeholderImage,
        description: "Premium Delta 8 products with verified potency"
      },
      {
        name: "Delta 10",
        image: placeholderImage,
        description: "High-quality Delta 10 with consistent effects"
      },
      {
        name: "THC-A",
        image: placeholderImage,
        description: "Premium THC-A flower and concentrates"
      },
      {
        name: "HHC",
        image: placeholderImage,
        description: "Innovative HHC products with superior quality"
      }
    ]
  },
  {
    category: "E-Liquid/Salts",
    bgClass: "bg-gradient-to-br from-gray-900 to-blue-900/40",
    brands: [
      {
        name: "Naked 100",
        image: placeholderImage,
        description: "Premium fruit-flavored e-liquids with smooth taste"
      },
      {
        name: "Pachamama",
        image: placeholderImage,
        description: "Exotic fruit-blend e-juices with bold flavors"
      },
      {
        name: "Twist",
        image: placeholderImage,
        description: "Refreshing beverage-inspired e-liquids"
      },
      {
        name: "Salt Bae",
        image: placeholderImage,
        description: "High-quality nicotine salt e-juices"
      }
    ]
  },
  {
    category: "Vaporizer Devices",
    bgClass: "bg-gradient-to-br from-gray-900 to-purple-900/40",
    brands: [
      {
        name: "GeekVape",
        image: placeholderImage,
        description: "Durable, high-performance vaping devices"
      },
      {
        name: "SMOK",
        image: placeholderImage,
        description: "Innovative vape mods with cutting-edge technology"
      },
      {
        name: "Uwell Caliburn",
        image: placeholderImage,
        description: "User-friendly pod systems with excellent flavor"
      },
      {
        name: "Vaporesso",
        image: placeholderImage,
        description: "Stylish devices with advanced vaping technology"
      }
    ]
  },
  {
    category: "Hookah/Shisha",
    bgClass: "bg-gradient-to-br from-gray-900 to-pink-900/40",
    brands: [
      {
        name: "Starbuzz",
        image: placeholderImage,
        description: "Premium hookah tobacco with rich flavors"
      },
      {
        name: "Al Fakher",
        image: placeholderImage,
        description: "Traditional hookah tobacco with authentic taste"
      },
      {
        name: "Fumari",
        image: placeholderImage,
        description: "Gourmet hookah flavors with excellent cloud production"
      },
      {
        name: "Azure",
        image: placeholderImage,
        description: "Modern hookah tobacco with innovative blends"
      }
    ]
  },
  {
    category: "Glass",
    bgClass: "bg-gradient-to-br from-gray-900 to-green-900/40",
    brands: [
      {
        name: "Grav Labs",
        image: placeholderImage,
        description: "Scientific-grade glass with modern designs"
      },
      {
        name: "Puffco",
        image: placeholderImage,
        description: "Premium electronic dab rigs and vaporizers"
      },
      {
        name: "Raw Glass",
        image: placeholderImage,
        description: "Authentic glass accessories with natural aesthetics"
      },
      {
        name: "Lookah",
        image: placeholderImage,
        description: "Innovative glass pieces with advanced features"
      }
    ]
  }
];