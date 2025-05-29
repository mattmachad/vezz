import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { BuyService } from './buy.service';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { Buy } from './entities/buy.entity';


@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) { }

  @Post()
  async create(@Body() createBuyDto: any) {
    if (!createBuyDto.user || !createBuyDto.products || !createBuyDto.payment_type) {
      throw new BadRequestException('Campos obrigatórios: user, products e payment_type');
    }
    return this.buyService.create(createBuyDto);
  }

  @Get()
  async findAll(): Promise<Buy[]> {
    return this.buyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Buy> {
    return this.buyService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBuyDto: UpdateBuyDto): Promise<Buy> {
    return this.buyService.update(+id, updateBuyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return this.buyService.remove(+id);
  }
}
