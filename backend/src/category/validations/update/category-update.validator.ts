import { CategoryPatchDto } from '../../dto/patch-category.dto';

export interface CategoryUpdateValidator {

  validate(userId: string, id: string, categoryPatchDto: CategoryPatchDto): Promise<void> | void;

}
