import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
<<<<<<< HEAD
  providers: [
    AuthService,
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService, userService: UserService) => {
        return new JwtStrategy(configService, userService);
      },
      inject: [ConfigService, UserService],
    },
    LocalStrategy,
    UserService,
    ConfigService,
  ],
=======
>>>>>>> 165f9c0f7b184d6f403c68eb3f3346b03caf3b53
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, UserService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
