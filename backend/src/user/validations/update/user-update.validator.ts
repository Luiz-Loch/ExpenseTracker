import { UserUpdateDto } from 'src/user/dto/update-user.dto';

export interface UserUpdateValidator {

  validate(id: string, userUpdateDto: UserUpdateDto): Promise<void> | void;

}
