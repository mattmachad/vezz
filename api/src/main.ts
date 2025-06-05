import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../database/data-source';

async function bootstrap() {
  try {
    await AppDataSource.initialize();

    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    throw error;
  }
}

bootstrap();
