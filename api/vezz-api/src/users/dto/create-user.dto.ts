import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    name: string;
  
    @IsEmail()
    email: string;
  
    @MinLength(6)
    password: string;
  
    @IsNotEmpty()
    cep: string;
  
    @IsNotEmpty()
    city: string;
  
    @IsNotEmpty()
    street: string;
  
    @IsNotEmpty()
    state: string;
  
    @IsNotEmpty()
    phone: string;
  }
  