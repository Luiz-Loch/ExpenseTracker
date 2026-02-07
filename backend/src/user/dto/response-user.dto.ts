import { User } from "../entities/user.entity";

export class UserResponseDto {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;

    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}