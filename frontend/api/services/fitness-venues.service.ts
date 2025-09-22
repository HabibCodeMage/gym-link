import ApiBase from '../common/api-base';
import { AxiosInstance } from 'axios';

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

export interface SearchFitnessVenuesParams {
  search?: string;
  category?: string;
  categories?: string[];
  vibe?: string;
  vibes?: string[];
  city?: string;
  cities?: string[];
  priceMin?: number;
  priceMax?: number;
  services?: string[];
  rating?: number;
  hasParking?: boolean;
  has24HourAccess?: boolean;
  hasSauna?: boolean;
  hasPersonalTraining?: boolean;
  cursor?: string;
  limit?: number;
}

export interface InfiniteScrollResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface FilterOptions {
  categories: string[];
  vibes: string[];
  cities: string[];
}

class FitnessVenuesService extends ApiBase {
  constructor(axios: AxiosInstance) {
    super(axios);
  }

  async getAllVenues(): Promise<FitnessVenue[]> {
    const response = await this.axios.get('/fitness-venues');
    return response.data;
  }

  async searchVenues(params: SearchFitnessVenuesParams): Promise<InfiniteScrollResponse<FitnessVenue>> {
    const response = await this.axios.get('/fitness-venues/search', { params });
    return response.data;
  }

  async getVenueById(id: string): Promise<FitnessVenue> {
    const response = await this.axios.get(`/fitness-venues/${id}`);
    return response.data;
  }

  async getFilterOptions(): Promise<FilterOptions> {
    const response = await this.axios.get('/fitness-venues/filters');
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await this.axios.get('/fitness-venues/categories');
    return response.data;
  }

  async getVibes(): Promise<string[]> {
    const response = await this.axios.get('/fitness-venues/vibes');
    return response.data;
  }

  async getCities(): Promise<string[]> {
    const response = await this.axios.get('/fitness-venues/cities');
    return response.data;
  }
}

export default FitnessVenuesService;
