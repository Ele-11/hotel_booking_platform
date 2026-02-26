// 用户功能的入口模块

import { Module } from '@nestjs/common';
<<<<<<< HEAD


=======
import { PrismaService } from '../../prisma/prisma.service';
>>>>>>> 165f9c0f7b184d6f403c68eb3f3346b03caf3b53
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
