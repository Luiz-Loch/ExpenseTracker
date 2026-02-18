import { Category } from "../../category/entities/category.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Currency } from "../enums/currency.enum";
import { ExpensePatch } from "../types/patch-expense.type";
import { CurrencyConfig } from "../../common/money/money.util";
import { ExpenseType } from "../enums/expense-type.enum";

@Entity({ name: "expenses" })
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ name: 'name', nullable: false, length: 100 })
  name: string;

  @Column({ name: 'description', nullable: true, type: 'varchar', length: 255 })
  description: string | null;

  @Column({ name: 'amount_cents', nullable: false, type: 'int' })
  amountCents: number;

  @Column({ name: 'currency', nullable: false, type: 'enum', enum: Currency, default: Currency.BRL })
  currency: Currency;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: ExpenseType })
  type: ExpenseType;

  @Column({ name: 'spent_at', nullable: false, type: 'timestamptz' })
  spentAt: Date;

  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  public update(expensePatch: ExpensePatch): Expense {
    if (expensePatch.name !== undefined && expensePatch.name !== null) {
      this.name = expensePatch.name;
    }
    if (expensePatch.description !== undefined) {
      // if description is null, set it to undefined to allow clearing the description
      this.description = expensePatch.description;
    }
    if (expensePatch.amount !== undefined && expensePatch.amount !== null) {
      this.amountCents = CurrencyConfig.toMinorUnits(expensePatch.amount, this.currency);
    }
    if (expensePatch.currency !== undefined && expensePatch.currency !== null) {
      this.currency = expensePatch.currency;
    }
    if (expensePatch.spentAt !== undefined && expensePatch.spentAt !== null) {
      this.spentAt = expensePatch.spentAt;
    }
    if (expensePatch.type !== undefined && expensePatch.type !== null) {
      this.type = expensePatch.type;
    }
    if (expensePatch.category !== undefined) {
      // if category is null, set it to undefined to allow clearing the category
      this.category = expensePatch.category;
    }
    return this;
  }
}
