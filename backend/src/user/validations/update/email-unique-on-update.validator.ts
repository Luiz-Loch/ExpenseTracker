import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserUpdateDto } from 'src/user/dto/update-user.dto';
import { UserUpdateValidator } from './user-update.validator';

@Injectable()
export class EmailUniqueOnUpdateValidator
  implements UserUpdateValidator {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  public async validate(id: string, userUpdateDto: UserUpdateDto): Promise<void> {
    if (!userUpdateDto.email) {
      return;
    }

    const email = userUpdateDto.email.toLowerCase().trim();

    const existing = await this.usersRepository.findOne({ where: { email } });

    if (existing && existing.id !== id) {
      throw new ConflictException('Email already in use');
    }
  }
}
