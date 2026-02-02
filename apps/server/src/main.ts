import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 安全中间件
//   app.use(helmet());

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // 全局前缀
  const globalPrefix = configService.get<string>("API_PREFIX", "api");
  app.setGlobalPrefix(globalPrefix);

  // CORS配置
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL", "http://localhost:5173"),
    credentials: true,
  });

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle("酒店预订平台 API")
    .setDescription("智慧出行酒店预订平台接口文档")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // 启动服务
  const port = configService.get<number>("PORT", 3001);
  await app.listen(port);
  console.log(`🚀 服务已启动: http://localhost:${port}/${globalPrefix}`);
  console.log(`📚 API文档: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error("启动失败:", err);
  process.exit(1);
});