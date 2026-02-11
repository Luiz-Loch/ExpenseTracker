import { ApiProperty } from "@nestjs/swagger";
import { IsStrongPassword } from "class-validator";

export class UserUpdatePasswordDto {

  @IsStrongPassword()
  @ApiProperty({ description: 'The current password of the user' })
  public readonly oldPassword: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'The new password of the user' })
  public readonly newPassword: string;
}
