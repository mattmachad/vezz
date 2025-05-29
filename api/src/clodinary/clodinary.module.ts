import { Module } from '@nestjs/common';
import { CloudinaryService } from './clodinary.service';
import { CloudinaryProvider } from '../../database/cloudinary.provider';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class ClodinaryModule { }
