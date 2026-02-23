//主要功能: 提供身份验证服务，包括用户验证、登录和注册功能。

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UserService } from '../users/user.service';

import { LoginDto } from './dto/login.dto'; // 导入 LoginDto

// 添加注册用户的数据传输对象接口
interface RegisterUserDto {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 修改 login 方法参数类型
  async login(loginDto: LoginDto) {  // 改为接收 LoginDto
    // 先验证用户凭据
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials'); // 或抛出适当的异常
    }

    // 生成 JWT 载荷
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      ),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // 注册用户
  async register(userData: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
      username: userData.username || userData.email.split('@')[0],
      fullName: userData.fullName || '',
    });

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      ),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}