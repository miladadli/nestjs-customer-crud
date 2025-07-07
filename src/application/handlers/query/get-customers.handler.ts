import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetCustomersQuery, GetCustomerByIdQuery, GetCustomerByEmailQuery, PaginatedCustomersResult } from '../../queries/get-customers.query';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { Customer } from '../../../domain/entities/customer.entity';

@Injectable()
@QueryHandler(GetCustomersQuery)
export class GetCustomersHandler implements IQueryHandler<GetCustomersQuery> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: GetCustomersQuery): Promise<PaginatedCustomersResult> {
    const [data, total] = await Promise.all([
      this.customerRepository.findMany(query.limit, query.offset),
      this.customerRepository.count(),
    ]);
    return {
      data,
      total,
      limit: query.limit ?? 0,
      offset: query.offset ?? 0,
    };
  }
}

@Injectable()
@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler implements IQueryHandler<GetCustomerByIdQuery> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerByIdQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(query.id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${query.id} not found`);
    }
    return customer;
  }
}

@Injectable()
@QueryHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailHandler implements IQueryHandler<GetCustomerByEmailQuery> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerByEmailQuery): Promise<Customer> {
    const customer = await this.customerRepository.findByEmail(query.email);
    if (!customer) {
      throw new NotFoundException(`Customer with email ${query.email} not found`);
    }
    return customer;
  }
} 