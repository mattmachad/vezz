import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Category, Gender, Size } from '../../type/enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
