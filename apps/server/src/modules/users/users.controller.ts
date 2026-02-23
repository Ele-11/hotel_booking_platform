// 用户功能的控制器，定义了用户相关的 API 端点

import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  // 获取所有用户（需要 JWT 认证）
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @ApiOperation({ summary: '获取所有用户' })
  @ApiResponse({ status: 200, description: '返回所有用户列表' })
  @ApiResponse({ status: 401, description: '未认证' })
  async getAllUsers() {
    return this.userService.findAll();
  }

  // 根据ID获取用户
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '返回用户信息' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // 根据邮箱获取用户
  @UseGuards(AuthGuard('jwt'))
  @Get('email/:email')
  @ApiOperation({ summary: '根据邮箱获取用户' })
  @ApiParam({ name: 'email', description: '用户邮箱' })
  @ApiResponse({ status: 200, description: '返回用户信息' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  // 创建用户
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  // 更新用户信息
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: '用户更新成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  // 删除用户（软删除）
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '删除用户（软删除）' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  @ApiResponse({ status: 401, description: '未认证' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}