import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:8000",
    credentials: true
  });
  app.use('/upload/previews', express.static(join(__dirname, '..', 'upload/previews')))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
