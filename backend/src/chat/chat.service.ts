import { Injectable } from '@nestjs/common';
import { ChatMessageDto, ChatResponseDto } from './dto/chat.dto';
import { fitnessVenues } from '../fitness-venues/data/fitness-venues.data';
import { FitnessVenueWithScore } from '../types/fitness-venue.interface';

@Injectable()
export class ChatService {
  // Knowledge base for fitness-related queries
  private fitnessKnowledge = {
    categories: {
      gym: 'Gyms offer strength training, cardio equipment, and group fitness classes. Perfect for building muscle, losing weight, and general fitness.',
      yoga: 'Yoga focuses on flexibility, balance, and mindfulness. Great for stress relief, improving posture, and mental wellness.',
      pilates:
        'Pilates strengthens core muscles, improves posture, and enhances flexibility. Ideal for rehabilitation and body awareness.',
      crossfit:
        'CrossFit combines weightlifting, cardio, and functional movements. High-intensity workouts for building strength and endurance.',
      boxing:
        'Boxing provides excellent cardio, stress relief, and self-defense skills. Great for building confidence and physical fitness.',
      swimming:
        'Swimming is low-impact, full-body exercise. Perfect for rehabilitation, cardiovascular health, and stress relief.',
      dance:
        'Dance combines fitness with creativity and fun. Great for coordination, cardiovascular health, and social interaction.',
      'martial arts':
        'Martial arts improve discipline, self-defense, and physical fitness. Great for building confidence and mental focus.',
    },
    services: {
      'personal training':
        'Personal training provides one-on-one guidance, customized workouts, and motivation to help you achieve your fitness goals.',
      'group classes':
        'Group classes offer structured workouts with instructor guidance and the motivation of working out with others.',
      sauna:
        'Saunas help with relaxation, muscle recovery, and detoxification. Great for post-workout recovery.',
      parking:
        'Convenient parking makes it easier to maintain a consistent workout routine.',
      '24/7 access':
        '24/7 access allows you to work out anytime that fits your schedule, providing maximum flexibility.',
      'nutrition coaching':
        'Nutrition coaching helps you fuel your body properly to support your fitness goals.',
      physiotherapy:
        'Physiotherapy helps with injury prevention, rehabilitation, and movement optimization.',
    },
    vibes: {
      'performance & intensity':
        'High-energy environments focused on pushing limits and achieving peak performance.',
      'calm & wellness':
        'Peaceful, mindful environments focused on mental and physical wellness.',
      'community & support':
        'Welcoming, supportive communities that encourage and motivate each other.',
      'modern & tech-forward':
        'Cutting-edge facilities with the latest technology and equipment.',
      'flexibility & lifestyle':
        'Adaptable environments that fit into your lifestyle and schedule.',
    },
    general: {
      budget:
        'Budget-friendly options typically range from $15-40 per week, offering basic equipment and group classes.',
      premium:
        'Premium facilities cost $50+ per week and offer luxury amenities, personal training, and top-tier equipment.',
      beginner:
        'Beginner-friendly venues offer introductory classes, patient instructors, and supportive environments.',
      advanced:
        'Advanced facilities cater to experienced athletes with challenging workouts and specialized equipment.',
      location:
        'Consider proximity to home or work, parking availability, and public transport access.',
      schedule:
        'Look for facilities with hours that match your availability, including early morning, evening, or weekend options.',
    },
  };

  // Extract keywords from user message
  private extractKeywords(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const keywords: string[] = [];

    // Extract categories
    Object.keys(this.fitnessKnowledge.categories).forEach((category) => {
      if (lowerMessage.includes(category)) {
        keywords.push(category);
      }
    });

    // Extract services
    Object.keys(this.fitnessKnowledge.services).forEach((service) => {
      if (lowerMessage.includes(service)) {
        keywords.push(service);
      }
    });

    // Extract vibes
    Object.keys(this.fitnessKnowledge.vibes).forEach((vibe) => {
      if (lowerMessage.includes(vibe.toLowerCase())) {
        keywords.push(vibe);
      }
    });

    // Extract general terms
    Object.keys(this.fitnessKnowledge.general).forEach((term) => {
      if (lowerMessage.includes(term)) {
        keywords.push(term);
      }
    });

    return keywords;
  }

  // Find relevant venues based on keywords
  private findRelevantVenues(keywords: string[]): FitnessVenueWithScore[] {
    if (keywords.length === 0) return [];

    const scoredVenues = fitnessVenues.map((venue) => {
      let score = 0;

      keywords.forEach((keyword) => {
        // Category matching
        if (venue.category.toLowerCase().includes(keyword)) score += 10;

        // Service matching
        venue.services.forEach((service: string) => {
          if (service.toLowerCase().includes(keyword)) score += 5;
        });

        // Vibe matching
        if (venue.vibe.toLowerCase().includes(keyword)) score += 3;

        // Description matching
        if (venue.description.toLowerCase().includes(keyword)) score += 2;

        // Features matching
        venue.features.forEach((feature: string) => {
          if (feature.toLowerCase().includes(keyword)) score += 2;
        });
      });

      return { ...venue, relevanceScore: score };
    });

    return scoredVenues
      .filter((venue) => venue.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  }

  // Generate contextual response
  private generateResponse(
    message: string,
    keywords: string[],
    relevantVenues: FitnessVenueWithScore[],
  ): string {
    const lowerMessage = message.toLowerCase();
    let response = '';

    // Greeting responses
    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      response =
        "Hello! I'm your Fitness Assistant. I can help you find the perfect fitness venue based on your preferences, goals, and needs. What are you looking for?";
    }
    // Help responses
    else if (
      lowerMessage.includes('help') ||
      lowerMessage.includes('what can you do')
    ) {
      response =
        'I can help you with:\n• Finding fitness venues by category, location, or services\n• Explaining different types of workouts and their benefits\n• Recommending venues based on your budget and preferences\n• Answering questions about fitness facilities and amenities\n\nWhat would you like to know?';
    }
    // Category-specific responses
    else if (
      keywords.some((k) =>
        Object.keys(this.fitnessKnowledge.categories).includes(k),
      )
    ) {
      const category = keywords.find((k) =>
        Object.keys(this.fitnessKnowledge.categories).includes(k),
      );
      response =
        this.fitnessKnowledge.categories[
          category as keyof typeof this.fitnessKnowledge.categories
        ];

      if (relevantVenues.length > 0) {
        response += `\n\nHere are some great ${category} venues I found:`;
        relevantVenues.forEach((venue) => {
          response += `\n• ${venue.name} in ${venue.city} - ${venue.description}`;
        });
      }
    }
    // Service-specific responses
    else if (
      keywords.some((k) =>
        Object.keys(this.fitnessKnowledge.services).includes(k),
      )
    ) {
      const service = keywords.find((k) =>
        Object.keys(this.fitnessKnowledge.services).includes(k),
      );
      response =
        this.fitnessKnowledge.services[
          service as keyof typeof this.fitnessKnowledge.services
        ];

      if (relevantVenues.length > 0) {
        response += `\n\nThese venues offer ${service}:`;
        relevantVenues.forEach((venue) => {
          response += `\n• ${venue.name} in ${venue.city}`;
        });
      }
    }
    // General fitness advice
    else if (
      keywords.some((k) =>
        Object.keys(this.fitnessKnowledge.general).includes(k),
      )
    ) {
      const topic = keywords.find((k) =>
        Object.keys(this.fitnessKnowledge.general).includes(k),
      );
      response =
        this.fitnessKnowledge.general[
          topic as keyof typeof this.fitnessKnowledge.general
        ];

      if (relevantVenues.length > 0) {
        response += `\n\nHere are some venues that might interest you:`;
        relevantVenues.forEach((venue) => {
          response += `\n• ${venue.name} in ${venue.city} - $${venue.price}/week`;
        });
      }
    }
    // Default response
    else {
      response =
        "I'd be happy to help you find the perfect fitness venue! Could you tell me more about what you're looking for? For example:\n• What type of workout interests you?\n• What's your budget range?\n• Do you prefer group classes or personal training?\n• Any specific location preferences?";

      if (relevantVenues.length > 0) {
        response += `\n\nBased on your message, here are some venues that might be relevant:`;
        relevantVenues.forEach((venue) => {
          response += `\n• ${venue.name} in ${venue.city} - ${venue.category}`;
        });
      }
    }

    return response;
  }

  // Generate follow-up suggestions
  private generateSuggestions(keywords: string[]): string[] {
    const suggestions: string[] = [];

    if (keywords.length === 0) {
      suggestions.push(
        'What type of workout are you interested in?',
        "What's your budget range?",
        'Do you prefer group classes or personal training?',
        'Any specific location preferences?',
      );
    } else {
      // Category-based suggestions
      if (
        keywords.some((k) =>
          Object.keys(this.fitnessKnowledge.categories).includes(k),
        )
      ) {
        suggestions.push(
          'What services are you looking for?',
          "What's your budget range?",
          'Any specific location preferences?',
        );
      }
      // Service-based suggestions
      else if (
        keywords.some((k) =>
          Object.keys(this.fitnessKnowledge.services).includes(k),
        )
      ) {
        suggestions.push(
          'What type of workout interests you?',
          "What's your budget range?",
          'Any specific location preferences?',
        );
      }
      // General suggestions
      else {
        suggestions.push(
          'What type of workout are you interested in?',
          'What services are you looking for?',
          "What's your budget range?",
        );
      }
    }

    return suggestions.slice(0, 3);
  }

  // Main chat method
  chat(chatMessage: ChatMessageDto): ChatResponseDto {
    const { message } = chatMessage;

    // Extract keywords from the message
    const keywords = this.extractKeywords(message);

    // Find relevant venues
    const relevantVenues = this.findRelevantVenues(keywords);

    // Generate response
    const response = this.generateResponse(message, keywords, relevantVenues);

    // Generate suggestions
    const suggestions = this.generateSuggestions(keywords);

    // Calculate confidence based on keyword matches and venue relevance
    const confidence = Math.min(
      keywords.length * 0.2 + relevantVenues.length * 0.1,
      1,
    );

    return {
      response,
      suggestions,
      relatedVenues: relevantVenues,
      confidence: Math.round(confidence * 100) / 100,
    };
  }
}
