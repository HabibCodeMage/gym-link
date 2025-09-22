import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import FitnessVenuesService from './services/fitness-venues.service';
import AISearchService from './services/ai-search.service';
import RecommendationsService from './services/recommendations.service';
import ChatService from './services/chat.service';

class Api {
  axios: AxiosInstance;
  token: string | undefined;
  fitnessVenuesService: FitnessVenuesService;
  aiSearchService: AISearchService;
  recommendationsService: RecommendationsService;
  chatService: ChatService;

  constructor() {
    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    if (!BACKEND_BASE_URL) {
      throw new Error('Missing environment variable: NEXT_PUBLIC_BACKEND_BASE_URL');
    }

    this.axios = axios.create({
      baseURL: BACKEND_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: {
        indexes: null, // This makes arrays serialize as param=value1&param=value2 instead of param[]=value1&param[]=value2
      },
    });

    this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // Add any authentication headers here if needed in the future
      return config;
    });

    this.axios.interceptors.response.use(response => {
      return response;
    }, error => {
      console.error('API Error:', error);
      return Promise.reject(error);
    });

    this.fitnessVenuesService = new FitnessVenuesService(this.axios);
    this.aiSearchService = new AISearchService(this.axios);
    this.recommendationsService = new RecommendationsService(this.axios);
    this.chatService = new ChatService(this.axios);
  }
}

const api = new Api();
export default api;
