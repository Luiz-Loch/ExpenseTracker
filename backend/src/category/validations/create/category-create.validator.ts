import { CategoryCreateDto } from "../../dto/create-category.dto";

export interface CategoryCreateValidator {

  validate(userId: string, categoryCreateDto: CategoryCreateDto): Promise<void> | void;

}
