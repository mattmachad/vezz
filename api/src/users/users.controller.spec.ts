import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return user', async () => {
      usersServiceMock.create.mockResolvedValue(mockUser);
      const result = await controller.create(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      usersServiceMock.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      usersServiceMock.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersServiceMock.findOne.mockImplementation(() => {
        throw new NotFoundException('Usuário não encontrado');
      });
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updatedUser = { ...mockUser, name: 'Joãozinho' };
      usersServiceMock.update.mockResolvedValue(updatedUser);
      const result = await controller.update('1', { name: 'Joãozinho' });
      expect(service.update).toHaveBeenCalledWith(1, { name: 'Joãozinho' });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      usersServiceMock.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      usersServiceMock.findAll.mockResolvedValue([mockUser]);
      const result = await controller.login({ name: 'João', password: '123456' });
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Login bem-sucedido', user: mockUser });
    });

    it('should fail login with invalid credentials', async () => {
      usersServiceMock.findAll.mockResolvedValue([mockUser]);
      const result = await controller.login({ name: 'João', password: 'wrongpass' });
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Login falhou: usuário ou senha incorretos' });
    });

    it('should fail login when user list is empty', async () => {
      usersServiceMock.findAll.mockResolvedValue([]);
      const result = await controller.login({ name: 'João', password: '123456' });
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Login falhou: usuário ou senha incorretos' });
    });
  });
});