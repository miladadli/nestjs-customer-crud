import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomerOrmEntity } from '../infrastructure/database/customer.orm-entity';

export const createTypeOrmConfig = (configService: ConfigService): DataSource => {
  return new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_NAME', 'customer_crud'),
    entities: [CustomerOrmEntity],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    synchronize: configService.get<boolean>('DB_SYNC', false), // Set to false in production
    logging: configService.get<boolean>('DB_LOGGING', false),
    ssl: configService.get<boolean>('DB_SSL', false) ? { rejectUnauthorized: false } : false,
  });
};

export const typeOrmConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'customer_crud',
  entities: [CustomerOrmEntity],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: process.env.DB_SYNC === 'true', // Set to false in production
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}; 