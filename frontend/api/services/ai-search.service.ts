import { AxiosInstance } from 'axios';
import ApiBase from '../common/api-base';
import { FitnessVenue } from './fitness-venues.service';

export interface AISearchParams {
  query: string;
  cursor?: string;
  limit?: number;
}

export interface AISearchResponse {
  venues: FitnessVenue[];
  explanation: string;
  nextCursor?: string;
  hasMore: boolean;
}

class AISearchService extends ApiBase {
  constructor(axios: AxiosInstance) {
    super(axios);
  }

  async search(params: AISearchParams): Promise<AISearchResponse> {
    const response = await this.axios.get('/ai-search', { params });
    return response.data;
  }
}

export default AISearchService;
