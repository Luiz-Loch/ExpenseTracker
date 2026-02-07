import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailUniqueValidator } from './validations/create/email-unique.validator';
import { EmailUniqueOnUpdateValidator } from './validations/update/email-unique-on-update.validator';
import { USER_CREATE_VALIDATORS, USER_UPDATE_VALIDATORS } from './validations/tokens';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    EmailUniqueValidator,
    EmailUniqueOnUpdateValidator,
    {
      provide: USER_CREATE_VALIDATORS,
      useFactory: (emailUniqueValidator: EmailUniqueValidator) => [emailUniqueValidator],
      inject: [EmailUniqueValidator]
    },
    {
      provide: USER_UPDATE_VALIDATORS,
      useFactory: (emailUniqueOnUpdateValidator: EmailUniqueOnUpdateValidator) => [emailUniqueOnUpdateValidator],
      inject: [EmailUniqueOnUpdateValidator]
    }
  ],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UserModule { }
