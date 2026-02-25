import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Hotel, User, UserRole, HotelStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  // 创建酒店
  async create(userId: string, hotelData: CreateHotelDto) {
    const { nameZh, nameEn, ...otherData } = hotelData;
    return this.prisma.hotel.create({
      data: {
        ...otherData,
        name: nameZh,
        englishName: nameEn,
        status: HotelStatus.PENDING, // 新创建的酒店默认为待审核状态
        owner: { connect: { id: userId } },
      },
    });
  }

  // 调试方法 - 获取所有酒店（包括未发布的）
  async debugFindAll() {
    return this.prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        status: true,
        deletedAt: true,
        createdAt: true,
      },
    });
  }

  // 获取酒店列表
  async findAll(query: QueryHotelsDto) {
    const {
      keyword,
      city,
      starRatings,
      minPrice,
      maxPrice,
      checkInDate,
      checkOutDate,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      status: HotelStatus.PUBLISHED,
      deletedAt: null,
    };

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { englishName: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    console.log('starRatings参数:', starRatings, typeof starRatings, Array.isArray(starRatings));
    if (starRatings && Array.isArray(starRatings) && starRatings.length > 0) {
      where.starRating = { in: starRatings.map(Number) };
    } else if (starRatings && !Array.isArray(starRatings)) {
      // 如果是单个值，转换为数组
      where.starRating = { in: [Number(starRatings)] };
    }

    // 标签筛选
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // 酒店标签筛选
      where.tags = { hasSome: tags };
    }

    // 价格筛选
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.roomTypes = {
        some: {
          pricePlans: {
            some: {
              ...(minPrice !== undefined && { price: { gte: Number(minPrice) } }),
              ...(maxPrice !== undefined && { price: { lte: Number(maxPrice) } }),
            },
          },
          // 日期筛选：假设房型有 availableFrom/availableTo 字段
          ...(checkInDate && checkOutDate
            ? {
                availableFrom: { lte: checkInDate },
                availableTo: { gte: checkOutDate },
              }
            : {}),
        },
      };
    } else if (checkInDate && checkOutDate) {
      // 只筛选日期
      where.roomTypes = {
        some: {
          availableFrom: { lte: checkInDate },
          availableTo: { gte: checkOutDate },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          roomTypes: {
            include: {
              pricePlans: true,
            },
          },
        },
      }),
      this.prisma.hotel.count({ where }),
    ]);

    console.log('查询结果:', { data: data.length, total });
    console.log('第一个酒店:', data[0]);

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

  // 获取酒店详情
  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        owner: true,
        roomTypes: {
          include: {
            pricePlans: true,
          },
        },
        nearbyAttractions: true,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  // 更新酒店信息
  async update(id: string, userId: string, hotelData: UpdateHotelDto) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查用户是否有权限更新此酒店
    if (hotel.ownerId !== userId) {
      throw new UnauthorizedException('Unauthorized to update this hotel');
    }

    // 如果酒店已被审核通过，更新后需要重新设为待审核状态
    let updatedStatus = hotel.status;
    if (hotel.status === HotelStatus.UNPUBLISHED || hotel.status === HotelStatus.PUBLISHED) {
      updatedStatus = HotelStatus.PENDING;
    }

    return this.prisma.hotel.update({
      where: { id },
      data: {
        ...hotelData,
        status: updatedStatus,
      },
    });
  }

  // 删除酒店（软删除）
  async delete(id: string, userId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查用户是否有权限删除此酒店
    if (hotel.ownerId !== userId) {
      throw new UnauthorizedException('Unauthorized to delete this hotel');
    }

    // 使用更安全的软删除方法
    return this.prisma.hotel.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 管理员审核功能
  async approveHotel(hotelId: string, adminId: string, auditReason?: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否为管理员
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (adminUser?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only administrators can approve hotels');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status: HotelStatus.PUBLISHED,
        auditReason,
      },
    });
  }

  // 管理员拒绝酒店审核
  async rejectHotel(hotelId: string, adminId: string, reason: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否为管理员
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (adminUser?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only administrators can reject hotels');
    }

    if (!reason) {
      throw new BadRequestException('Reason for rejection is required');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status: HotelStatus.REJECTED,
        auditReason: reason,
      },
    });
  }

  // 管理员发布酒店（设为已发布状态）
  async publishHotel(hotelId: string, adminId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否为管理员
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (adminUser?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only administrators can publish hotels');
    }

    if (hotel.status !== HotelStatus.PUBLISHED) {
      throw new BadRequestException('Hotel must be PUBLISHED before publishing');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status: HotelStatus.PUBLISHED,
      },
    });
  }

  // 管理员取消发布酒店（设为未发布状态）
  async unpublishHotel(hotelId: string, adminId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 检查是否为管理员
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (adminUser?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only administrators can unpublish hotels');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status: HotelStatus.UNPUBLISHED,
      },
    });
  }

  // 获取待审核的酒店列表
  async getPendingHotels(adminId: string) {
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (adminUser?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only administrators can view pending hotels');
    }

    return this.prisma.hotel.findMany({
      where: {
        status: HotelStatus.PENDING,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 商户获取自己的酒店列表
  async getUserHotels(userId: string) {
    return this.prisma.hotel.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 获取酒店房型及价格信息
  async getRoomTypesWithPrices(
    hotelId: string,
    checkInDate?: string,
    checkOutDate?: string,
    guests?: number
  ) {
    // 查询酒店及其房型信息
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        roomTypes: {
          where: {
            // 如果提供了客人数量，筛选容量足够的房型
            ...(guests && { capacity: { gte: parseInt(guests.toString()) } }),
          },
          include: {
            pricePlans: {
              where: {
                isActive: true,
                // 如果提供了日期，可以基于日期筛选价格
                ...(checkInDate && {
                  OR: [{ startDate: { lte: new Date(checkInDate) } }, { startDate: null }],
                  ...(checkOutDate && {
                    OR: [{ endDate: { gte: new Date(checkOutDate) } }, { endDate: null }],
                  }),
                }),
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // 计算每个房型的实时价格和库存状态
    const roomTypesWithPrices = await Promise.all(
      hotel.roomTypes.map(async (roomType) => {
        // 获取最相关的价格计划（通常是最新或活动中的）
        const pricePlan = roomType.pricePlans[0]; // 默认取最新的价格计划

        // 计算价格（如果有具体日期，可以根据日期计算）
        const price = pricePlan ? pricePlan.price : 0;

        // 检查房型在指定日期的可用性
        let isAvailable = true; // 默认为可用

        if (checkInDate && checkOutDate) {
          isAvailable = await this.isRoomTypeAvailable(
            roomType.id,
            new Date(checkInDate),
            new Date(checkOutDate)
          );
        }

        return {
          ...roomType,
          currentPrice: price,
          isAvailable,
          originalPricePlans: roomType.pricePlans, // 保留原始价格计划信息
        };
      })
    );

    return {
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomTypes: roomTypesWithPrices,
    };
  }

  // 检查房型在指定日期是否可用
  async isRoomTypeAvailable(
    roomTypeId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<boolean> {
    // 查询在指定日期范围内是否有其他预订占用了该房型
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        roomTypeId,
        // 检查日期重叠：新入住日期早于现有退房日期 AND 新退房日期晚于现有入住日期
        checkInDate: { lt: checkOutDate },
        checkOutDate: { gt: checkInDate },
        status: { in: ['PENDING', 'CONFIRMED'] }, // 只考虑有效的预订
      },
    });

    // 如果没有冲突的预订，则房型可用
    return !conflictingBooking;
  }

  // 检查酒店在指定日期的可用性
  async checkHotelAvailability(hotelId: string, checkInDate: string, checkOutDate: string) {
    const parsedCheckInDate = new Date(checkInDate);
    const parsedCheckOutDate = new Date(checkOutDate);

    // 获取酒店的所有房型
    const roomTypes = await this.prisma.roomType.findMany({
      where: {
        hotelId,
      },
    });

    // 检查每个房型的可用性
    const availabilityResults = [];

    for (const roomType of roomTypes) {
      const isAvailable = await this.isRoomTypeAvailable(
        roomType.id,
        parsedCheckInDate,
        parsedCheckOutDate
      );

      availabilityResults.push({
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        isAvailable,
      });
    }

    // 检查酒店整体是否可用（至少有一个房型可用）
    const isHotelAvailable = availabilityResults.some((result) => result.isAvailable);

    return {
      hotelId,
      checkInDate,
      checkOutDate,
      isHotelAvailable,
      roomTypesAvailability: availabilityResults,
    };
  }
}