import { ApiProperty } from "@nestjs/swagger";

export class AuthTokenResponseDto {
  @ApiProperty({ description: 'The access token for authentication' })
  public readonly accessToken: string;

  public constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

}

