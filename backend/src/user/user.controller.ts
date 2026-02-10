import { Controller, Get, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPatchDto } from './dto/patch-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {

  public constructor(
    private readonly userService: UserService
  ) { }

  @Get('me')
  public async findMe(@CurrentUserId() id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return new UserResponseDto(user);
  }

  @Patch('me')
  public async updateMe(@CurrentUserId() id: string, @Body() userPatchDto: UserPatchDto): Promise<UserResponseDto> {
    const user = await this.userService.update(id, userPatchDto);
    return new UserResponseDto(user);
  }

  @Delete('me')
  public async deleteMe(@CurrentUserId() id: string): Promise<void> {
    return await this.userService.remove(id);
  }

}
