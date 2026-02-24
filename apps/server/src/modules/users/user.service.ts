// 主要功能：用户服务
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 根据邮箱查找用户
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 根据ID查找用户
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // 创建用户
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  // 查找所有用户
  async findAll(): Promise<Array<{
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    status: string;
    createdAt: Date;
  }>> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // 更新用户信息
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // 删除用户（软删除）
  async delete(id: string): Promise<User> {
    return this.prisma.softDelete('User', { where: { id } });
  }
}