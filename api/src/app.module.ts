import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ClodinaryModule } from './clodinary/clodinary.module';
import { BuyModule } from './buy/buy.module';
import { Buy } from './buy/entities/buy.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product, Buy],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    ClodinaryModule,
    BuyModule,
  ],
})
export class AppModule { }
