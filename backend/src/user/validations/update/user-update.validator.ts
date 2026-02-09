import { UserUpdateDto } from '../../dto/update-user.dto';

export interface UserUpdateValidator {

  validate(id: string, userUpdateDto: UserUpdateDto): Promise<void> | void;

}
