import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/jwt-payload.type";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUser } from "../types/auth-user.type";

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy) {

  private readonly configService: ConfigService;

  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET_KEY"),
    });

    this.configService = configService;
  }

  public async validate(payload: JwtPayload): Promise<AuthUser> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
