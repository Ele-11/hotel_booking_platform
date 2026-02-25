// 主要功能：更新密码验证DTO

/*
数据格式规范：规定了密码更新请求必须包含的字段
  currentPassword：当前密码
  newPassword：新密码
*/

import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(8, 100)
  currentPassword: string;

  @IsString()
  @Length(8, 100)
  newPassword: string;
}