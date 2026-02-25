import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/user.service';

interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserService) private readonly userService: UserService
  ) {
    const jwtSecret = configService.get('JWT_SECRET');
    // console.log('JWT_SECRET:', jwtSecret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // async validate(payload: JwtPayload) {
  //   return await this.userService.findById(payload.sub);
  // }
  async validate(payload: JwtPayload) {
    console.log('Decoded JWT Payload:', payload); // 打印解码后的 payload
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      console.error('User not found for ID:', payload.sub); // 打印错误日志
      throw new UnauthorizedException('用户未认证');
    }
    console.log('Authenticated User:', user); // 打印找到的用户信息
    return user;
  }
}
