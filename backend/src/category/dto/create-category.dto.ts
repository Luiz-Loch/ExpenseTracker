import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CategoryCreateDto {

  @IsString()
  @Length(2, 100)
  @ApiProperty({ description: 'The name of the category' })
  public readonly name: string;
}
