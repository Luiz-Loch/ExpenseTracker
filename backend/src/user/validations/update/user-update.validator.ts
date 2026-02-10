import { UserPatchDto } from '../../dto/patch-user.dto';

export interface UserUpdateValidator {

  validate(id: string, userPatchDto: UserPatchDto): Promise<void> | void;

}
