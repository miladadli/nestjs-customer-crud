import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerOrmEntity } from './infrastructure/database/customer.orm-entity';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CreateCustomerHandler } from './application/handlers/command/create-customer.handler';
import { UpdateCustomerHandler } from './application/handlers/command/update-customer.handler';
import { DeleteCustomerHandler } from './application/handlers/command/delete-customer.handler';
import {
  GetCustomersHandler,
  GetCustomerByIdHandler,
  GetCustomerByEmailHandler,
} from './application/handlers/query/get-customers.handler';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [CustomerOrmEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([CustomerOrmEntity]),
    CqrsModule,
  ],
  controllers: [CustomerController],
  providers: [
    TypeOrmCustomerRepository,
    { provide: 'ICustomerRepository', useExisting: TypeOrmCustomerRepository },
    CreateCustomerHandler,
    UpdateCustomerHandler,
    DeleteCustomerHandler,
    GetCustomersHandler,
    GetCustomerByIdHandler,
    GetCustomerByEmailHandler,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
