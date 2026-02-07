import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserUpdateDto } from "../dto/update-user.dto";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ nullable: false, length: 100 })
  public name: string;

  @Column({ nullable: false, length: 100, unique: true })
  public email: string;

  @Column({ nullable: false, length: 255 })
  public passwordHash: string;

  @CreateDateColumn({ nullable: false, type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  public deletedAt?: Date;

  public update(userUpdateDto: UserUpdateDto): User {
    if (userUpdateDto.name !== undefined) {
      this.name = userUpdateDto.name.toLowerCase().trim();
    }

    if (userUpdateDto.email !== undefined) {
      this.email = userUpdateDto.email.toLowerCase().trim();
    }

    return this;
  }
}
