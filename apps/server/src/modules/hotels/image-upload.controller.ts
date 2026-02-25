import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadImageDto } from './dto/upload-image.dto';
import { HotelsService } from './hotels.service';
import { ImageUploadService } from './image-upload.service';

@ApiTags('Image Upload')
@Controller('images')
export class ImageUploadController {
  constructor(
    private imageUploadService: ImageUploadService,
    private hotelsService: HotelsService,
  ) {}

  // 上传酒店图片，支持指定酒店ID和自定义文件夹路径
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/hotel/:hotelId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传酒店图片' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: '自定义上传文件夹',
          example: 'hotels/123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '图片上传成功' })
  async uploadHotelImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('hotelId') hotelId: string,
    @Body() body?: UploadImageDto,
  ) {
    const imageUrl = await this.imageUploadService.uploadImage(
      file,
      `hotels/${hotelId}`,
    );

    // 更新酒店的图片列表
    await this.imageUploadService.addImageToHotel(hotelId, imageUrl);

    return { imageUrl, message: 'Hotel image uploaded successfully' };
  }

  // 上传房型图片，支持指定房型ID和自定义文件夹路径
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/room-type/:roomTypeId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传房型图片' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '房型图片上传成功' })
  async uploadRoomTypeImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('roomTypeId') roomTypeId: string,
    @Body() body?: UploadImageDto,
  ) {
    const imageUrl = await this.imageUploadService.uploadImage(
      file,
      `room_types/${roomTypeId}`,
    );

    return { imageUrl, message: 'Room type image uploaded successfully' };
  }

  // 通用图片上传接口，支持指定类型和自定义文件夹路径
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/general')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '通用图片上传' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['hotel', 'room_type', 'user_avatar'],
          default: 'hotel',
        },
        folder: {
          type: 'string',
          description: '自定义上传文件夹',
          example: 'custom-folder',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '图片上传成功' })
  async uploadGeneralImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageDto,
  ) {
    const uploadDir = body.folder || `general/${body.type || 'other'}`;
    const imageUrl = await this.imageUploadService.uploadImage(file, uploadDir);

    return { imageUrl, message: 'Image uploaded successfully' };
  }

  // 删除图片接口，支持根据图片ID删除指定图片
  @UseGuards(AuthGuard('jwt'))
  @Delete(':imageId')
  @ApiOperation({ summary: '删除图片' })
  @ApiResponse({ status: 200, description: '图片删除成功' })
  async deleteImage(@Param('imageId') imageId: string) {
    const result = await this.imageUploadService.deleteImage(imageId);
    return { success: result, message: result ? 'Image deleted successfully' : 'Image not found' };
  }

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: '获取酒店图片列表' })
  @ApiResponse({ status: 200, description: '返回酒店图片列表' })
  async getHotelImages(@Param('hotelId') hotelId: string) {
    const hotel = await this.hotelsService.findOne(hotelId);
    return { images: hotel.images || [] };
  }
}