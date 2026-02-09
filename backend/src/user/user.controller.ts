import { Controller, Get, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {

  public constructor(
    private readonly userService: UserService
  ) { }

  @Get('me')
  public async findMe(@CurrentUserId() id: string): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.findOne(id));
  }

  @Patch('me')
  public async updateMe(@CurrentUserId() id: string, @Body() userUpdateDto: UserUpdateDto): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.update(id, userUpdateDto));
  }

  @Delete('me')
  public async deleteMe(@CurrentUserId() id: string): Promise<void> {
    return this.userService.remove(id);
  }

}
