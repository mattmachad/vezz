import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsBoolean()
  is_admin: boolean;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  is_favorite?: string;
}
