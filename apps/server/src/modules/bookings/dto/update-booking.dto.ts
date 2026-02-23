import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  checkInDate?: Date;

  @IsOptional()
  @IsDateString()
  checkOutDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfGuests?: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
