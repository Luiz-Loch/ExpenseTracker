import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
