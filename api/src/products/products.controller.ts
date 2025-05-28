import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Size } from '../type/enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
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

  @Post('buy/:id/:size')
  async buy(@Param('id') id: string, @Param('size') size: Size) {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido');
    }

    const product = await this.productsService.findOne(parsedId);

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    if (!product.quantities[size] || product.quantities[size] <= 0) {
      throw new BadRequestException('Produto sem estoque disponível para este tamanho');
    }

    // Create a new quantities object with the updated quantity
    const updatedQuantities = {
      ...product.quantities,
      [size]: product.quantities[size] - 1
    };

    const updatedProductDto = {
      ...product,
      quantities: updatedQuantities
    };

    await this.productsService.update(parsedId, updatedProductDto);

    const updatedProduct = await this.productsService.findOne(parsedId);
    return {
      message: 'Compra realizada com sucesso',
      product: updatedProduct,
    };
  }
}
