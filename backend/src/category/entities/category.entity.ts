import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { CategoryPatchDto } from "../dto/patch-category.dto";

@Entity({ name: 'categories' })
@Index(
  ['user', 'name'],
  { unique: true,
    where: 'deleted_at IS NULL',
  }
)
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'name', nullable: false, length: 100 })
  name: string;

  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  public update(categoryPatchDto: CategoryPatchDto): Category {
    if (categoryPatchDto.name !== undefined && categoryPatchDto.name !== null) {
      this.name = categoryPatchDto.name.trim();
    }

    return this;
  }
}