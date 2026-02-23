import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { PrismaService } from '../../prisma/prisma.service';

// 位置响应接口定义，匹配高德地图 API 的返回结构
interface LocationResponse {
  status: string;
  regeocode: {
    formatted_address: string;
    addressComponent: {
      city: string;
      province: string;
      district: string;
    };
  };
}

// IP定位响应接口定义
interface IpLocationResponse {
  status: string;
  info: string;
  infocode: string;
  province: string;
  city: string;
  adcode: string;
  rectangle: string;
  district?: string;
}

// 城市分布接口定义
export interface CityDistribution {
  city: string;
  count: number;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  
  // 高德地图 API 配置
  private readonly AMAP_API_KEY = process.env.AMAP_API_KEY;
  private readonly AMAP_GEOCODING_URL = 'https://restapi.amap.com/v3/geocode/regeo';
  private readonly AMAP_IP_LOCATION_URL = 'https://restapi.amap.com/v3/ip'; 

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  /**
   * 根据 IP 地址获取城市信息
   */
  async getCityByIp(ipAddress: string): Promise<{ city: string; province: string; district?: string }> {
    try {
      // 验证IP地址格式（简单验证）
      if (!this.isValidIpAddress(ipAddress)) {
        this.logger.warn(`Invalid IP address format: ${ipAddress}`);
        return this.getFallbackLocation();
      }

      if (!this.AMAP_API_KEY) {
        this.logger.warn('AMAP_API_KEY is not configured, using fallback location');
        return this.getFallbackLocation();
      }

      // 调用高德地图IP定位API
      const response = await firstValueFrom(
        this.httpService.get<IpLocationResponse>(this.AMAP_IP_LOCATION_URL, {
          params: {
            key: this.AMAP_API_KEY,
            ip: ipAddress,
          },
        })
      );

      if (response.data.status !== '1' || !response.data.city) {
        this.logger.warn(`Failed to get location by IP ${ipAddress}, using fallback: ${response.data.info || 'Unknown error'}`);
        return this.getFallbackLocation();
      }

      // 高德IP定位API返回的数据结构
      const { province, city, district } = response.data;
      
      // 如果城市为空，使用省份作为城市
      const finalCity = city && city.trim() !== '' ? city : province;
      
      return {
        city: finalCity,
        province: province || '',
        district: district || undefined,
      };
    } catch (error) {
      // 类型守卫检查
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get location by IP ${ipAddress}: ${errorMessage}`);
      
      // 如果API调用失败，返回默认位置
      return this.getFallbackLocation();
    }
  }

  /**
   * 验证IP地址格式
   */
  private isValidIpAddress(ip: string): boolean {
    // IPv4 格式验证
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 格式验证
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * 获取备用位置信息
   */
  private getFallbackLocation(): { city: string; province: string; district?: string } {
    return {
      city: '北京市',
      province: '北京市',
      district: '朝阳区',
    };
  }

  /**
   * 根据经纬度获取详细地址信息
   */
  async getLocationByCoordinates(lat: number, lng: number): Promise<{ city: string; province: string; district?: string; address?: string }> {
    if (!this.AMAP_API_KEY) {
      this.logger.warn('AMAP_API_KEY is not configured');
      throw new Error('Geocoding service is not available');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<LocationResponse>(this.AMAP_GEOCODING_URL, {
          params: {
            key: this.AMAP_API_KEY,
            location: `${lng},${lat}`,
            extensions: 'base',
            s: 'rsv3',
          },
        })
      );

      if (response.data.status !== '1') {
        throw new Error('Failed to get location from coordinates');
      }

      const { addressComponent, formatted_address } = response.data.regeocode;
      
      return {
        city: addressComponent.city || '',
        province: addressComponent.province || '',
        district: addressComponent.district || '',
        address: formatted_address,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get location by coordinates (${lat}, ${lng}): ${errorMessage}`);
      throw error;
    }
  }

  /**
   * 获取热门城市列表
   */
  async getPopularCities(limit = 10): Promise<CityDistribution[]> {
    const cities = await this.prisma.hotel.groupBy({
      by: ['city'],
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    return cities.map(city => ({
      city: city.city,
      count: city._count.id,
    }));
  }

  /**
   * 获取所有城市列表（带酒店数量）
   */
  async getAllCitiesWithCount(): Promise<CityDistribution[]> {
    const cities = await this.prisma.hotel.groupBy({
      by: ['city'],
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      _count: {
        id: true,
      },
      orderBy: {
        city: 'asc',
      },
    });

    return cities.map(city => ({
      city: city.city,
      count: city._count.id,
    }));
  }

  /**
   * 搜索城市
   */
  async searchCities(keyword: string): Promise<CityDistribution[]> {
    const cities = await this.prisma.hotel.groupBy({
      by: ['city'],
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        city: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    return cities.map(city => ({
      city: city.city,
      count: city._count.id,
    }));
  }

  /**
   * 检查城市是否存在酒店
   */
  async cityHasHotels(city: string): Promise<boolean> {
    const count = await this.prisma.hotel.count({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
        status: 'PUBLISHED',
        deletedAt: null,
      },
    });

    return count > 0;
  }

  /**
   * 获取城市酒店分布统计
   */
  async getCityHotelDistribution(): Promise<CityDistribution[]> {
    return this.getPopularCities(20);
  }

}