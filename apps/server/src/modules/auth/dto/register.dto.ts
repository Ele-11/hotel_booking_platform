// 主要功能：注册验证DTO

/*
数据格式规范：规定了注册请求必须包含的字段
  email：用户邮箱
  username：用户名
  fullName：真实姓名
  password：用户密码
  role：用户角色
*/

import { UserRole } from '@prisma/client';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 50)
  username: string;

  @IsString()
  @Length(2, 50)
  fullName: string;

  @IsString()
  @Length(8, 100)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
