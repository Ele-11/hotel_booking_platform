import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ImageUploadType {
  HOTEL = 'hotel',
  ROOM_TYPE = 'room_type',
  USER_AVATAR = 'user_avatar',
}

export class UploadImageDto {
  @IsString()
  @IsOptional()
  @IsEnum(ImageUploadType)
  type?: ImageUploadType = ImageUploadType.HOTEL;

  @IsString()
  @IsOptional()
  folder?: string;
}