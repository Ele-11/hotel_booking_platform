import { Controller, forwardRef, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionsService } from './options.service';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  private readonly logger = new Logger(OptionsController.name);
  
  constructor(@Inject(forwardRef(() => OptionsService)) private readonly optionsService: OptionsService) {
    this.logger.log('OptionsController initialized');
    this.logger.log('OptionsService injected:', !!this.optionsService);
  }

  @Get('sort')
  @ApiOperation({ summary: '获取排序选项' })
  @ApiResponse({ status: 200, description: '返回排序选项列表' })
  async getSortOptions() {
    this.logger.log('getSortOptions called');
    this.logger.log('optionsService exists:', !!this.optionsService);
    if (!this.optionsService) {
      this.logger.error('optionsService is not defined!');
      throw new Error('OptionsService is not defined');
    }
    return this.optionsService.getSortOptions();
  }

  @Get('location')
  @ApiOperation({ summary: '获取位置选项' })
  @ApiResponse({ status: 200, description: '返回位置选项列表' })
  async getLocationOptions() {
    return this.optionsService.getLocationOptions();
  }

  @Get('price')
  @ApiOperation({ summary: '获取价格选项' })
  @ApiResponse({ status: 200, description: '返回价格选项列表' })
  async getPriceOptions() {
    return this.optionsService.getPriceOptions();
  }

  @Get('feature')
  @ApiOperation({ summary: '获取设施选项' })
  @ApiResponse({ status: 200, description: '返回设施选项列表' })
  async getFeatureOptions() {
    return this.optionsService.getFeatureOptions();
  }
}