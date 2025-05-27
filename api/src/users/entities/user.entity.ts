import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  cep: string;

  @Column( {nullable: true } )
  city: string;

  @Column( {nullable: true } )
  street: string;

  @Column( {nullable: true } )
  state: string;

  @Column()
  phone: string;
}