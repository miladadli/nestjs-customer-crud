import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../database/customer.orm-entity';
import { Email } from '../../domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../domain/value-objects/phone-number.vo';
import { BankAccount } from '../../domain/value-objects/bank-account.vo';

@Injectable()
export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepository: Repository<CustomerOrmEntity>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const ormEntity = this.toOrmEntity(customer);
    const savedEntity = await this.customerRepository.save(ormEntity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const ormEntity = await this.customerRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const ormEntity = await this.customerRepository.findOne({ where: { email } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByFullNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Customer | null> {
    const ormEntity = await this.customerRepository.findOne({
      where: { firstName, lastName, dateOfBirth },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const ormEntities = await this.customerRepository.find();
    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async findMany(limit?: number, offset?: number): Promise<Customer[]> {
    const ormEntities = await this.customerRepository.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async update(customer: Customer): Promise<Customer> {
    const ormEntity = this.toOrmEntity(customer);
    const updatedEntity = await this.customerRepository.save(ormEntity);
    return this.toDomainEntity(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.customerRepository.count({ where: { email } });
    return count > 0;
  }

  async existsByFullNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<boolean> {
    const count = await this.customerRepository.count({
      where: { firstName, lastName, dateOfBirth },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.customerRepository.count();
  }

  private toOrmEntity(customer: Customer): CustomerOrmEntity {
    const ormEntity = new CustomerOrmEntity();
    if (customer.getId()) {
      ormEntity.id = customer.getId()!;
    }
    ormEntity.firstName = customer.getFirstName();
    ormEntity.lastName = customer.getLastName();
    ormEntity.dateOfBirth = customer.getDateOfBirth();
    ormEntity.phoneNumber = customer.getPhoneNumber().getFormattedNumber();
    ormEntity.email = customer.getEmail().getValue();
    ormEntity.bankAccountNumber = customer.getBankAccountNumber().getValue();
    ormEntity.createdAt = customer.getCreatedAt();
    ormEntity.updatedAt = customer.getUpdatedAt();
    return ormEntity;
  }

  private toDomainEntity(ormEntity: CustomerOrmEntity): Customer {
    return new Customer(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      new Date(ormEntity.dateOfBirth),
      new PhoneNumberVO(ormEntity.phoneNumber),
      new Email(ormEntity.email),
      new BankAccount(ormEntity.bankAccountNumber),
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }
} 