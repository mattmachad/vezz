import { IsNotEmpty, IsString, IsObject, IsArray } from 'class-validator';

export class CreateBuyDto {
    @IsNotEmpty()
    @IsObject()
    user: {
        id: number;
        name: string;
        email: string;
        cep: string;
        city?: string | null;
        street?: string | null;
        state?: string | null;
        phone: string;
    };

    @IsNotEmpty()
    @IsArray()
    products: {
        id: number;
        name: string;
        price: number;
        size: string;
        quantity: number;
        image: string;
    }[];

    @IsNotEmpty()
    @IsString()
    payment_type: string;
}
