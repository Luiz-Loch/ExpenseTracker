import { Category } from "../entities/category.entity";

export class CategoryResponseDto {
    public readonly id: string;
    public readonly name: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    public constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
    }
}