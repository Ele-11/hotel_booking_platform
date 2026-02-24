// 主要功能：JWT认证策略
// 用于验证请求中的JWT令牌，提取用户信息并加载到当前请求中

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/user.service';

// 定义JWT载荷接口
interface JwtPayload {
  sub: string; // 用户ID
  email?: string;
  iat?: number; // 发行时间
  exp?: number; // 过期时间
  [key: string]: unknown; // 支持其他可选字段
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const jwtSecret = configService.get('JWT_SECRET');
    // 构造函数配置JWT策略
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // 从 Authorization: Bearer <token> 提取
      ignoreExpiration: false,  // 不忽略过期时间
      secretOrKey: jwtSecret,  // 使用环境变量中的密钥
    });
  }

  // 验证方法：根据JWT载荷中的用户ID查找用户信息
  async validate(payload: JwtPayload) {
    return await this.userService.findById(payload.sub);
  }
}