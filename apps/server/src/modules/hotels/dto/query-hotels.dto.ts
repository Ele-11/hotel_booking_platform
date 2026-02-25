//主要功能: 定义查询酒店所需的数据传输对象（DTO），包括各种查询参数的验证规则。

/*
数据格式规范：规定了查询酒店必须包含的字段
搜索与筛选字段：
  keyword: 可选，搜索关键词
  city: 可选，城市名
  starRatings: 可选，星级评分
价格筛选字段：
  minPrice: 可选，最低价格
  maxPrice: 可选，最高价格
排序字段：
  sortBy: 可选，排序字段
  sortOrder: 可选，排序顺序（asc或desc）  
分页字段：
  page: 可选，页码，默认值为1，最小值为1
  limit: 可选，每页条数，默认值为10，范围1-100
*/
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max, IsArray, IsDateString } from 'class-validator';

export class QueryHotelsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  starRatings?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // 新增：入住/离店日期筛选
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  // 新增：标签筛选
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
