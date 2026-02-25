//主要功能: 提供身份验证服务，包括用户验证、登录和注册功能。
import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto'; // 导入 LoginDto
import { RegisterDto } from './dto/register.dto';

// // 添加注册用户的数据传输对象接口
// interface RegisterUserDto {
//   email: string;
//   password: string;
//   username?: string;
//   fullName?: string;
// }

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(JwtService) private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 修改 login 方法参数类型
  async login(loginDto: LoginDto) {
    // 改为接收 LoginDto
    // 先验证用户凭据
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 生成 JWT 载荷
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' }),
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
  async register(registerDto: RegisterDto) {
    const { email, password, username, fullName } = registerDto;
    if (!email || !password) {
      throw new BadRequestException('email 和 password 必填');
    }

    const roleInput = String((registerDto as any).role ?? 'CUSTOMER').toUpperCase();
    const role: 'ADMIN' | 'MERCHANT' | 'CUSTOMER' =
      roleInput === 'ADMIN' || roleInput === 'MERCHANT' || roleInput === 'CUSTOMER'
        ? roleInput
        : 'ADMIN';

    // 用户名兜底（注意：username 也有唯一约束）
    const desiredUsername = String(username ?? email.split('@')[0]);

    // 同时检查 email / username
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username: desiredUsername }] },
      select: { id: true },
    });
    if (exists) {
      throw new ConflictException('邮箱或用户名已被占用');
    }
    // 2. 密码加密（bcrypt）
    const hashedPassword = await bcrypt.hash(password, 10); // 10为盐值轮数

    // 3. 创建用户
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword, // 存储加密后的密码
        username: username || email.split('@')[0], // 兜底用户名
        fullName: fullName || '',
        role,
      },
      select: {
        // 不返回密码
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
      },
    });
    // 4. 返回创建结果（可选：直接返回用户信息，或生成token）
    return {
      message: 'Register success',
      user: newUser,
    };
  }
}
