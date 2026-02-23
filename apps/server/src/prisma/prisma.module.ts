// 将 PrismaService 全局注册到 NestJS 应用，方便所有业务模块安全、统一地访问数据库

import { Global, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}