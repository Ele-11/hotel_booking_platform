import { Controller, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';

import { LocationService } from './location.service';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('ip')
  @ApiOperation({ summary: '根据IP获取城市信息' })
  @ApiResponse({ status: 200, description: '返回城市信息' })
  async getLocationByIp(@Req() req: Request) {
    const ipAddress = this.getClientIpAddress(req);
    return this.locationService.getCityByIp(ipAddress);
  }

  @Get('coordinates')
  @ApiOperation({ summary: '根据经纬度获取详细地址' })
  @ApiQuery({ name: 'lat', description: '纬度', example: 39.9042 })
  @ApiQuery({ name: 'lng', description: '经度', example: 116.4074 })
  @ApiResponse({ status: 200, description: '返回详细地址信息' })
  async getLocationByCoordinates(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.locationService.getLocationByCoordinates(lat, lng);
  }

  @Get('popular-cities')
  @ApiOperation({ summary: '获取热门城市列表' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '返回热门城市列表' })
  async getPopularCities(@Query('limit') limit?: number) {
    const limitNum = limit ? parseInt(limit.toString(), 10) : 10;
    return this.locationService.getPopularCities(limitNum);
  }

  @Get('all-cities')
  @ApiOperation({ summary: '获取所有城市列表' })
  @ApiResponse({ status: 200, description: '返回所有城市及酒店数量' })
  async getAllCities() {
    return this.locationService.getAllCitiesWithCount();
  }

  @Get('search')
  @ApiOperation({ summary: '搜索城市' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', example: '北京' })
  @ApiResponse({ status: 200, description: '返回匹配的城市列表' })
  async searchCities(@Query('keyword') keyword: string) {
    return this.locationService.searchCities(keyword);
  }

  @Get('city-exists/:city')
  @ApiOperation({ summary: '检查城市是否存在酒店' })
  @ApiResponse({ status: 200, description: '返回城市存在酒店的状态' })
  async cityExists(@Param('city') city: string) {
    const hasHotels = await this.locationService.cityHasHotels(city);
    return { city, hasHotels };
  }

  @Get('distribution')
  @ApiOperation({ summary: '获取城市酒店分布统计' })
  @ApiResponse({ status: 200, description: '返回城市酒店分布' })
  async getCityDistribution() {
    return this.locationService.getCityHotelDistribution();
  }

  // 从请求中获取客户端IP地址
  private getClientIpAddress(req: Request): string {
    // 尝试从各种头部获取真实IP
    return (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      ''
    ).split(',')[0].trim();
  }
}