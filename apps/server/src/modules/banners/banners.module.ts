import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  controllers: [BannersController],
  providers: [
    BannersService,
    {
      provide: PrismaService,
      useFactory: () => new PrismaService(),
    },
  ],
  exports: [BannersService],
})
export class BannersModule {}