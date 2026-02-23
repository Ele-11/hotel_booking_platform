//主要功能: 定义查询预订的DTO，包含可选的过滤、排序和分页参数。

/*
数据格式规范：规定了查询预订列表的可选参数
  hotelId：按酒店 ID 筛选
  userId：按用户 ID 筛选
  status：按预订状态筛选
  sortBy：排序字段
  sortOrder：排序方向
  page：页码
  limit：每页数量
*/

import { BookingStatus, Booking  } from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class QueryBookingsDto {
  @IsOptional()
  @IsString()
  hotelId?: string; // 酒店 ID

  @IsOptional()
  @IsString()
  userId?: string; // 用户 ID

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus; // 预订状态

  @IsOptional()
  @IsString()
  sortBy?: keyof Booking; // 排序字段

  @IsOptional()
  @IsString()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'; // 排序方向

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1; // 页码

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10; // 每页数量
}