import { CategoryUpdateDto } from '../../dto/update-category.dto';

export interface CategoryUpdateValidator {

  validate(userId: string, id: string, categoryUpdateDto: CategoryUpdateDto): Promise<void> | void;

}
