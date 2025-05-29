import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Product } from '../src/products/entities/product.entity';
import { Buy } from '../src/buy/entities/buy.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Buy, Product, User],
  migrations: [],
  subscribers: [],
});