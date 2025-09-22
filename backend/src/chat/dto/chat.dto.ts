import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context?: string[];
}

export class ChatResponseDto {
  response: string;
  suggestions: string[];
  relatedVenues?: any[];
  confidence: number;
}
