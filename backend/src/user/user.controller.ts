import { Controller, Get, Body, Patch, Delete, UseGuards, HttpCode, HttpStatus, Post, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPatchDto } from './dto/patch-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { UserUpdatePasswordDto } from './dto/update-password-user.dt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class UserController {

  private static readonly CACHE_KEY_PREFIX: string = 'user:';

  public constructor(
    private readonly userService: UserService,

    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }

  private userCacheKey(id: string): string {
    return `${UserController.CACHE_KEY_PREFIX}${id}`;
  }

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  public async findMe(@CurrentUserId() id: string): Promise<UserResponseDto> {
    const cacheKey: string = this.userCacheKey(id);
    const cached: UserResponseDto | undefined = await this.cache.get<UserResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const user: User = await this.userService.findOne(id);
    const response: UserResponseDto = new UserResponseDto(user);
    await this.cache.set(cacheKey, response);
    return response;
  }

  @Patch('me')
  @ApiOkResponse({ type: UserResponseDto })
  public async updateMe(@CurrentUserId() id: string, @Body() userPatchDto: UserPatchDto): Promise<UserResponseDto> {
    await this.cache.del(this.userCacheKey(id));
    const user: User = await this.userService.update(id, userPatchDto);
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
    await this.cache.del(this.userCacheKey(id));
    return await this.userService.remove(id);
  }

}
