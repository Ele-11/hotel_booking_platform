import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
// import { AuthModule } from "./modules/auth/auth.module";
// import { BookingsModule } from "./modules/bookings/bookings.module";
// import { HotelsModule } from "./modules/hotels/hotels.module";
// import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    // AuthModule,
    // HotelsModule,
    // BookingsModule,
    // UsersModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}