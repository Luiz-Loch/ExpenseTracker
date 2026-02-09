import { Category } from "../entities/category.entity";
import { CategoryType } from "../enums/category-type.enum";

export class CategoryResponseDto {
    public readonly id: string;
    public readonly name: string;
    public readonly type: CategoryType;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    public constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.type = category.type;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
    }
}