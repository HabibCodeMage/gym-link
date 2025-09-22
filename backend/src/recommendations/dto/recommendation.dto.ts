import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { FitnessVenue } from '../../types/fitness-venue.interface';

export class RecommendationRequestDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  limit?: number;
}

export class LimitQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  limit?: number;
}

export class RecommendationResponse {
  venues: FitnessVenue[];
  explanation: string;
  algorithm: string;
  confidence: number;
}
