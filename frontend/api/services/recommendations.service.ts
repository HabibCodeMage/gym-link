import { AxiosInstance } from 'axios';
import ApiBase from '../common/api-base';
import { FitnessVenue } from './fitness-venues.service';

export interface RecommendationParams {
  userId?: string;
  preferences?: string[];
  category?: string;
  city?: string;
  maxPrice?: number;
  limit?: number;
}

export interface RecommendationResponse {
  venues: FitnessVenue[];
  explanation: string;
  algorithm: string;
  confidence: number;
}

class RecommendationsService extends ApiBase {
  constructor(axios: AxiosInstance) {
    super(axios);
  }

  async getRecommendations(params: RecommendationParams): Promise<RecommendationResponse> {
    const response = await this.axios.get('/recommendations', { params });
    return response.data;
  }

  async getPersonalizedRecommendations(userType: string, limit?: number): Promise<RecommendationResponse> {
    const response = await this.axios.get(`/recommendations/personalized/${userType}`, {
      params: { limit }
    });
    return response.data;
  }

  async getTrendingRecommendations(limit?: number): Promise<RecommendationResponse> {
    const response = await this.axios.get('/recommendations/trending', {
      params: { limit }
    });
    return response.data;
  }
}

export default RecommendationsService;
