import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Gender, Category } from '../type/enum';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const saved = await this.productRepository.save(product);
    console.log('[DEBUG] Produto salvo:', saved);
    return saved;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find();
    console.log('[DEBUG] Produtos encontrados:', products);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    console.log('[DEBUG] Produto encontrado:', product);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updated = Object.assign(product, updateProductDto);
    return await this.productRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const count = await this.productRepository.count();
    if (count > 2) return; // Already has products

    const sampleProducts = [
      {
        title: 'Terno Milano',
        price: 349.9,
        quantities: { G: 8, M: 10, P: 5, GG: 0 },
        color: 'preto',
        gender: Gender.MALE,
        category: Category.CLOTHES
      },
      {
        title: 'Terno Branco Premium',
        price: 1000,
        quantities: { G: 0, M: 1, P: 0, GG: 100 },
        color: 'branco',
        gender: Gender.MALE,
        category: Category.CLOTHES
      },
      {
        title: 'Camisa Social Azul',
        price: 189.9,
        quantities: { G: 15, M: 20, P: 10, GG: 5 },
        color: 'azul',
        gender: Gender.MALE,
        category: Category.CLOTHES
      },
      {
        title: 'Calça Social Cinza',
        price: 259.9,
        quantities: { G: 12, M: 8, P: 6, GG: 4 },
        color: 'cinza',
        gender: Gender.MALE,
        category: Category.CLOTHES
      },
      {
        title: 'Sapato Oxford Preto',
        price: 399.9,
        quantities: { G: 5, M: 7, P: 3, GG: 2 },
        color: 'preto',
        gender: Gender.MALE,
        category: Category.SHOES
      },
      {
        title: 'Gravata Vermelha',
        price: 89.9,
        quantities: { G: 50, M: 0, P: 0, GG: 0 },
        color: 'vermelho',
        gender: Gender.UNISEX,
        category: Category.ACCESSORIES
      },
      {
        title: 'Vestido Cocktail Rosa',
        price: 599.9,
        quantities: { G: 4, M: 6, P: 8, GG: 2 },
        color: 'rosa',
        gender: Gender.FEMALE,
        category: Category.CLOTHES
      },
      {
        title: 'Blazer Feminino Verde',
        price: 449.9,
        quantities: { G: 0, M: 0, P: 0, GG: 0 },
        color: 'verde',
        gender: Gender.FEMALE,
        category: Category.CLOTHES
      }
    ];

    for (const product of sampleProducts) {
      const exists = await this.productRepository.findOne({
        where: { title: product.title }
      });

      if (!exists) {
        await this.create(product);
      }
    }
  }
}
