import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class RegisterUserDto {

  @IsString()
  @Length(2, 100)
  public readonly name: string;

  @IsEmail()
  @Length(2, 100)
  public readonly email: string;

  @IsStrongPassword()
  public readonly password: string;
}
