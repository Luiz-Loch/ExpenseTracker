import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@Injectable()
export class AuthService {

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) { }

  public async login(loginDto: LoginDto) {
    const user: User | null = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      loginDto.password,
      user?.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return new AuthTokenResponseDto(await this.jwtService.signAsync(payload));
  }

}
