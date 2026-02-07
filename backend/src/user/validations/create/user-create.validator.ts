import { UserCreateDto } from '../../dto/create-user.dto';

export interface UserCreateValidator {

  validate(userCreateDto: UserCreateDto): Promise<void> | void;

}
