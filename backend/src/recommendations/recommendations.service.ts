import { Injectable } from '@nestjs/common';
import {
  RecommendationRequestDto,
  RecommendationResponse,
} from './dto/recommendation.dto';
import { fitnessVenues } from '../fitness-venues/data/fitness-venues.data';
import {
  FitnessVenue,
  FitnessVenueWithScore,
  UserProfile,
} from '../types/fitness-venue.interface';

@Injectable()
export class RecommendationsService {
  // User preference profiles (simulated user data)
  private userProfiles: Record<string, UserProfile> = {
    fitness_enthusiast: {
      preferences: ['Gym', 'CrossFit', 'Boxing'],
      services: ['Personal Training', 'Group Classes', '24/7 Access'],
      features: ['High-Intensity', 'Performance & Intensity'],
      priceRange: [30, 80],
      vibes: ['Performance & Intensity', 'Community & Support'],
    },
    wellness_seeker: {
      preferences: ['Yoga', 'Pilates'],
      services: ['Sauna', 'Spa Services', 'Meditation Classes'],
      features: ['Calm & Wellness', 'Flexibility & Lifestyle'],
      priceRange: [20, 60],
      vibes: ['Calm & Wellness', 'Flexibility & Lifestyle'],
    },
    budget_conscious: {
      preferences: ['Gym', 'Swimming'],
      services: ['Basic Equipment', 'Group Classes'],
      features: ['Affordable', 'Community & Support'],
      priceRange: [15, 40],
      vibes: ['Community & Support'],
    },
    tech_savvy: {
      preferences: ['Gym', 'CrossFit'],
      services: ['Wearable Integration', 'Virtual Classes', '24/7 Access'],
      features: ['Modern & Tech-Forward', 'Performance & Intensity'],
      priceRange: [40, 100],
      vibes: ['Modern & Tech-Forward', 'Performance & Intensity'],
    },
  };

  // Calculate content-based similarity score
  private calculateContentSimilarity(
    venue: FitnessVenue,
    preferences: UserProfile,
  ): number {
    let score = 0;

    // Category preference matching
    if (preferences.preferences?.includes(venue.category)) {
      score += 15;
    }

    // Service matching
    preferences.services?.forEach((service: string) => {
      if (venue.services.includes(service)) {
        score += 8;
      }
    });

    // Feature matching
    preferences.features?.forEach((feature: string) => {
      if (venue.features.includes(feature)) {
        score += 6;
      }
    });

    // Vibe matching
    if (preferences.vibes?.includes(venue.vibe)) {
      score += 10;
    }

    // Price range matching
    if (preferences.priceRange) {
      const [minPrice, maxPrice] = preferences.priceRange;
      if (venue.price >= minPrice && venue.price <= maxPrice) {
        score += 12;
      } else {
        // Penalty for being outside preferred range
        const distance = Math.min(
          Math.abs(venue.price - minPrice),
          Math.abs(venue.price - maxPrice),
        );
        score += Math.max(0, 12 - distance * 0.5);
      }
    }

    return score;
  }

  // Calculate collaborative filtering score (simulated)
  private calculateCollaborativeScore(
    venue: FitnessVenue,
    userId?: string,
  ): number {
    if (!userId) return 0;

    // Simulate user behavior patterns
    const userBehavior = {
      fitness_enthusiast: { gym: 0.9, crossfit: 0.8, boxing: 0.7, yoga: 0.3 },
      wellness_seeker: { yoga: 0.9, pilates: 0.8, gym: 0.4, crossfit: 0.2 },
      budget_conscious: { gym: 0.8, swimming: 0.7, yoga: 0.6, crossfit: 0.3 },
      tech_savvy: { gym: 0.9, crossfit: 0.8, yoga: 0.4, pilates: 0.3 },
    };

    const behavior = userBehavior[userId as keyof typeof userBehavior];
    if (!behavior) return 0;

    const categoryKey = venue.category.toLowerCase().replace(/\s+/g, '');
    return (behavior[categoryKey as keyof typeof behavior] || 0) * 20;
  }

  // Calculate popularity score
  private calculatePopularityScore(venue: FitnessVenue): number {
    // Simulate popularity based on rating (review count not available in data)
    const ratingScore = venue.rating * 5;
    // Simulate review count based on rating (higher rating = more reviews)
    const simulatedReviewCount = Math.floor(venue.rating * 20);
    const reviewScore = Math.min(simulatedReviewCount / 10, 10);
    return ratingScore + reviewScore;
  }

  // Generate explanation for recommendations
  private generateRecommendationExplanation(
    venues: FitnessVenueWithScore[],
    algorithm: string,
    preferences?: UserProfile,
    userId?: string,
  ): string {
    const topVenue = venues[0];
    const categories = [...new Set(venues.map((v) => v.category))];
    const avgPrice =
      venues.reduce((sum, v) => sum + v.price, 0) / venues.length;

    let explanation = `Recommended ${venues.length} fitness venues using ${algorithm}. `;

    if (userId && this.userProfiles[userId]) {
      explanation += `Based on your ${userId.replace('_', ' ')} profile, `;
    }

    if (preferences?.preferences && preferences.preferences.length > 0) {
      explanation += `focusing on ${preferences.preferences.join(', ')} activities. `;
    }

    if (categories.length === 1) {
      explanation += `All recommendations are ${categories[0]} facilities. `;
    } else if (categories.length > 1) {
      explanation += `Recommendations include ${categories.join(', ')}. `;
    }

    explanation += `Average price: $${avgPrice.toFixed(0)}/month. `;

    if (topVenue) {
      explanation += `Top pick: ${topVenue.name} - ${topVenue.description}`;
    }

    return explanation;
  }

  // Main recommendation algorithm
  getRecommendations(
    request: RecommendationRequestDto,
  ): RecommendationResponse {
    const {
      userId,
      preferences,
      category,
      city,
      maxPrice,
      limit = 6,
    } = request;

    // Get user profile or create from preferences
    let userProfile: UserProfile | null = userId
      ? this.userProfiles[userId]
      : null;

    if (!userProfile && preferences) {
      // Create a basic user profile from preferences
      userProfile = {
        preferences: preferences,
        services: [], // Will be populated based on preferences
        features: [], // Will be populated based on preferences
        priceRange: maxPrice ? [0, maxPrice] : [0, 100],
        vibes: [], // Will be populated based on preferences
      };

      // Map preferences to services and features
      preferences.forEach((pref: string) => {
        if (pref === 'Gym') {
          userProfile!.services.push(
            'Personal Training',
            'Group Classes',
            '24/7 Access',
          );
          userProfile!.features.push(
            'High-Intensity',
            'Performance & Intensity',
          );
          userProfile!.vibes.push('Performance & Intensity');
        } else if (pref === 'Yoga') {
          userProfile!.services.push('Meditation', 'Workshops');
          userProfile!.features.push(
            'Calm & Wellness',
            'Flexibility & Lifestyle',
          );
          userProfile!.vibes.push('Calm & Wellness');
        } else if (pref === 'Pilates') {
          userProfile!.services.push('Personal Training', 'Physiotherapy');
          userProfile!.features.push(
            'Calm & Wellness',
            'Flexibility & Lifestyle',
          );
          userProfile!.vibes.push('Calm & Wellness');
        } else if (pref === 'CrossFit') {
          userProfile!.services.push(
            'Group Classes',
            'Personal Training',
            'Nutrition Coaching',
          );
          userProfile!.features.push(
            'High-Intensity',
            'Performance & Intensity',
          );
          userProfile!.vibes.push(
            'Performance & Intensity',
            'Community & Support',
          );
        } else if (pref === 'Boxing') {
          userProfile!.services.push('Group Classes', 'Personal Training');
          userProfile!.features.push(
            'High-Intensity',
            'Performance & Intensity',
          );
          userProfile!.vibes.push('Performance & Intensity');
        }
      });
    }

    // Filter venues based on basic criteria
    const filteredVenues = fitnessVenues.filter((venue) => {
      if (category && venue.category !== category) return false;
      if (city && venue.city !== city) return false;
      if (maxPrice && venue.price > maxPrice) return false;
      return true;
    });

    // Calculate scores for each venue
    const venuesWithScores = filteredVenues.map((venue) => {
      let contentScore = 0;
      let collaborativeScore = 0;
      let popularityScore = 0;

      if (userProfile) {
        contentScore = this.calculateContentSimilarity(venue, userProfile);
      }

      collaborativeScore = this.calculateCollaborativeScore(venue, userId);
      popularityScore = this.calculatePopularityScore(venue);

      // Weighted final score
      const finalScore =
        contentScore * 0.5 + collaborativeScore * 0.3 + popularityScore * 0.2;

      return {
        ...venue,
        contentScore,
        collaborativeScore,
        popularityScore,
        finalScore,
      };
    });

    // Sort by final score and take top results
    const recommendations = venuesWithScores
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);

    // Determine algorithm used
    let algorithm = 'hybrid';
    if (userProfile && !userId) {
      algorithm = 'content-based';
    } else if (userId && !userProfile) {
      algorithm = 'collaborative';
    } else if (userId && userProfile) {
      algorithm = 'hybrid';
    } else {
      algorithm = 'popularity-based';
    }

    // Calculate confidence score
    const avgScore =
      recommendations.reduce((sum, v) => sum + (v.finalScore || 0), 0) /
      recommendations.length;
    const confidence = Math.min(avgScore / 50, 1); // Normalize to 0-1

    // Generate explanation
    const explanation = this.generateRecommendationExplanation(
      recommendations,
      algorithm,
      userProfile || undefined,
      userId,
    );

    return {
      venues: recommendations,
      explanation,
      algorithm,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  // Get personalized recommendations for specific user types
  getPersonalizedRecommendations(
    userType: string,
    limit: number = 6,
  ): RecommendationResponse {
    return this.getRecommendations({
      userId: userType,
      limit,
    });
  }

  // Get trending recommendations
  getTrendingRecommendations(limit: number = 6): RecommendationResponse {
    const venuesWithScores = fitnessVenues.map((venue) => ({
      ...venue,
      finalScore: this.calculatePopularityScore(venue),
    }));

    const recommendations = venuesWithScores
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);

    const explanation = `Top ${limit} trending fitness venues based on popularity and ratings.`;

    return {
      venues: recommendations,
      explanation,
      algorithm: 'trending',
      confidence: 0.85,
    };
  }
}
