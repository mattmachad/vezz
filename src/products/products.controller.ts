import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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

 @Post('buy/:id')
async buy(@Param('id') id: string) {
  const parsedId = parseInt(id);
  
  if (isNaN(parsedId)) {
    return { error: 'ID inválido' };
  }

  const product = await this.productsService.findOne(parsedId);
  console.log(product);

  if (!product) {
    return { message: 'Produto não encontrado' };
  }

  if (product.quantity <= 0) {
    return { message: 'Produto sem estoque disponível' };
  }

  const updatedProductDto = { ...product, quantity: product.quantity - 1 };
  await this.productsService.update(parsedId, updatedProductDto);

  const updatedProduct = await this.productsService.findOne(parsedId);
  return {
    message: 'Compra realizada com sucesso',
    product: updatedProduct,
  };
}


}
