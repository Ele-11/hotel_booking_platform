// 用户功能的入口模块

import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}