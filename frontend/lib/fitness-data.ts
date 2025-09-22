export interface FitnessVenue {
  id: string
  name: string
  category: "Gym" | "Yoga" | "Pilates" | "Boxing" | "CrossFit" | "Swimming" | "Dance" | "Martial Arts"
  location: string
  suburb: string
  city: string
  price: number // weekly membership
  services: string[]
  vibe:
    | "Performance & Intensity"
    | "Calm & Wellness"
    | "Community & Support"
    | "Modern & Tech-Forward"
    | "Flexibility & Lifestyle"
  rating: number
  image: string
  description: string
  features: string[]
}

export const fitnessVenues: FitnessVenue[] = [
  {
    id: "1",
    name: "Iron Temple Gym",
    category: "Gym",
    location: "Bondi Beach",
    suburb: "Bondi",
    city: "Sydney",
    price: 45,
    services: ["Personal Training", "Group Classes", "Sauna", "24/7 Access", "Parking", "Locker Rooms"],
    vibe: "Performance & Intensity",
    rating: 4.8,
    image: "/modern-gym-interior-with-weights.jpg",
    description: "Premium strength training facility with Olympic-grade equipment",
    features: ["Olympic Lifting Platform", "Cardio Zone", "Free Weights", "Functional Training Area"],
  },
  {
    id: "2",
    name: "Zen Flow Yoga Studio",
    category: "Yoga",
    location: "Byron Bay",
    suburb: "Byron Bay",
    city: "Byron Bay",
    price: 35,
    services: ["Group Classes", "Meditation", "Workshops", "Retreats", "Parking"],
    vibe: "Calm & Wellness",
    rating: 4.9,
    image: "/peaceful-yoga-studio-with-natural-light.jpg",
    description: "Tranquil yoga sanctuary focusing on mindfulness and wellness",
    features: ["Heated Studios", "Meditation Garden", "Organic Tea Bar", "Eco-Friendly Materials"],
  },
  {
    id: "3",
    name: "FitTech Hub",
    category: "Gym",
    location: "Melbourne CBD",
    suburb: "Melbourne",
    city: "Melbourne",
    price: 55,
    services: ["Personal Training", "Group Classes", "Recovery Zone", "24/7 Access", "Parking", "Childcare"],
    vibe: "Modern & Tech-Forward",
    rating: 4.7,
    image: "/high-tech-modern-gym-with-digital-displays.jpg",
    description: "Next-generation fitness facility with cutting-edge technology",
    features: ["AI Workout Planning", "Smart Equipment", "VR Fitness", "Biometric Tracking"],
  },
  {
    id: "4",
    name: "Community Crossfit",
    category: "CrossFit",
    location: "Surfers Paradise",
    suburb: "Surfers Paradise",
    city: "Gold Coast",
    price: 40,
    services: ["Group Classes", "Nutrition Coaching", "Personal Training", "Parking"],
    vibe: "Community & Support",
    rating: 4.6,
    image: "/crossfit-gym-with-community-atmosphere.jpg",
    description: "Supportive CrossFit community focused on functional fitness",
    features: ["Competition Rig", "Outdoor Training Area", "Nutrition Bar", "Recovery Zone"],
  },
  {
    id: "5",
    name: "Precision Pilates",
    category: "Pilates",
    location: "Toorak",
    suburb: "Toorak",
    city: "Melbourne",
    price: 50,
    services: ["Group Classes", "Physiotherapy", "Personal Training", "Parking"],
    vibe: "Calm & Wellness",
    rating: 4.8,
    image: "/elegant-pilates-studio-with-reformer-machines.jpg",
    description: "Premium Pilates studio with expert instructors and top equipment",
    features: ["Reformer Machines", "Private Sessions", "Physiotherapy", "Specialized Programs"],
  },
  {
    id: "6",
    name: "Strike Boxing Academy",
    category: "Boxing",
    location: "Newtown",
    suburb: "Newtown",
    city: "Sydney",
    price: 38,
    services: ["Group Classes", "Personal Training", "Locker Rooms", "Showers"],
    vibe: "Performance & Intensity",
    rating: 4.5,
    image: "/boxing-gym-with-heavy-bags-and-ring.jpg",
    description: "Authentic boxing gym with professional training programs",
    features: ["Boxing Ring", "Heavy Bags", "Speed Bags", "Strength Training"],
  },
  {
    id: "7",
    name: "Aqua Life Swimming",
    category: "Swimming",
    location: "Manly",
    suburb: "Manly",
    city: "Sydney",
    price: 42,
    services: ["Swimming Pool", "Group Classes", "Personal Training", "Parking", "Childcare"],
    vibe: "Flexibility & Lifestyle",
    rating: 4.4,
    image: "/modern-swimming-pool-facility.jpg",
    description: "State-of-the-art aquatic center with multiple pools and programs",
    features: ["Olympic Pool", "Hydrotherapy Pool", "Kids Pool", "Spa Facilities"],
  },
  {
    id: "8",
    name: "Rhythm Dance Studio",
    category: "Dance",
    location: "Fitzroy",
    suburb: "Fitzroy",
    city: "Melbourne",
    price: 32,
    services: ["Group Classes", "Personal Training", "Locker Rooms", "Parking"],
    vibe: "Community & Support",
    rating: 4.7,
    image: "/vibrant-dance-studio-with-mirrors.jpg",
    description: "Creative dance studio offering diverse styles for all levels",
    features: ["Sprung Floors", "Sound System", "Mirrors", "Performance Space"],
  },
]

export const categories = [
  "All",
  "Gym",
  "Yoga",
  "Pilates",
  "Boxing",
  "CrossFit",
  "Swimming",
  "Dance",
  "Martial Arts",
] as const
export const vibes = [
  "All",
  "Performance & Intensity",
  "Calm & Wellness",
  "Community & Support",
  "Modern & Tech-Forward",
  "Flexibility & Lifestyle",
] as const
export const cities = [
  "All",
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Byron Bay",
] as const
