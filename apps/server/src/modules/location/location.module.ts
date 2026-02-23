import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LocationController],
  providers: [LocationService, PrismaService],
  exports: [LocationService],
})
export class LocationModule {}