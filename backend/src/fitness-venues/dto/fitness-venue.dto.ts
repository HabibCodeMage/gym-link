import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { FitnessVenue } from '../../types/fitness-venue.interface';

export class FitnessVenueDto implements FitnessVenue {
  id: string;
  name: string;
  category: string;
  location: string;
  suburb: string;
  city: string;
  price: number;
  services: string[];
  vibe: string;
  rating: number;
  image: string;
  description: string;
  features: string[];
}

export class SearchFitnessVenuesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  categories?: string[]; // Support multiple categories

  @IsOptional()
  @IsString()
  vibe?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  vibes?: string[]; // Support multiple vibes

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  cities?: string[]; // Support multiple cities

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  priceMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  services?: string[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  hasParking?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  has24HourAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  hasSauna?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  hasPersonalTraining?: boolean;

  @IsOptional()
  @IsString()
  cursor?: string; // ID of the last item from previous page

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => {
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })
  limit?: number;
}

export class InfiniteScrollResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}
