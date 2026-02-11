import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @ApiOkResponse({ type: AuthTokenResponseDto })
  public async login(@Body() loginDto: LoginDto): Promise<AuthTokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthTokenResponseDto })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthTokenResponseDto> {
    return this.authService.register(registerUserDto);
  }

}
