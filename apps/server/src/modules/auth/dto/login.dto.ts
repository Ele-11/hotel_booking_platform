//主要功能：登录验证DTO

/*
数据格式规范：规定了登录请求必须包含的字段
  email：用户邮箱
  password：用户密码
*/

import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()  // 验证邮箱格式是否正确
  email: string;

  @IsString()  // 验证是字符串类型
  @Length(8, 100)  // 验证长度在 8-100 个字符之间
  password: string;
}