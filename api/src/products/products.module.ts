import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClodinaryModule } from '../clodinary/clodinary.module';
import { BuyModule } from '../buy/buy.module';

@Module({
  imports: [
    BuyModule,
    TypeOrmModule.forFeature([Product]),
    ClodinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
