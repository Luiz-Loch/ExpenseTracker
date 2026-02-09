import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CategoryType } from "../enums/category-type.enum";
import { User } from "../../user/entities/user.entity";
import { CategoryUpdateDto } from "../dto/update-category.dto";

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

  @Column({ name: 'type', nullable: false, type: 'enum', enum: CategoryType })
  type: CategoryType;

  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  public update(categoryUpdateDto: CategoryUpdateDto): Category {
    if (categoryUpdateDto.name !== undefined) {
      this.name = categoryUpdateDto.name.trim();
    }

    if (categoryUpdateDto.type !== undefined) {
      this.type = categoryUpdateDto.type;
    }

    return this;
  }
}