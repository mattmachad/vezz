import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    name: 'João',
    email: 'joao@example.com',
    password: '123456',
    cep: '17509004',
    city: 'Marília',
    street: 'Rua Teste',
    state: 'SP',
    phone: '11999999999',
  };

  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return user', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      repositoryMock.create.mockReturnValue(mockUser);
      repositoryMock.save.mockResolvedValue(mockUser);

      const result = await service.create(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(repository.create).toHaveBeenCalledWith(mockUser);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      repositoryMock.findOne.mockResolvedValue(mockUser);
      await expect(service.create(mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repositoryMock.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      repositoryMock.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updatedUser = { ...mockUser, name: 'Joãozinho' };
      repositoryMock.findOne.mockResolvedValue(mockUser);
      repositoryMock.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, { name: 'Joãozinho' });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'Joãozinho' }));
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(service.update(2, { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should return removal message', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 user');
    });
  });
});
