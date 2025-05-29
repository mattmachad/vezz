import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Gender, Category } from '../type/enum';
import { CloudinaryService } from '../clodinary/clodinary.service';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    const defaultPicture: string = process.env.DEFAULT_PRODUCT_PICTURE;
    let imageUrl: string = defaultPicture;

    if (file && file.buffer && file.size > 0) {
      const uploadResult: UploadApiResponse | UploadApiErrorResponse = await this.cloudinaryService.uploadImage({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      });

      if ('secure_url' in uploadResult) {
        imageUrl = uploadResult.secure_url;
      }
    }

    const product: Product = this.productRepository.create({
      ...createProductDto,
      picture: imageUrl,
    });

    const saved: Product = await this.productRepository.save(product);

    console.log('[DEBUG] Produto salvo com imagem:', saved);
    return saved;
  }

  async findAll(): Promise<Product[]> {
    const products: Product[] = await this.productRepository.find();
    console.log('[DEBUG] Produtos encontrados:', products);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product: Product | null = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    console.log('[DEBUG] Produto encontrado:', product);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product: Product = await this.findOne(id);
    const updated: Product = Object.assign(product, updateProductDto);
    return await this.productRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const product: Product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async onModuleInit(): Promise<void> {
    await this.seedProducts();
  }

  private async seedProducts(): Promise<void> {
    const count: number = await this.productRepository.count();
    if (count > 2) return;

    const sampleProducts: CreateProductDto[] = [
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
      const exists: Product | null = await this.productRepository.findOne({
        where: { title: product.title }
      });

      if (!exists) {
        await this.create(product);
      }
    }
  }
}
