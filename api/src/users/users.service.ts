import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

) { }


async create(createUserDto: CreateUserDto) {
  const existing = await this.userRepository.findOne({
    where: { email: createUserDto.email },
  });

  if (existing) {
    throw new ConflictException('E-mail já cadastrado');
  }

  const user = this.userRepository.create(createUserDto);
  const savedUser = await this.userRepository.save(user);
  console.log('[DEBUG] Usuário salvo:', savedUser);
  return savedUser;
}


  async findAll() {
    const users: any = await this.userRepository.find();
    console.log('[DEBUG] Usuários encontrados:', users);
    return users;
  }
  

async findOne(id: number) {
  const user = await this.userRepository.findOne({ where: { id } });
  console.log('[DEBUG] Usuário encontrado:', user);

  if (!user) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
  }

  return user;  // Retorna o usuário encontrado
}

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    
  
    const updatedUser: User & UpdateUserDto = Object.assign(user, updateUserDto);
  
    return await this.userRepository.save(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
