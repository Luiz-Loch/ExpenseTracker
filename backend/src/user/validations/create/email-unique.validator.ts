import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserCreateValidator } from './user-create.validator';
import { UserCreate } from '../../types/create-user.type';

@Injectable()
export class EmailUniqueValidator
  implements UserCreateValidator {

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  public async validate(user: UserCreate): Promise<void> {
    const email = user.email;

    const existing = await this.userRepository.existsBy({ email });

    if (existing) {
      throw new ConflictException('Email already in use');
    }
  }
}
