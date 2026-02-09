import { UserCreate } from 'src/user/types/create-user.type';

export interface UserCreateValidator {

  validate(userCreate: UserCreate): Promise<void> | void;

}
