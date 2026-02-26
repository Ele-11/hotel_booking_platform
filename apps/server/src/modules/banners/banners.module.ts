import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  controllers: [BannersController],
<<<<<<< HEAD
  providers: [BannersService],
=======
  providers: [
    BannersService,
    {
      provide: PrismaService,
      useFactory: () => new PrismaService(),
    },
  ],
>>>>>>> 165f9c0f7b184d6f403c68eb3f3346b03caf3b53
  exports: [BannersService],
})
export class BannersModule {}