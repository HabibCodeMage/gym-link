import { AxiosInstance } from 'axios';
import ApiBase from '../common/api-base';

export interface ChatMessage {
  message: string;
  context?: string[];
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
  relatedVenues?: any[];
  confidence: number;
}

class ChatService extends ApiBase {
  constructor(axios: AxiosInstance) {
    super(axios);
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    const response = await this.axios.post('/chat', message);
    return response.data;
  }
}

export default ChatService;
