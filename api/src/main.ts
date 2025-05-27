import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../database/data-source';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com o banco de dados estabelecida');

    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: true, // Allow all origins in development
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    });

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log(`🚀 Aplicação rodando na porta ${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  }
}

bootstrap();
