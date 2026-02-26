// NestJS 后端服务的主入口，负责引导NestJS应用的启动和配置
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 安全中间件
  app.use(helmet());

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // 全局前缀
  const globalPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);

  // CORS配置
  // 仅在开发环境中使用更宽松的CORS配置
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: true, // 允许所有来源
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'User-Agent'],
    });
  } else {
    // 生产环境使用更严格的CORS配置
    app.enableCors({
      origin: [
        configService.get<string>('FRONTEND_URL', 'https://your-production-domain.com'),
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'User-Agent'],
    });
  }

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('酒店预订平台 API')
    .setDescription('智慧出行酒店预订平台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/docs', app, document);
  } catch (error) {
    console.error('Swagger setup error:', error);
  }

  // 启动服务
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`🚀 服务已启动: http://localhost:${port}/${globalPrefix}`);
  console.log(`📚 API文档: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('启动失败:', err);
  process.exit(1);
});