import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../entities/category.entity";

export class CategoryResponseDto {
    @ApiProperty({ description: 'The unique identifier of the category' })
    public readonly id: string;

    @ApiProperty({ description: 'The name of the category' })
    public readonly name: string;

    @ApiProperty({ description: 'The date and time when the category was created' })
    public readonly createdAt: Date;

    @ApiProperty({ description: 'The date and time when the category was last updated' })
    public readonly updatedAt: Date;

    public constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
    }
}