import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ nullable: false, length: 100 })
    public name: string;

    @Column({ nullable: false, length: 100, unique: true })
    public email: string;

    @Column({ nullable: false, length: 100 })
    public passwordHash: string;

    @CreateDateColumn({ nullable: false })
    public createdAt: Date;

    @UpdateDateColumn({ nullable: false })
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt?: Date;
}
