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
  plusCode?: string;
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
    address: "6958 Main St #200",
    fullAddress: "6958 Main St #200, Frisco, TX 75033, United States",
    phone: "(469) 294-0061",
    hours: "10:00 AM - 12:00 AM / 1:00 AM (Extended hours on weekends)",
    closedDays: "",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 33.150730,
      lng: -96.822550
    },
    googlePlaceId: "ChIJxXjrR3wVkFQRcKK89i-aFDw",
    plusCode: "552G+86 Frisco, Texas",
    appleMapsLink: "https://maps.apple.com/?address=6958%20Main%20St%20%23200,%20Frisco,%20TX%20%2075033,%20United%20States&ll=33.150730,-96.822550&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.8753075683534!2d-96.8250386843087!3d33.15073000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3c9e26f9a2d7%3A0x8b26bf31c77df48b!2s6958%20Main%20St%20%23200%2C%20Frisco%2C%20TX%2075033!5e0!3m2!1sen!2sus!4v1693311756407!5m2!1sen!2sus",
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
    neighborhoodInfo: "Located on Main Street in downtown Frisco, our store is just minutes from Frisco Square and the Rail District. Plenty of restaurants and shopping nearby.",
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
    address: "4100 S Cooper St #4108",
    fullAddress: "4100 S Cooper St #4108, Arlington, TX 76015, United States",
    phone: "(682) 270-0334",
    hours: "10:00 AM - 11:00 PM",
    closedDays: "",
    image: "https://images.unsplash.com/photo-1556740772-1a741367b93e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 32.687070,
      lng: -97.134800
    },
    googlePlaceId: "ChIJ23422NdJSYYRVX94pdZlUGg", 
    plusCode: "552G+86 Frisco, Texas", // Note: This appears to be the same as Frisco - may need verification
    appleMapsLink: "https://maps.apple.com/?address=4100%20S%20Cooper%20St%20%234108,%20Arlington,%20TX%20%2076015,%20United%20States&ll=32.687070,-97.134800&q=Vape%20Cave%20Smoke%20%26%20Stuff&t=m",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3357.926302595539!2d-97.13739482379145!3d32.68707018061235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e6377a56ba2c1%3A0x63d3de7c2a26fd3d!2s4100%20S%20Cooper%20St%20%234108%2C%20Arlington%2C%20TX%2076015!5e0!3m2!1sen!2sus!4v1672321865030!5m2!1sen!2sus",
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
    neighborhoodInfo: "Conveniently located on S Cooper St, near The Parks Mall at Arlington. Close to many restaurants, entertainment, and shopping options.",
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