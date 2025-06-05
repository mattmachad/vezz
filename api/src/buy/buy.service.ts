import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buy } from './entities/buy.entity';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';

@Injectable()
export class BuyService {
  constructor(
    @InjectRepository(Buy)
    private readonly buyRepository: Repository<Buy>,
  ) { }

  async create(createBuyDto: any) {
    const buy = this.buyRepository.create(createBuyDto);
    return await this.buyRepository.save(buy);
  }

  async findAll(): Promise<Buy[]> {
    return await this.buyRepository.find();
  }

  async findOne(id: number): Promise<Buy> {
    const buy = await this.buyRepository.findOne({ where: { id } });
    if (!buy) {
      throw new NotFoundException(`Compra com ID ${id} não encontrada`);
    }
    return buy;
  }

  async update(id: number, updateBuyDto: UpdateBuyDto): Promise<Buy> {
    const buy = await this.findOne(id);
    const updated = Object.assign(buy, updateBuyDto);
    return await this.buyRepository.save(updated);
  }


  async remove(id: number): Promise<string> {
    const buy = await this.findOne(id);
    await this.buyRepository.remove(buy);
    return `Compra com ID ${id} removida com sucesso`;
  }
}
