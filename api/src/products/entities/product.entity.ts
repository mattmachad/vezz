import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category, Gender, Size } from "../../type/enum";

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: Size, nullable: true })
  size: Size;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category: Category;
}
