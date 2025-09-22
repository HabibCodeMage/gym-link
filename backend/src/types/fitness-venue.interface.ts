export interface FitnessVenue {
  id: string;
  name: string;
  category: string;
  location: string;
  suburb: string;
  city: string;
  price: number;
  services: string[];
  vibe: string;
  rating: number;
  image: string;
  description: string;
  features: string[];
}

export interface FitnessVenueWithScore extends FitnessVenue {
  relevanceScore?: number;
  contentScore?: number;
  collaborativeScore?: number;
  popularityScore?: number;
  finalScore?: number;
}

export interface UserProfile {
  preferences: string[];
  services: string[];
  features: string[];
  priceRange: [number, number];
  vibes: string[];
}
