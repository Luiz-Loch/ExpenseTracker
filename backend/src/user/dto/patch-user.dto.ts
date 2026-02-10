import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UserPatchDto {

  @IsString()
  @Length(2, 100)
  @IsOptional()
  public readonly name?: string;

  @IsEmail()
  @Length(2, 100)
  @IsOptional()
  public readonly email?: string;
}
