import { IsString, IsOptional } from 'class-validator';

export class AISearchDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  limit?: number;
}

export class AISearchResponse {
  venues: any[];
  explanation: string;
  nextCursor?: string;
  hasMore: boolean;
}
