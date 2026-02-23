import { Injectable } from '@nestjs/common';
import { Booking, User, Hotel, RoomType, BookingStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

interface CreateBookingDto {
  roomTypeId: string;
  hotelId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
}

interface FindAllBookingsQuery {
  hotelId?: string;
  status?: BookingStatus; // 使用Prisma的BookingStatus枚举类型
  sortBy?: keyof Booking;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // 创建预订
  async create(userId: string, bookingData: CreateBookingDto) {

    // 验证用户是否存在且状态正常
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found or inactive');
    }

    // 验证酒店是否存在且已发布
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: bookingData.hotelId, deletedAt: null },
    });

    if (!hotel) {
      throw new Error('Hotel not found');
    }

    if (hotel.status !== 'PUBLISHED') {
      throw new Error('Hotel is not published and cannot accept bookings');
    }

    // 验证房间类型是否存在、属于该酒店且容量足够
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: bookingData.roomTypeId },
    });

    if (!roomType) {
      throw new Error('Room type not found');
    }

    if (roomType.hotelId !== bookingData.hotelId) {
      throw new Error('Room type does not belong to specified hotel');
    }

    if (roomType.capacity < bookingData.numberOfGuests) {
      throw new Error(`Room type cannot accommodate ${bookingData.numberOfGuests} guests`);
    }

    // 获取房间类型的价格信息
    // 计算总价格
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // 获取价格方案
    const pricePlan = await this.prisma.pricePlan.findFirst({
      where: {
        roomTypeId: bookingData.roomTypeId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const pricePerNight = pricePlan ? pricePlan.price : 0;
    const totalPrice = days * pricePerNight;

    return this.prisma.booking.create({
      data: {
        userId,
        hotelId: bookingData.hotelId,
        roomTypeId: bookingData.roomTypeId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.numberOfGuests,
        totalPrice,
        status: 'PENDING',
      },
    });
  }


  
  // 获取用户的所有预订（管理员使用）
  async findAll(query: FindAllBookingsQuery, userId: string) {
    const {
      hotelId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: {
      userId: string;
      deletedAt: null;
      hotelId?: string;
      status?: BookingStatus;
    } = {
      userId,
      deletedAt: null,
    };

    if (hotelId) {
      where.hotelId = hotelId;
    }

    if (status) {
      where.status = status; // 现在类型匹配了
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          hotel: {
            select: {
              id: true,
              name: true,
              englishName: true,
              address: true,
            },
          },
          roomType: {
            select: {
              id: true,
              name: true,
              capacity: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
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

  // 获取特定预订详情
  async findOne(id: string, userId: string) {
    return this.prisma.booking.findFirst({
      where: {
        id,
        userId,
        deletedAt: null, // 添加软删除过滤
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          }
        },
        hotel: {
          select: {
            id: true,
            name: true,
            englishName: true,
            address: true,
            city: true,
            country: true,
            starRating: true,
            amenities: true,
            images: true,
          }
        },
        roomType: {
          select: {
            id: true,
            name: true,
            description: true,
            capacity: true,
            bedType: true,
            amenities: true,
            images: true,
          }
        },
      },
    });
  }

  // 取消预订
  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { 
        id, 
        userId,
        deletedAt: null // 确保只查找未被软删除的预订
      },
      include: {
        user: { 
          select: { 
            id: true, 
            status: true 
          } 
        },
        hotel: { 
          select: { 
            id: true, 
            status: true 
          } 
        },
      }
    });

    if (!booking) {
      throw new Error('Booking not found or unauthorized');
    }

    // 额外验证 
    if (booking.user?.status !== 'ACTIVE') { 
      throw new Error('User account is not active'); 
    } 

    if (booking.hotel?.status !== 'PUBLISHED') {
      throw new Error('Hotel is not active'); 
    } 

    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') { 
      throw new Error('Cannot cancel this booking'); 
    } 

    // 检查是否临近入住日期 
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate); // 确保是 Date 对象
    const timeDiff = checkInDate.getTime() - now.getTime();
    const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
  
    if (daysUntilCheckIn <= 1 && booking.status === 'CONFIRMED') { 
      throw new Error('Cannot cancel booking within 24 hours of check-in'); 
    } 

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  // 查询用户的所有预订记录（用户使用）
  async getUserBookings(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
  
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          userId,
          deletedAt: null,  // 添加软删除过滤
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              images: true,
            }
          },
          roomType: {
            select: {
              id: true,
              name: true,
              images: true,
            }
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          userId,
          deletedAt: null,
        }
      })
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}