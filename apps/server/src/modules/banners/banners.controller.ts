// apps/server/src/modules/banners/banners.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  // 创建广告（需要管理员权限）
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '创建广告' })
  @ApiBody({ type: CreateBannerDto })
  @ApiResponse({ status: 201, description: '广告创建成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以创建广告' })
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  // 获取广告列表（需要管理员权限）
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '获取广告列表' })
  @ApiQuery({ type: QueryBannerDto })
  @ApiResponse({ status: 200, description: '返回广告列表' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以获取广告列表' })
  async findAll(@Query() query: QueryBannerDto) {
    return this.bannersService.findAll(query);
  }

  // 获取公开广告（无需权限）
  @Get('public')
  @ApiOperation({ summary: '获取公开广告' })
  @ApiResponse({ status: 200, description: '返回公开广告列表' })
  async findPublic() {
    return this.bannersService.findPublic();
  }

  // 获取单个广告（需要管理员权限）
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '获取单个广告详情' })
  @ApiParam({ name: 'id', description: '广告ID' })
  @ApiResponse({ status: 200, description: '返回广告详情' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以获取广告详情' })
  @ApiResponse({ status: 404, description: '广告不存在' })
  async findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  // 更新广告（需要管理员权限）
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: '更新广告' })
  @ApiParam({ name: 'id', description: '广告ID' })
  @ApiBody({ type: UpdateBannerDto })
  @ApiResponse({ status: 200, description: '广告更新成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以更新广告' })
  @ApiResponse({ status: 404, description: '广告不存在' })
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannersService.update(id, updateBannerDto);
  }

  // 删除广告（需要管理员权限）
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '删除广告' })
  @ApiParam({ name: 'id', description: '广告ID' })
  @ApiResponse({ status: 200, description: '广告删除成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 403, description: '权限不足，只有管理员可以删除广告' })
  @ApiResponse({ status: 404, description: '广告不存在' })
  async delete(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }

  // 记录点击并跳转
  @Get(':id/click')
  @ApiOperation({ summary: '记录广告点击并跳转' })
  @ApiParam({ name: 'id', description: '广告ID' })
  @ApiResponse({ status: 200, description: '返回跳转URL或提示信息' })
  @ApiResponse({ status: 404, description: '广告不存在' })
  async recordClick(@Param('id') id: string): Promise<{ redirectUrl?: string, message: string }> {
    const targetUrl = await this.bannersService.recordClickAndGetTargetUrl(id);
    
    if (targetUrl) {
      return { redirectUrl: targetUrl, message: 'Redirecting...' };
    }
    
    return { message: 'No target URL configured for this banner' };
  }
}