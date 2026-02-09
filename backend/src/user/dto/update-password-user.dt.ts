import { IsStrongPassword } from "class-validator";

export class UserUpdatePasswordDto {

  @IsStrongPassword()
  public readonly oldPassword: string;

  @IsStrongPassword()
  public readonly newPassword: string;
}
