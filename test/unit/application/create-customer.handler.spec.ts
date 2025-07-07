import { CreateCustomerHandler } from '../../../src/application/handlers/command/create-customer.handler';
import { CreateCustomerCommand } from '../../../src/application/commands/create-customer.command';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository.interface';
import { ConflictException } from '@nestjs/common';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../../src/domain/value-objects/phone-number.vo';
import { BankAccount } from '../../../src/domain/value-objects/bank-account.vo';

describe('CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let repository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByFullNameAndDateOfBirth: jest.fn(),
      findAll: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByEmail: jest.fn(),
      existsByFullNameAndDateOfBirth: jest.fn(),
      count: jest.fn(),
    };
    handler = new CreateCustomerHandler(repository);
  });

  it('should create a customer if email and name+DOB are unique', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.findByFullNameAndDateOfBirth.mockResolvedValue(null);
    repository.create.mockImplementation(async (customer) => customer);

    const command = new CreateCustomerCommand(
      'John',
      'Doe',
      new Date('1990-01-01'),
      '+14155552671',
      'john.doe@example.com',
      '79927398713',
    );

    const result = await handler.execute(command);
    expect(result).toBeInstanceOf(Customer);
    expect(repository.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    repository.findByEmail.mockResolvedValue({} as Customer);
    const command = new CreateCustomerCommand(
      'John',
      'Doe',
      new Date('1990-01-01'),
      '+14155552671',
      'john.doe@example.com',
      '79927398713',
    );
    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if name and DOB already exist', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.findByFullNameAndDateOfBirth.mockResolvedValue({} as Customer);
    const command = new CreateCustomerCommand(
      'John',
      'Doe',
      new Date('1990-01-01'),
      '+14155552671',
      'john.doe@example.com',
      '79927398713',
    );
    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });
});
