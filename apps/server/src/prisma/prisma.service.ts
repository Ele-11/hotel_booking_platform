// 封装了数据库连接管理和软删除逻辑

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";

type SoftDeletableModel = 'User' | 'Merchant' | 'Hotel' | 'RoomType' | 'PricePlan' | 'NearbyAttraction' | 'Booking' | 'RefreshToken';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    });
  }

  // 在模块初始化时连接数据库
  async onModuleInit() {
    await this.$connect();
  }

  // 在模块销毁时断开数据库连接
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 通用软删除方法
  async softDelete(
    modelName: SoftDeletableModel,
    args: Prisma.UserFindUniqueArgs | Prisma.MerchantFindUniqueArgs | 
           Prisma.HotelFindUniqueArgs | Prisma.RoomTypeFindUniqueArgs |
           Prisma.PricePlanFindUniqueArgs | Prisma.NearbyAttractionFindUniqueArgs |
           Prisma.BookingFindUniqueArgs | Prisma.RefreshTokenFindUniqueArgs
  ) {
    const model = this[modelName];
    
    if (!model) {
      throw new Error(`Model ${modelName} does not exist`);
    }

    return model.update({
      ...args,
      data: { 
        deletedAt: new Date() 
      },
    });
  }

  // 通用软删除多个记录方法
  async softDeleteMany(
    modelName: SoftDeletableModel,
    args: Prisma.UserFindManyArgs | Prisma.MerchantFindManyArgs | 
           Prisma.HotelFindManyArgs | Prisma.RoomTypeFindManyArgs |
           Prisma.PricePlanFindManyArgs | Prisma.NearbyAttractionFindManyArgs |
           Prisma.BookingFindManyArgs | Prisma.RefreshTokenFindManyArgs
  ) {
    const model = this[modelName];
    
    if (!model) {
      throw new Error(`Model ${modelName} does not exist`);
    }

    return model.updateMany({
      ...args,
      data: { 
        deletedAt: new Date() 
      },
    });
  }
}