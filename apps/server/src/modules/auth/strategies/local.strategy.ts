// 主要功能：本地认证策略
// 用于处理用户名密码登录认证，验证用户凭据并返回用户信息

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

// 定义认证用户的接口
interface AuthenticatedUser {
  id: string;
  email: string;
  // 根据实际返回的数据结构添加其他必要字段
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });  // 使用email作为用户名字段
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;  // 返回验证成功的用户信息
  }
}