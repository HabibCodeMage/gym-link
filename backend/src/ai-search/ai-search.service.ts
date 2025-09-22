import { Injectable } from '@nestjs/common';
import { AISearchResponse } from './dto/ai-search.dto';
import { fitnessVenues } from '../fitness-venues/data/fitness-venues.data';
import {
  FitnessVenue,
  FitnessVenueWithScore,
} from '../types/fitness-venue.interface';

@Injectable()
export class AiSearchService {
  // Simple semantic search using keyword matching and scoring
  private calculateRelevanceScore(query: string, venue: FitnessVenue): number {
    const lowerQuery = query.toLowerCase();
    let score = 0;

    // Name matching (highest weight)
    if (venue.name.toLowerCase().includes(lowerQuery)) score += 10;

    // Description matching
    if (venue.description.toLowerCase().includes(lowerQuery)) score += 8;

    // Category matching
    if (venue.category.toLowerCase().includes(lowerQuery)) score += 6;

    // Services matching
    venue.services.forEach((service: string) => {
      if (service.toLowerCase().includes(lowerQuery)) score += 4;
    });

    // Features matching
    venue.features.forEach((feature: string) => {
      if (feature.toLowerCase().includes(lowerQuery)) score += 3;
    });

    // Location matching
    if (
      venue.location.toLowerCase().includes(lowerQuery) ||
      venue.city.toLowerCase().includes(lowerQuery)
    )
      score += 5;

    // Vibe matching
    if (venue.vibe.toLowerCase().includes(lowerQuery)) score += 4;

    // Price-related queries
    if (
      lowerQuery.includes('cheap') ||
      lowerQuery.includes('budget') ||
      lowerQuery.includes('affordable')
    ) {
      if (venue.price <= 40) score += 3;
    }
    if (
      lowerQuery.includes('expensive') ||
      lowerQuery.includes('premium') ||
      lowerQuery.includes('luxury')
    ) {
      if (venue.price >= 50) score += 3;
    }

    // Specific service queries
    if (lowerQuery.includes('sauna') && venue.services.includes('Sauna'))
      score += 5;
    if (lowerQuery.includes('24/7') && venue.services.includes('24/7 Access'))
      score += 5;
    if (lowerQuery.includes('parking') && venue.services.includes('Parking'))
      score += 5;
    if (
      lowerQuery.includes('personal training') &&
      venue.services.includes('Personal Training')
    )
      score += 5;

    return score;
  }

  private generateExplanation(
    query: string,
    venues: FitnessVenueWithScore[],
  ): string {
    const topVenue = venues[0];
    const categories = [...new Set(venues.map((v) => v.category))];
    const cities = [...new Set(venues.map((v) => v.city))];

    let explanation = `Found ${venues.length} fitness venues matching "${query}". `;

    if (categories.length === 1) {
      explanation += `All venues are ${categories[0]} facilities. `;
    } else if (categories.length > 1) {
      explanation += `Venues include ${categories.join(', ')}. `;
    }

    if (cities.length === 1) {
      explanation += `All located in ${cities[0]}. `;
    } else if (cities.length > 1) {
      explanation += `Located in ${cities.join(', ')}. `;
    }

    if (topVenue) {
      explanation += `Top recommendation: ${topVenue.name} in ${topVenue.location}, ${topVenue.city} - ${topVenue.description}`;
    }

    return explanation;
  }

  search(query: string, cursor?: string, limit: number = 6): AISearchResponse {
    // Calculate relevance scores for all venues
    const venuesWithScores = fitnessVenues.map((venue) => ({
      ...venue,
      relevanceScore: this.calculateRelevanceScore(query, venue),
    }));

    // Filter out venues with 0 relevance score and sort by relevance
    const relevantVenues = venuesWithScores
      .filter((venue) => venue.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply pagination
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = relevantVenues.findIndex(
        (venue) => venue.id === cursor,
      );
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedVenues = relevantVenues.slice(
      startIndex,
      startIndex + limit,
    );
    const hasMore = startIndex + paginatedVenues.length < relevantVenues.length;
    const nextCursor = hasMore
      ? paginatedVenues[paginatedVenues.length - 1]?.id
      : undefined;

    // Generate explanation
    const explanation = this.generateExplanation(query, paginatedVenues);

    return {
      venues: paginatedVenues,
      explanation,
      nextCursor,
      hasMore,
    };
  }
}
