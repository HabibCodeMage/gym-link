import { Injectable } from '@nestjs/common';
import {
  FitnessVenueDto,
  InfiniteScrollResponse,
  SearchFitnessVenuesDto,
} from './dto/fitness-venue.dto';
import {
  fitnessVenues,
  categories,
  vibes,
  cities,
} from './data/fitness-venues.data';

@Injectable()
export class FitnessVenuesService {
  findAll(): FitnessVenueDto[] {
    return fitnessVenues;
  }

  findOne(id: string): FitnessVenueDto | undefined {
    return fitnessVenues.find((venue) => venue.id === id);
  }

  search(
    searchDto: SearchFitnessVenuesDto,
  ): InfiniteScrollResponse<FitnessVenueDto> {
    let results = [...fitnessVenues];

    // Text search
    if (searchDto.search) {
      const searchTerm = searchDto.search.toLowerCase();
      results = results.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm) ||
          venue.location.toLowerCase().includes(searchTerm) ||
          venue.category.toLowerCase().includes(searchTerm) ||
          venue.services.some((service) =>
            service.toLowerCase().includes(searchTerm),
          ) ||
          venue.description.toLowerCase().includes(searchTerm),
      );
    }

    // Category filter - support both single and multiple categories
    if (searchDto.categories && searchDto.categories.length > 0) {
      results = results.filter((venue) =>
        searchDto.categories!.includes(venue.category),
      );
    } else if (searchDto.category && searchDto.category !== 'All') {
      results = results.filter(
        (venue) => venue.category === searchDto.category,
      );
    }

    // Vibe filter - support both single and multiple vibes
    if (searchDto.vibes && searchDto.vibes.length > 0) {
      results = results.filter((venue) =>
        searchDto.vibes!.includes(venue.vibe),
      );
    } else if (searchDto.vibe && searchDto.vibe !== 'All') {
      results = results.filter((venue) => venue.vibe === searchDto.vibe);
    }

    // City filter - support both single and multiple cities
    if (searchDto.cities && searchDto.cities.length > 0) {
      results = results.filter((venue) =>
        searchDto.cities!.includes(venue.city),
      );
    } else if (searchDto.city && searchDto.city !== 'All') {
      results = results.filter((venue) => venue.city === searchDto.city);
    }

    // Price range filter
    if (searchDto.priceMin !== undefined) {
      results = results.filter((venue) => venue.price >= searchDto.priceMin!);
    }
    if (searchDto.priceMax !== undefined) {
      results = results.filter((venue) => venue.price <= searchDto.priceMax!);
    }

    // Services filter
    if (searchDto.services && searchDto.services.length > 0) {
      results = results.filter((venue) =>
        searchDto.services!.every((service) =>
          venue.services.includes(service),
        ),
      );
    }

    // Rating filter
    if (searchDto.rating !== undefined) {
      results = results.filter((venue) => venue.rating >= searchDto.rating!);
    }

    // Specific service filters
    if (searchDto.hasParking) {
      results = results.filter((venue) => venue.services.includes('Parking'));
    }
    if (searchDto.has24HourAccess) {
      results = results.filter((venue) =>
        venue.services.includes('24/7 Access'),
      );
    }
    if (searchDto.hasSauna) {
      results = results.filter((venue) => venue.services.includes('Sauna'));
    }
    if (searchDto.hasPersonalTraining) {
      results = results.filter((venue) =>
        venue.services.includes('Personal Training'),
      );
    }

    // Infinite scroll pagination
    const limit = searchDto.limit || 6; // Default to 6 items per page
    let startIndex = 0;

    // If cursor is provided, find the index of that item
    if (searchDto.cursor) {
      const cursorIndex = results.findIndex(
        (venue) => venue.id === searchDto.cursor,
      );
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedResults = results.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + paginatedResults.length < results.length;
    const nextCursor = hasMore
      ? paginatedResults[paginatedResults.length - 1]?.id
      : undefined;

    return {
      data: paginatedResults,
      nextCursor,
      hasMore,
    };
  }

  getCategories(): string[] {
    return [...categories] as string[];
  }

  getVibes(): string[] {
    return [...vibes] as string[];
  }

  getCities(): string[] {
    return [...cities] as string[];
  }

  getFilterOptions() {
    return {
      categories: this.getCategories(),
      vibes: this.getVibes(),
      cities: this.getCities(),
    };
  }
}
