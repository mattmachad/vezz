import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { Buy } from './entities/buy.entity'; // 🔥 Caminho correto para a entidade

@Module({
  imports: [TypeOrmModule.forFeature([Buy])], // 🔥 Importar a entidade Buy
  controllers: [BuyController],
  providers: [BuyService],
  exports: [BuyService], // 🔥 Se precisar usar em outros módulos
})
export class BuyModule { }
