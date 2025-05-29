import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category, Gender, Size } from "../../type/enum";

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'float' })
  price: number;

  @Column('jsonb')
  quantities: {
    [key in Size]?: number;
  };

  @Column()
  color: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category: Category;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  detach?: boolean
}
