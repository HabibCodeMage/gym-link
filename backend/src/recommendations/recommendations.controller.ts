import { Controller, Get, Query, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import {
  RecommendationRequestDto,
  LimitQueryDto,
} from './dto/recommendation.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  getRecommendations(@Query() request: RecommendationRequestDto) {
    return this.recommendationsService.getRecommendations(request);
  }

  @Get('personalized/:userType')
  getPersonalizedRecommendations(
    @Param('userType') userType: string,
    @Query() query: LimitQueryDto,
  ) {
    return this.recommendationsService.getPersonalizedRecommendations(
      userType,
      query.limit || 6,
    );
  }

  @Get('trending')
  getTrendingRecommendations(@Query() query: LimitQueryDto) {
    return this.recommendationsService.getTrendingRecommendations(
      query.limit || 6,
    );
  }
}
