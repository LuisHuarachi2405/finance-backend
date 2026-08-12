import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins = configService.get<string[]>('cors.origins') ?? [];
  const isProduction =
    configService.get<string>('app.nodeEnv') === 'production';

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : !isProduction,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finance Backend')
    .setDescription('Personal finance management backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);
}

void bootstrap();
