import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { QueryHotelsDto } from './dto/query-hotels.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelsService } from './hotels.service';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(@Inject(HotelsService) private readonly hotelsService: HotelsService) {}

  private getUserId(req): string {
    const userId = req?.user?.id ?? req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return userId;
  }

  // 创建酒店
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '创建酒店' })
  @ApiBody({ type: CreateHotelDto })
  @ApiResponse({ status: 201, description: '酒店创建成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async create(@Body() createHotelDto: CreateHotelDto, @Req() req) {
    return this.hotelsService.create(this.getUserId(req), createHotelDto);
  }

  // 获取酒店列表
  @Get()
  @ApiOperation({ summary: '获取酒店列表' })
  @ApiQuery({ type: QueryHotelsDto })
  @ApiResponse({ status: 200, description: '返回酒店列表' })
  async findAll(@Query() query: QueryHotelsDto) {
    return this.hotelsService.findAll(query);
  }

  // 商户获取自己的酒店列表
  @UseGuards(AuthGuard('jwt'))
  @Get('my-hotels')
  @ApiOperation({ summary: '商户获取自己的酒店列表' })
  @ApiResponse({ status: 200, description: '返回商户的酒店列表' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async getUserHotels(@Req() req) {
    return this.hotelsService.getUserHotels(this.getUserId(req));
  }

  // 获取待审核酒店列表
  @UseGuards(AuthGuard('jwt'))
  @Get('pending')
  @ApiOperation({ summary: '获取待审核酒店列表' })
  @ApiResponse({ status: 200, description: '返回待审核酒店列表' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以查看待审核酒店' })
  async getPendingHotels(@Req() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view pending hotels');
    }
    return this.hotelsService.getPendingHotels(this.getUserId(req));
  }

  // 获取单个酒店
  @Get(':id')
  @ApiOperation({ summary: '获取单个酒店详情' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiResponse({ status: 200, description: '返回酒店详情' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  // 获取酒店房型及价格信息
  @Get(':id/room-types')
  @ApiOperation({ summary: '获取酒店房型及价格信息' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiQuery({
    name: 'checkInDate',
    required: false,
    description: '入住日期',
    example: '2023-12-01',
  })
  @ApiQuery({
    name: 'checkOutDate',
    required: false,
    description: '退房日期',
    example: '2023-12-03',
  })
  @ApiQuery({ name: 'guests', required: false, description: '客人数量', example: 2 })
  @ApiResponse({ status: 200, description: '返回房型及价格信息' })
  async getRoomTypes(
    @Param('id') hotelId: string,
    @Query('checkInDate') checkInDate?: string,
    @Query('checkOutDate') checkOutDate?: string,
    @Query('guests') guests?: number
  ) {
    return this.hotelsService.getRoomTypesWithPrices(hotelId, checkInDate, checkOutDate, guests);
  }
  // 检查酒店在指定日期的可用性
  @Get(':id/availability')
  @ApiOperation({ summary: '检查酒店在指定日期的可用性' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiQuery({ name: 'checkInDate', description: '入住日期', example: '2023-12-01' })
  @ApiQuery({ name: 'checkOutDate', description: '退房日期', example: '2023-12-03' })
  @ApiResponse({ status: 200, description: '返回酒店可用性信息' })
  async checkAvailability(
    @Param('id') hotelId: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string
  ) {
    return this.hotelsService.checkHotelAvailability(hotelId, checkInDate, checkOutDate);
  }

  // 更新酒店信息
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: '更新酒店信息' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiBody({ type: UpdateHotelDto })
  @ApiResponse({ status: 200, description: '酒店更新成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto, @Req() req) {
    return this.hotelsService.update(id, this.getUserId(req), updateHotelDto);
  }

  // 删除酒店（软删除）
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '删除酒店（软删除）' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiResponse({ status: 200, description: '酒店删除成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.hotelsService.delete(id, this.getUserId(req));
  }

  // 管理员审核功能
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/approve')
  @ApiOperation({ summary: '审核通过酒店' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiBody({ type: Object, description: '审核通过原因（可选）' })
  @ApiResponse({ status: 200, description: '酒店审核通过成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以审核酒店' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async approveHotel(@Param('id') id: string, @Req() req, @Body('reason') reason?: string) {
    if (req.user.role !== 'ADMIN') {
      throw new Error('Only admins can approve hotels');
    }
    return this.hotelsService.approveHotel(id, req.user.id, reason);
  }

  // 管理员拒绝酒店
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/reject')
  @ApiOperation({ summary: '审核拒绝酒店' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiBody({ type: Object, description: '拒绝原因' })
  @ApiResponse({ status: 200, description: '酒店审核拒绝成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以拒绝酒店' })
  @ApiResponse({ status: 400, description: '拒绝原因不能为空' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async rejectHotel(@Param('id') id: string, @Req() req, @Body('reason') reason: string) {
    if (req.user.role !== 'ADMIN') {
      throw new Error('Only admins can reject hotels');
    }
    return this.hotelsService.rejectHotel(id, req.user.id, reason);
  }

  // 管理员发布酒店
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/publish')
  @ApiOperation({ summary: '发布酒店' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiResponse({ status: 200, description: '酒店发布成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以发布酒店' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async publishHotel(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'ADMIN') {
      throw new Error('Only admins can publish hotels');
    }
    return this.hotelsService.publishHotel(id, req.user.id);
  }

  // 管理员取消发布酒店
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/unpublish')
  @ApiOperation({ summary: '取消发布酒店' })
  @ApiParam({ name: 'id', description: '酒店ID' })
  @ApiResponse({ status: 200, description: '酒店取消发布成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以取消发布酒店' })
  @ApiResponse({ status: 404, description: '酒店不存在' })
  async unpublishHotel(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'ADMIN') {
      throw new Error('Only admins can unpublish hotels');
    }
    return this.hotelsService.unpublishHotel(id, req.user.id);
  }
}
