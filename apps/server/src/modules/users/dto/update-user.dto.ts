// 更新用户 DTO

import { UserRole } from '@prisma/client';
import { UserStatus } from '@prisma/client';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  status?: UserStatus;
}
