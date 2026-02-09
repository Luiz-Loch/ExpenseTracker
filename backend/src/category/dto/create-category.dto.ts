import { IsEnum, IsString, Length } from "class-validator";
import { CategoryType } from "../enums/category-type.enum";

export class CategoryCreateDto {

    @IsString()
    @Length(2, 100)
    public readonly name: string;

    @IsEnum(CategoryType)
    public readonly type: CategoryType;
}
