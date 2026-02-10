import { IsString, Length } from "class-validator";

export class CategoryCreateDto {

    @IsString()
    @Length(2, 100)
    public readonly name: string;
}
