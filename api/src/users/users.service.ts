import { ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../clodinary/clodinary.service';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File): Promise<User> {
    const existing: User | null = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);

    const defaultPicture: string = process.env.DEFAULT_USER_PICTURE;
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

    const user: User = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      picture: imageUrl,
    });

    const savedUser: User = await this.userRepository.save(user);
    return savedUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users: User[] = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const user: User | null = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (file && file.buffer && file.size > 0) {
      const uploadResult = await this.cloudinaryService.uploadImage({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      });

      if ('secure_url' in uploadResult) {
        updateUserDto.picture = uploadResult.secure_url;
      }
    }

    const updatedUser: User = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }



  async remove(id: number): Promise<string> {
    const user: User | null = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    await this.userRepository.remove(user);
    return `Usuário com ID ${id} removido com sucesso.`;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user: User | null = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async onModuleInit(): Promise<void> {
    await this.seedProducts();
  }

  private async seedProducts(): Promise<void> {
    const count: number = await this.userRepository.count();
    if (count > 2) return;

    const sampleUsers: any = [
      {
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
        cep: '17509004',
        is_admin: true,
        city: 'Marília',
        street: 'Rua dos Admins',
        state: 'SP',
        phone: '14999999999',
      },
    ];

    for (const user of sampleUsers) {
      const exists: User | null = await this.userRepository.findOne({ where: { name: user.name } });

      if (!exists) {
        await this.create(user);
      }
    }
  }
}
