import * as fs from 'fs';
import * as path from 'path';

import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { HotelsService } from './hotels.service';

@Injectable()
export class ImageUploadService {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => HotelsService))
    private hotelsService: HotelsService,
  ) {}

  private allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  private maxFileSize = 5 * 1024 * 1024; // 5MB

  async uploadImage(file: Express.Multer.File, uploadDir: string = 'uploads/images'): Promise<string> {
    // 验证文件类型
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 验证文件大小
    if (file.size > this.maxFileSize) {
      throw new HttpException(
        'File size exceeds the limit of 5MB.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 创建上传目录
    const uploadPath = path.join(process.cwd(), 'public', uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadPath, fileName);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    // 返回相对路径或URL
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    return `${baseUrl}/public/${uploadDir}/${fileName}`;
  }

  async deleteImage(imageUrl: string, uploadDir: string = 'uploads/images'): Promise<boolean> {
    try {
      // 从URL中提取文件名
      const fileName = path.basename(imageUrl);
      const filePath = path.join(process.cwd(), 'public', uploadDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // 专门用于更新酒店图片列表的方法
  async addImageToHotel(hotelId: string, imageUrl: string) {
    const hotel = await this.hotelsService.findOne(hotelId);
    const updatedImages = [...(hotel.images || []), imageUrl];
    
    return await this.hotelsService.update(hotelId, hotel.ownerId, { images: updatedImages });
  }

  // 从酒店图片列表中移除图片
  async removeImageFromHotel(hotelId: string, imageUrl: string) {
    const hotel = await this.hotelsService.findOne(hotelId);
    const updatedImages = (hotel.images || []).filter(img => img !== imageUrl);
    
    return await this.hotelsService.update(hotelId, hotel.ownerId, { images: updatedImages });
  }
}