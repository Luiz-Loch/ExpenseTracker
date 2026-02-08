import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserCreate } from '../user/types/create-user.type';

@Injectable()
export class AuthService {

  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  public async login(loginDto: LoginDto) {
    const user: User | null = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new AuthTokenResponseDto(await this.signAccessToken(user));
  }

  public async register(registerUserDto: RegisterUserDto): Promise<AuthTokenResponseDto> {

    const passwordHash: string = await this.generatePasswordHash(registerUserDto.password);

    const userCreateDto: UserCreate = {
      name: registerUserDto.name.trim(),
      email: registerUserDto.email.toLowerCase().trim(),
      passwordHash
    };

    const user: User = await this.userService.create(userCreateDto);

    return new AuthTokenResponseDto(await this.signAccessToken(user));
  }

  private async signAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.signAsync(payload);
  }

  private async generatePasswordHash(password: string): Promise<string> {
    const saltRounds: number = Number(this.configService.getOrThrow<number>('HASH_SALT_ROUNDS'));
    return bcrypt.hash(password, saltRounds);
  }

}
