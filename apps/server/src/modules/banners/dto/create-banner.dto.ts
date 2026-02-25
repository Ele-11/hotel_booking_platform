import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  targetUrl?: string;

  @IsNumber()
  @IsOptional()
  position?: number = 0;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}