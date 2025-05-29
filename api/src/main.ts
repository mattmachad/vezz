import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../database/data-source';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com o banco de dados estabelecida');

    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Aplicação rodando na porta ${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  }
}

bootstrap();
