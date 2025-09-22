import { Controller, Get, Query } from '@nestjs/common';
import { AiSearchService } from './ai-search.service';
import { AISearchDto } from './dto/ai-search.dto';

@Controller('ai-search')
export class AiSearchController {
  constructor(private readonly aiSearchService: AiSearchService) {}

  @Get()
  search(@Query() searchDto: AISearchDto) {
    return this.aiSearchService.search(
      searchDto.query,
      searchDto.cursor,
      searchDto.limit || 6,
    );
  }
}
