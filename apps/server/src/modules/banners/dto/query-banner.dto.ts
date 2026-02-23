// apps/server/src/modules/banners/dto/query-banner.dto.ts
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class QueryBannerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'position';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}