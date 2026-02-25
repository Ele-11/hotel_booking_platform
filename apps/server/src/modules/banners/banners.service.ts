import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  // 创建广告
  async create(createBannerDto: CreateBannerDto) { 
    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        position: createBannerDto.position ?? 0,
        isActive: createBannerDto.isActive ?? true,
      },
    });
  }

  // 获取广告列表（带分页）
  async findAll(query: QueryBannerDto) {
    const {
      title,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'position',
      sortOrder = 'asc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.BannerWhereInput = {};
    
    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // 时间范围筛选
    const now = new Date();
    where.OR = [
      { startDate: null, endDate: null },
      { startDate: { lte: now }, endDate: { gte: now } },
      { startDate: { lte: now }, endDate: null },
      { startDate: null, endDate: { gte: now } },
    ];

    const [data, total] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.banner.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取公开广告（仅活跃且在有效期内）
  async findPublic() {
    const now = new Date();
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
        ],
      },
      orderBy: {
        position: 'asc',
      },
    });
  }

  // 获取单个广告
  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  // 更新广告
  async update(id: string, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id); // 验证广告是否存在

    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  // 删除广告（软删除）
  async delete(id: string) {
    await this.findOne(id); // 验证广告是否存在

    return this.prisma.banner.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 记录点击并返回目标URL
  async recordClickAndGetTargetUrl(id: string) {
    const banner = await this.findOne(id);

    // 更新点击计数（如果字段存在）
    try {
      await this.prisma.banner.update({
        where: { id },
        data: {
          clickCount: { increment: 1 }, // 如果有clickCount字段的话
        },
      });
    } catch (error) {
      // 如果clickCount字段不存在，则跳过
    }

    return banner.targetUrl;
  }
}