import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Category, Gender, Size } from '../type/enum';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProduct: Product = {
     id: 1,
     title: 'Produto Teste',
     price: 100,
     quantity: 10,
     color: 'Red',
     size: Size.M,
     gender: Gender.UNISEX,
     category: Category.CLOTHES,
   };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(mockProduct);

      expect(mockRepository.create).toHaveBeenCalledWith(mockProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockRepository.find.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updatedProduct = { ...mockProduct, quantity: 5 };
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, { quantity: 5 });

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove the product', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});
