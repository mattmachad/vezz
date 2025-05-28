import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { Category, Gender, Size } from '../../type/enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Min(0)
  price: number;


  @IsObject()
  @IsNotEmpty()
  quantities: {
    [key in Size]?: number;
  };

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
