export class AuthTokenResponseDto {
  public readonly accessToken: string;

  public constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  
}

