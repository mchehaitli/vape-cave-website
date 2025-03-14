export interface StoreLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  fullAddress: string;
  phone: string;
  hours: string;
  closedDays: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googlePlaceId?: string;
  appleMapsLink?: string;
  mapEmbed: string;
  email?: string;
  storeCode?: string;
  openingHours: {
    [key: string]: string;
  };
  // Enhanced fields for SEO
  services: string[];
  acceptedPayments: string[];
  areaServed: string[];
  publicTransit?: string;
  parking?: string;
  yearEstablished: number;
  priceRange: string;
  socialProfiles?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    yelp?: string;
  };
  description: string;
  neighborhoodInfo?: string;
  amenities: string[];
}

export const storeLocations: StoreLocation[] = [
  {
    id: 1,
    name: "Vape Cave Frisco",
    city: "Frisco",
    address: "9255 Preston Rd, Suite 100",
    fullAddress: "9255 Preston Rd, Suite 100, Frisco, TX 75033, United States",
    phone: "(469) 294-0061",
    hours: "10:00 AM - 12:00 AM / 1:00 AM (Extended hours on weekends)",
    closedDays: "",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 33.1754,
      lng: -96.8045
    },
    googlePlaceId: "ChIJxXjrR3wVkFQRcKK89i-aFDw",
    appleMapsLink: "https://maps.apple.com/?address=9255%20Preston%20Rd,%20Suite%20100,%20Frisco,%20TX%20%2075033,%20United%20States&ll=33.1754,-96.8045&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.7896675963246!2d-96.80701242377554!3d33.17540087322049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3c8b3a3b0fa9%3A0xfaee0099951b14ba!2s9255%20Preston%20Rd%20Suite%20100%2C%20Frisco%2C%20TX%2075033!5e0!3m2!1sen!2sus!4v1672321759407!5m2!1sen!2sus",
    email: "vapecavetex@gmail.com",
    storeCode: "VC-FRISCO",
    openingHours: {
      "Monday": "10:00 AM - 12:00 AM",
      "Tuesday": "10:00 AM - 12:00 AM",
      "Wednesday": "10:00 AM - 12:00 AM",
      "Thursday": "10:00 AM - 12:00 AM",
      "Friday": "10:00 AM - 1:00 AM",
      "Saturday": "10:00 AM - 1:00 AM",
      "Sunday": "10:00 AM - 12:00 AM"
    },
    // Enhanced fields
    services: [
      "Disposable Vapes",
      "Delta 8 Products",
      "THC-A Flower",
      "Delta 9 Edibles",
      "Pre-rolls",
      "Premium Flower",
      "Vape Pens",
      "Cartridges",
      "Accessories",
      "Glass Products"
    ],
    acceptedPayments: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Apple Pay",
      "Google Pay"
    ],
    areaServed: [
      "Frisco",
      "Allen",
      "Plano",
      "McKinney",
      "The Colony",
      "Little Elm",
      "Prosper",
      "Dallas",
      "North Texas"
    ],
    publicTransit: "DART Bus Stop within 0.2 miles",
    parking: "Free parking available in the shopping center",
    yearEstablished: 2019,
    priceRange: "$$",
    socialProfiles: {
      facebook: "https://facebook.com/vapecavefrisco",
      instagram: "https://instagram.com/vapecavefrisco",
      twitter: "https://twitter.com/vapecavefrisco",
      yelp: "https://yelp.com/biz/vape-cave-frisco"
    },
    description: "Our Frisco location offers a premium selection of vaping products, disposables, Delta 8, THC-A, Delta 9, and more. Our expert staff provides personalized recommendations in a welcoming environment with competitive prices and weekly specials.",
    neighborhoodInfo: "Located on Preston Road in Frisco, our store is just minutes from Stonebriar Mall and the Star in Frisco. Plenty of restaurants and shopping nearby.",
    amenities: [
      "Expert Staff",
      "Product Testing",
      "Weekly Specials",
      "Rewards Program",
      "Military Discount",
      "Student Discount",
      "Free Parking",
      "ADA Accessible"
    ]
  },
  {
    id: 2,
    name: "Vape Cave Arlington",
    city: "Arlington",
    address: "1707 E Lamar Blvd, Suite 130",
    fullAddress: "1707 E Lamar Blvd, Suite 130, Arlington, TX 76006, United States",
    phone: "(682) 270-0334",
    hours: "10:00 AM - 11:00 PM",
    closedDays: "",
    image: "https://images.unsplash.com/photo-1556740772-1a741367b93e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 32.7606,
      lng: -97.0753
    },
    googlePlaceId: "ChIJ23422NdJSYYRVX94pdZlUGg", 
    appleMapsLink: "https://maps.apple.com/?address=1707%20E%20Lamar%20Blvd,%20Suite%20130,%20Arlington,%20TX%20%2076006,%20United%20States&ll=32.7606,-97.0753&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.8741432881703!2d-97.07786282378937!3d32.76060198068339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e7d51e39fbfa5%3A0x8a1da20e66df8aa!2s1707%20E%20Lamar%20Blvd%20%23130%2C%20Arlington%2C%20TX%2076006!5e0!3m2!1sen!2sus!4v1672321865030!5m2!1sen!2sus",
    email: "vapecavetx@gmail.com",
    storeCode: "VC-ARLINGTON",
    openingHours: {
      "Monday": "10:00 AM - 11:00 PM",
      "Tuesday": "10:00 AM - 11:00 PM",
      "Wednesday": "10:00 AM - 11:00 PM",
      "Thursday": "10:00 AM - 11:00 PM",
      "Friday": "10:00 AM - 11:00 PM",
      "Saturday": "10:00 AM - 11:00 PM",
      "Sunday": "10:00 AM - 11:00 PM"
    },
    // Enhanced fields
    services: [
      "Disposable Vapes",
      "Delta 8 Products",
      "THC-A Flower",
      "Delta 9 Edibles",
      "Pre-rolls",
      "CBD Products",
      "Kratom",
      "Glass Products",
      "Vape Accessories",
      "Smoking Accessories"
    ],
    acceptedPayments: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Samsung Pay",
      "Apple Pay"
    ],
    areaServed: [
      "Arlington",
      "Grand Prairie",
      "Mansfield",
      "Fort Worth",
      "Dallas",
      "Irving",
      "Hurst",
      "Euless",
      "Bedford",
      "North Texas"
    ],
    publicTransit: "Arlington Via Rideshare pickup available nearby",
    parking: "Ample free parking in shopping center lot",
    yearEstablished: 2021,
    priceRange: "$$",
    socialProfiles: {
      facebook: "https://facebook.com/vapecavearlington",
      instagram: "https://instagram.com/vapecavearlington",
      twitter: "https://twitter.com/vapecavearlington",
      yelp: "https://yelp.com/biz/vape-cave-arlington"
    },
    description: "Our Arlington location features the largest selection of disposable vapes, Delta 8, THC-A, and Delta 9 products in the area. We pride ourselves on excellent customer service, product knowledge, and competitive pricing to ensure you find exactly what you're looking for.",
    neighborhoodInfo: "Conveniently located on E Lamar Blvd, just minutes from AT&T Stadium and Globe Life Field. Close to many restaurants and entertainment options.",
    amenities: [
      "Expert Staff",
      "Product Demonstrations",
      "Loyalty Program",
      "Military Discount",
      "First Responder Discount",
      "Educational Materials",
      "Free Parking",
      "ADA Accessible"
    ]
  }
];

// Helper function to get a location by ID
export const getLocationById = (id: number): StoreLocation | undefined => {
  return storeLocations.find(location => location.id === id);
};

// Helper function to get a location by city name
export const getLocationByCity = (city: string): StoreLocation | undefined => {
  return storeLocations.find(location => 
    location.city.toLowerCase() === city.toLowerCase()
  );
};

// Helper function to get formatted locations for Google Maps
export const getFormattedLocationsForMap = () => {
  return storeLocations.map(loc => ({
    id: loc.id,
    name: loc.name,
    address: loc.fullAddress,
    position: loc.coordinates
  }));
};