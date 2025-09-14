
export type Product = {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  description: string;
  imageUrl: string;
  imageHint: string;
  availability: boolean;
};

export const categories = [
  'Electronics',
  'Outdoor Gear',
  'Party Supplies',
  'Tools',
];

export let products: Product[] = [
  {
    id: 'pro-camera-1',
    name: 'Professional DSLR Camera',
    category: 'Electronics',
    pricePerDay: 50,
    description:
      'High-end DSLR camera, perfect for professional photography and videography. Comes with a standard 18-55mm lens, battery, and charger.',
    imageUrl: 'https://picsum.photos/seed/camera1/600/400',
    imageHint: 'camera tripod',
    availability: true,
  },
  {
    id: 'tent-2p',
    name: '2-Person Camping Tent',
    category: 'Outdoor Gear',
    pricePerDay: 25,
    description:
      'Durable and waterproof 2-person tent. Easy to set up and ideal for weekend camping trips. Lightweight and compact for easy transport.',
    imageUrl: 'https://picsum.photos/seed/tent/600/400',
    imageHint: 'camping tent',
    availability: true,
  },
  {
    id: 'party-speaker-1',
    name: 'Large Bluetooth Party Speaker',
    category: 'Party Supplies',
    pricePerDay: 40,
    description:
      'Powerful Bluetooth speaker with built-in lights to get your party started. Long battery life and multiple connectivity options.',
    imageUrl: 'https://picsum.photos/seed/speaker/600/400',
    imageHint: 'party speaker',
    availability: false,
  },
  {
    id: 'power-drill-1',
    name: 'Cordless Power Drill Kit',
    category: 'Tools',
    pricePerDay: 20,
    description:
      'Versatile cordless drill with a full set of bits and two rechargeable batteries. Perfect for any home improvement project.',
    imageUrl: 'https://picsum.photos/seed/drill/600/400',
    imageHint: 'power drill',
    availability: true,
  },
  {
    id: 'drone-pro-1',
    name: '4K Pro-Grade Drone',
    category: 'Electronics',
    pricePerDay: 100,
    description:
      'Capture stunning aerial footage with this 4K drone. Features GPS, follow-me mode, and a 30-minute flight time.',
    imageUrl: 'https://picsum.photos/seed/drone/600/400',
    imageHint: 'drone flying',
    availability: true,
  },
  {
    id: 'kayak-1p',
    name: 'Single Person Kayak',
    category: 'Outdoor Gear',
    pricePerDay: 35,
    description:
      'A stable and maneuverable kayak for one person. Includes paddle and life vest. Great for lakes and calm rivers.',
    imageUrl: 'https://picsum.photos/seed/kayak/600/400',
    imageHint: 'kayak lake',
    availability: true,
  },
  {
    id: 'popcorn-machine-1',
    name: 'Retro Popcorn Machine',
    category: 'Party Supplies',
    pricePerDay: 30,
    description:
      'Bring the cinema experience to your event with this classic popcorn machine. Includes kernels and bags for 50 servings.',
    imageUrl: 'https://picsum.photos/seed/popcorn/600/400',
    imageHint: 'popcorn machine',
    availability: true,
  },
  {
    id: 'pressure-washer-1',
    name: 'Electric Pressure Washer',
    category: 'Tools',
    pricePerDay: 45,
    description:
      'High-power electric pressure washer for cleaning decks, driveways, and siding. Comes with multiple nozzle attachments.',
    imageUrl: 'https://picsum.photos/seed/washer/600/400',
    imageHint: 'pressure washer',
    availability: true,
  },
  {
    id: 'projector-hd-1',
    name: 'HD Home Cinema Projector',
    category: 'Electronics',
    pricePerDay: 60,
    description: 'Create a movie night anywhere with this bright HD projector. Supports HDMI, USB, and wireless casting.',
    imageUrl: 'https://picsum.photos/seed/projector/600/400',
    imageHint: 'movie projector',
    availability: false,
  },
  {
    id: 'mountain-bike-1',
    name: 'Full-Suspension Mountain Bike',
    category: 'Outdoor Gear',
    pricePerDay: 75,
    description: 'High-performance mountain bike for tackling rough trails. Features full suspension and hydraulic disc brakes.',
    imageUrl: 'https://picsum.photos/seed/mtnbike/600/400',
    imageHint: 'mountain bike',
    availability: true,
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const addProduct = (product: Product) => {
  products.unshift(product);
};
