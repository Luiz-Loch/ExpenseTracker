import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class PostgresConfigService
  implements TypeOrmOptionsFactory {

  public constructor(
    private readonly configService: ConfigService,
  ) { }

  public createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('PG_HOST'),
      port: this.configService.getOrThrow<number>('PG_PORT'),
      username: this.configService.getOrThrow<string>('PG_USERNAME'),
      password: this.configService.getOrThrow<string>('PG_PASSWORD'),
      database: this.configService.getOrThrow<string>('PG_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.js,.ts}'],
      synchronize: false,
    }
  }

}
