import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class RegisterUserDto {

  @IsString()
  @Length(2, 100)
  @ApiProperty({ description: 'The name of the user' })
  public readonly name: string;

  @IsEmail()
  @Length(2, 100)
  @ApiProperty({ description: 'The email address of the user' })
  public readonly email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'A strong password for the user' })
  public readonly password: string;
}
