import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PurchasedItem } from '../type/purchasedItems';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Buy } from '../buy/entities/buy.entity';
import { BuyService } from '../buy/buy.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly buysService: BuyService,) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }


  @Post('buy')
  @Post('buy')
  async buy(@Body() body: { user: User; products: PurchasedItem[]; payment_type: string }) {
    const { user, products, payment_type } = body;
    const processedProducts = [];
    const results = [];

    for (const item of products) {
      const product = await this.productsService.findOne(item.id);

      if (!product) {
        throw new BadRequestException(`Produto com ID ${item.id} não encontrado`);
      }

      if (!product.quantities[item.size] || product.quantities[item.size] < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.title} no tamanho ${item.size}`);
      }

      const updatedQuantities = {
        ...product.quantities,
        [item.size]: product.quantities[item.size] - item.quantity,
      };

      const updatedProductDto = {
        ...product,
        quantities: updatedQuantities,
      };

      await this.productsService.update(item.id, updatedProductDto);
      const updatedProduct = await this.productsService.findOne(item.id);

      processedProducts.push(updatedProduct);
      results.push({
        message: `Compra do produto ${updatedProduct.title} realizada com sucesso`,
        product: updatedProduct,
      });
    }

    const savedBuy = await this.buysService.create({
      user,
      products: processedProducts,
      payment_type,
    });

    return {
      message: 'Todas as compras foram processadas e registradas com sucesso',
      buy: savedBuy,
      results,
    };
  }

}
