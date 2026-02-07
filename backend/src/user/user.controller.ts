import { Controller, Get, Body, Patch, Delete, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { UserCreateDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {

  public constructor(
    private readonly userService: UserService
  ) { }

  @Post()
  public async create(@Body() userCreateDto: UserCreateDto): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.create(userCreateDto));
  }

  @Get('me')
  public async findMe(id: string): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.findOne(id));
  }

  @Patch('me/')
  public async updateMe(id: string, @Body() userUpdateDto: UserUpdateDto): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.update(id, userUpdateDto));
  }

  @Delete('me/')
  public async deleteMe(id: string): Promise<void> {
    return this.userService.remove(id);
  }

}
