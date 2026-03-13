import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './configuration/postgres.config.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';
import { ReportModule } from './report/report.module';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(`redis://${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<string>('REDIS_PORT')}`),
            }),
          ],
          ttl: 1 * 60 * 1000, // 1 minute
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ExpenseModule,
    ReportModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
