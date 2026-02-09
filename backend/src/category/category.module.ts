import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { CATEGORY_CREATE_VALIDATORS, CATEGORY_UPDATE_VALIDATORS } from './validations/tokens';
import { User } from '../user/entities/user.entity';
import { NameUniqueValidator } from './validations/create/name-unique.validator';
import { NameUniqueOnUpdateValidator } from './validations/update/name-unique-on-update.validator';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    NameUniqueValidator,
    NameUniqueOnUpdateValidator,
    {
      provide: CATEGORY_CREATE_VALIDATORS,
      useFactory: (nameUniqueValidator: NameUniqueValidator) => [nameUniqueValidator],
      inject: [NameUniqueValidator]
    },
    {
      provide: CATEGORY_UPDATE_VALIDATORS,
      useFactory: (nameUniqueOnUpdateValidator: NameUniqueOnUpdateValidator) => [nameUniqueOnUpdateValidator],
      inject: [NameUniqueOnUpdateValidator]
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Category, User]),
  ],
})
export class CategoryModule { }
