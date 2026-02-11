import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  public readonly id: string;

  @ApiProperty({ description: 'The name of the user' })
  public readonly name: string;

  @ApiProperty({ description: 'The email address of the user' })
  public readonly email: string;

  @ApiProperty({ description: 'The date and time when the user was created' })
  public readonly createdAt: Date;
  @ApiProperty({ description: 'The date and time when the user was last updated' })
  public readonly updatedAt: Date;

  public constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;

    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}