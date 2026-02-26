import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }
  
  private readonly prisma: PrismaService;

  async getSortOptions() {
    try {
      return {
        message: 'success',
        data: {
          options: [
            { label: '欢迎度排序', value: 'popular' },
            { label: '好评优先', value: 'score_desc' },
            { label: '低价优先', value: 'price_asc' },
            { label: '高价优先', value: 'price_desc' },
            { label: '距离优先', value: 'distance_asc' },
          ],
        },
      };
    } catch (error) {
      console.error('获取排序选项失败:', error);
      // 返回默认选项
      return {
        message: 'success',
        data: {
          options: [
            { label: '欢迎度排序', value: 'popular' },
            { label: '好评优先', value: 'score_desc' },
            { label: '低价优先', value: 'price_asc' },
            { label: '高价优先', value: 'price_desc' },
            { label: '距离优先', value: 'distance_asc' },
          ],
        },
      };
    }
  }

  async getLocationOptions() {
    try {
      // 从数据库获取有酒店的城市列表
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
        take: 10,
      });

      const options = [
        { label: '不限', value: 'all' },
        ...cities.map(city => ({
          label: city.city,
          value: city.city.toLowerCase().replace(/\s+/g, '_'),
        })),
      ];

      return {
        message: 'success',
        data: {
          options,
        },
      };
    } catch (error) {
      console.error('获取位置选项失败:', error);
      // 如果数据库查询失败，返回默认选项
      return {
        message: 'success',
        data: {
          options: [
            { label: '不限', value: 'all' },
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
            { label: '成都', value: 'chengdu' },
            { label: '杭州', value: 'hangzhou' },
            { label: '三亚', value: 'sanya' },
          ],
        },
      };
    }
  }

  async getPriceOptions() {
    try {
      return {
        message: 'success',
        data: {
          options: [
            { label: '¥150以下', value: '0-150' },
            { label: '¥150-300', value: '150-300' },
            { label: '¥300-450', value: '300-450' },
            { label: '¥450-600', value: '450-600' },
            { label: '¥600-1000', value: '600-1000' },
            { label: '¥1000以上', value: '1000-99999' },
          ],
        },
      };
    } catch (error) {
      console.error('获取价格选项失败:', error);
      // 返回默认选项
      return {
        message: 'success',
        data: {
          options: [
            { label: '¥150以下', value: '0-150' },
            { label: '¥150-300', value: '150-300' },
            { label: '¥300-450', value: '300-450' },
            { label: '¥450-600', value: '450-600' },
            { label: '¥600-1000', value: '600-1000' },
            { label: '¥1000以上', value: '1000-99999' },
          ],
        },
      };
    }
  }

  async getFeatureOptions() {
    try {
      // 从数据库获取所有唯一的标签
      const hotels = await this.prisma.hotel.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
        },
        select: {
          tags: true,
        },
      });

      // 提取所有唯一标签
      const allTags = hotels.reduce((tags, hotel) => {
        // 确保tags存在且是数组
        if (hotel.tags && Array.isArray(hotel.tags)) {
          return [...tags, ...hotel.tags];
        }
        return tags;
      }, [] as string[]);

      const uniqueTags = [...new Set(allTags)];

      // 转换为选项格式，并添加一些常见选项
      const options = [
        { label: '免费取消', value: 'free_cancel' },
        { label: '即时确认', value: 'instant_confirm' },
        { label: '含早餐', value: 'breakfast' },
        { label: '免费停车', value: 'parking' },
        { label: '健身房', value: 'gym' },
        { label: '游泳池', value: 'pool' },
        ...uniqueTags.map(tag => ({
          label: tag,
          value: tag.toLowerCase().replace(/\s+/g, '_'),
        })),
      ];

      return {
        message: 'success',
        data: {
          options,
        },
      };
    } catch (error) {
      console.error('获取设施选项失败:', error);
      // 如果出错，返回默认选项
      return {
        message: 'success',
        data: {
          options: [
            { label: '免费取消', value: 'free_cancel' },
            { label: '即时确认', value: 'instant_confirm' },
            { label: '含早餐', value: 'breakfast' },
            { label: '免费停车', value: 'parking' },
            { label: '健身房', value: 'gym' },
            { label: '游泳池', value: 'pool' },
          ],
        },
      };
    }
  }
}