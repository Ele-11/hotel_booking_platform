// 后端服务的“总入口”，整合和组织所有核心功能模块

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { AuthModule } from "./modules/auth/auth.module";
import { BannersModule } from "./modules/banners/banners.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { HotelsModule } from "./modules/hotels/hotels.module";
import { LocationModule } from './modules/location/location.module';
import { OptionsModule } from './modules/options/options.module';
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    PrismaModule,
    AuthModule,
    HotelsModule,
    BookingsModule,
    BannersModule,
    UsersModule,
    LocationModule,
    OptionsModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}