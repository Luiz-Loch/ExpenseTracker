import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('PG_HOST'),
  port: configService.getOrThrow<number>('PG_PORT'),
  username: configService.getOrThrow<string>('PG_USERNAME'),
  password: configService.getOrThrow<string>('PG_PASSWORD'),
  database: configService.getOrThrow<string>('PG_DATABASE'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
