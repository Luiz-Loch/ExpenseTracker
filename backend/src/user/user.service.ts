import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { USER_CREATE_VALIDATORS, USER_UPDATE_VALIDATORS } from './validations/tokens';
import { UserCreateValidator } from './validations/create/user-create.validator';
import { UserUpdateValidator } from './validations/update/user-update.validator';
import { UserUpdatePasswordDto } from './dto/update-password-user.dt';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserCreate } from './types/create-user.type';


@Injectable()
export class UserService {

  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(USER_CREATE_VALIDATORS)
    private readonly createValidators: Array<UserCreateValidator>,

    @Inject(USER_UPDATE_VALIDATORS)
    private readonly updateValidators: Array<UserUpdateValidator>,
  ) { }

  public async create(userCreateDto: UserCreate): Promise<User> {
    for (const validator of this.createValidators) {
      await validator.validate(userCreateDto);
    }

    const user: User = this.usersRepository.create({
      name: userCreateDto.name,
      email: userCreateDto.email,
      passwordHash: userCreateDto.passwordHash
    });

    return this.usersRepository.save(user);
  }

  public async findOne(id: string): Promise<User> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async update(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    const user: User = await this.findOne(id);

    for (const validator of this.updateValidators) {
      await validator.validate(id, userUpdateDto);
    }

    user.update(userUpdateDto);

    return this.usersRepository.save(user);
  }

  public async remove(id: string): Promise<void> {
    const user: User = await this.findOne(id);

    await this.usersRepository.softDelete(id);
  }

  public async updatePassword(id: string, userUpdatePasswordDto: UserUpdatePasswordDto){
    const user: User = await this.findOne(id);

  }

}
