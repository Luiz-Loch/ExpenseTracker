import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserCreateDto } from '../../dto/create-user.dto';
import { UserCreateValidator } from './user-create.validator';

@Injectable()
export class EmailUniqueValidator
  implements UserCreateValidator {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  public async validate(userCreateDto: UserCreateDto): Promise<void> {
    const email = userCreateDto.email.toLowerCase().trim();

    const existing = await this.usersRepository.existsBy({ email });

    if (existing) {
      throw new ConflictException('Email already in use');
    }
  }
}
