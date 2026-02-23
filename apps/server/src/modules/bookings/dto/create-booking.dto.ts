//主要功能: 定义创建预订的DTO，包含酒店ID、房间类型ID、入住日期、退房日期、来宾数量和特殊请求。

/*
数据格式规范：规定了创建预订请求必须包含的字段
  hotelId：酒店 ID
  roomTypeId：房型 ID
  checkInDate：入住日期
  checkOutDate：退房日期
  guests：客人数量
  specialRequests：特殊要求（可选）
*/

import { IsString, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  hotelId: string; // 酒店 ID

  @IsString()
  roomTypeId: string; // 房型 ID

  @IsDateString()
  checkInDate: Date; // 入住日期

  @IsDateString()
  checkOutDate: Date; // 退房日期

  @IsNumber()
  @Min(1)
  numberOfGuests: number; // 客人数量

  @IsString()
  @IsOptional()
  specialRequests?: string; // 特殊要求（可选）
}