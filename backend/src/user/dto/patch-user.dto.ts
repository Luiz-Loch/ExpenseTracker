import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UserPatchDto {

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiProperty({ description: 'The name of the user', required: false })
  public readonly name?: string;

  @IsEmail()
  @Length(2, 100)
  @IsOptional()
  @ApiProperty({ description: 'The email address of the user', required: false })
  public readonly email?: string;
}
