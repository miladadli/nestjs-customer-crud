import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CustomerOrmEntity } from './infrastructure/database/customer.orm-entity';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CreateCustomerHandler } from './application/handlers/command/create-customer.handler';
import { GetCustomersHandler, GetCustomerByIdHandler, GetCustomerByEmailHandler } from './application/handlers/query/get-customers.handler';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CustomerOrmEntity]),
    CqrsModule,
  ],
  controllers: [CustomerController],
  providers: [
    TypeOrmCustomerRepository,
    { provide: 'ICustomerRepository', useExisting: TypeOrmCustomerRepository },
    CreateCustomerHandler,
    GetCustomersHandler,
    GetCustomerByIdHandler,
    GetCustomerByEmailHandler,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}