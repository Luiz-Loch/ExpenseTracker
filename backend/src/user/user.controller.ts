import { Controller, Get, Body, Patch, Delete, UseGuards, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPatchDto } from './dto/patch-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { UserUpdatePasswordDto } from './dto/update-password-user.dt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class UserController {

  public constructor(
    private readonly userService: UserService,
  ) { }

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  public async findMe(@CurrentUserId() id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return new UserResponseDto(user);
  }

  @Patch('me')
  @ApiOkResponse({ type: UserResponseDto })
  public async updateMe(@CurrentUserId() id: string, @Body() userPatchDto: UserPatchDto): Promise<UserResponseDto> {
    const user = await this.userService.update(id, userPatchDto);
    return new UserResponseDto(user);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(
    @CurrentUserId() id: string,
    @Body() userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<void> {
    await this.userService.updatePassword(id, userUpdatePasswordDto);
  }

  @Delete('me')
  public async deleteMe(@CurrentUserId() id: string): Promise<void> {
    return await this.userService.remove(id);
  }

}
