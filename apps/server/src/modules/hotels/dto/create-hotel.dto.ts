//主要功能: 定义创建酒店所需的数据传输对象（DTO），包括各种酒店属性的验证规则。

/*
数据格式规范：规定了创建酒店必须包含的字段
  nameZh: 必填，酒店中文名称
  address: 必填，酒店地址
  city: 必填，城市名
  country: 必填，国家名
  contactPhone: 必填，联系电话
  contactEmail: 必填，联系邮箱
  description: 必填，酒店描述
  nameEn: 可选，酒店英文名称
  nearbyTransport: 可选，附近交通
  nearbyShopping: 可选，附近购物场所
  discountInfo: 可选，折扣信息
*/

import { HotelStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  Max,
  Min,
  IsEnum,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  englishName: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  starRating: number;

  @IsDateString()
  @IsOptional()
  openingDate: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  contactPhone: string;

  @IsString()
  contactEmail: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  nearbyTransport?: string;

  @IsString()
  @IsOptional()
  nearbyShopping?: string;

  @IsString()
  @IsOptional()
  discountInfo?: string;

  @IsOptional()
  @IsEnum(HotelStatus)
  status?: HotelStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsArray()
  @IsOptional()
  roomTypes?: [];
}
