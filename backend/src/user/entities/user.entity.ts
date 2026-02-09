import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserUpdateDto } from "../dto/update-user.dto";

@Entity({ name: 'users' })
@Index(
  ['email'],
  { unique: true,
    where: 'deleted_at IS NULL',
  }
)
export class User {

  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ name: 'name', nullable: false, length: 100 })
  public name: string;

  @Column({ name: 'email', nullable: false, length: 100 })
  public email: string;

  @Column({ name: 'password_hash', nullable: false, length: 255 })
  public passwordHash: string;

  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  public deletedAt?: Date;

  public update(userUpdateDto: UserUpdateDto): User {
    if (userUpdateDto.name !== undefined) {
      this.name = userUpdateDto.name.trim();
    }

    if (userUpdateDto.email !== undefined) {
      this.email = userUpdateDto.email.toLowerCase().trim();
    }

    return this;
  }

  public updatePassword(newPasswordHash: string): User {
    this.passwordHash = newPasswordHash;
    return this;
  }
}
