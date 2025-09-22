import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FitnessVenuesModule } from './fitness-venues/fitness-venues.module';
import { AiSearchModule } from './ai-search/ai-search.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    FitnessVenuesModule,
    AiSearchModule,
    RecommendationsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
