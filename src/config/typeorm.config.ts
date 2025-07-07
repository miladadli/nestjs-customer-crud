import { CustomerOrmEntity } from '../infrastructure/database/customer.orm-entity';

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