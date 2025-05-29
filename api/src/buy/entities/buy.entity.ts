import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('buy')
export class Buy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb' })
    user: object;

    @Column({ type: 'jsonb' })
    products: object[];

    @Column()
    payment_type: string;
}