//主要功能：处理酒店预订相关的 HTTP 请求，提供预订管理功能。

import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  //创建预订 - POST /bookings
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '创建预订' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: '预订创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 404, description: '房间类型或酒店不存在' })
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  //查询预订 - GET /bookings
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '查询预订列表' })
  @ApiQuery({ type: QueryBookingsDto })
  @ApiResponse({ status: 200, description: '返回预订列表' })
  @ApiResponse({ status: 401, description: '未认证' })
  async findAll(@Query() query: QueryBookingsDto, @Req() req) {
    return this.bookingsService.findAll(query, req.user.id);
  }

  //获取单个预订 - GET /bookings/:id
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '获取单个预订详情' })
  @ApiParam({ name: 'id', description: '预订ID' })
  @ApiResponse({ status: 200, description: '返回预订详情' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只能查看自己的预订' })
  @ApiResponse({ status: 404, description: '预订不存在' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.bookingsService.findOne(id, req.user.id);
  }

  //取消预订 - PUT /bookings/:id/cancel
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/cancel')
  @ApiOperation({ summary: '取消预订' })
  @ApiParam({ name: 'id', description: '预订ID' })
  @ApiResponse({ status: 200, description: '预订取消成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只能取消自己的预订' })
  @ApiResponse({ status: 404, description: '预订不存在' })
  async cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancel(id, req.user.id);
  }

  //查询用户的所有预订记录 - GET /bookings/my-bookings
  @UseGuards(AuthGuard('jwt'))
  @Get('my-bookings')
  @ApiOperation({ summary: '获取用户的所有预订记录' })
  @ApiResponse({ status: 200, description: '返回用户预订记录' })
  @ApiResponse({ status: 401, description: '未认证' })
  async getUserBookings(@Req() req) {
    return this.bookingsService.getUserBookings(req.user.id);
  }
}