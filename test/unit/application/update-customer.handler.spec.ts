import { UpdateCustomerHandler } from '../../../src/application/handlers/command/update-customer.handler';
import { UpdateCustomerCommand } from '../../../src/application/commands/update-customer.command';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../../src/domain/value-objects/phone-number.vo';
import { BankAccount } from '../../../src/domain/value-objects/bank-account.vo';

describe('UpdateCustomerHandler', () => {
  let handler: UpdateCustomerHandler;
  let repository: jest.Mocked<ICustomerRepository>;
  let existingCustomer: Customer;

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
    handler = new UpdateCustomerHandler(repository);
    existingCustomer = new Customer(
      'uuid-1',
      'John',
      'Doe',
      new Date('1990-01-01'),
      new PhoneNumberVO('+14155552671'),
      new Email('john.doe@example.com'),
      new BankAccount('79927398713'),
      new Date(),
      new Date(),
    );
  });

  it('should update a customer if all checks pass', async () => {
    repository.findById.mockResolvedValue(existingCustomer);
    repository.findByEmail.mockResolvedValue(null);
    repository.findByFullNameAndDateOfBirth.mockResolvedValue(null);
    repository.update.mockImplementation(async (customer) => customer);

    const command = new UpdateCustomerCommand('uuid-1', { firstName: 'Jane' });
    const result = await handler.execute(command);
    expect(result.getFirstName()).toBe('Jane');
    expect(repository.update).toHaveBeenCalled();
  });

  it('should throw NotFoundException if customer does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateCustomerCommand('uuid-2', { firstName: 'Jane' });
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if email already exists', async () => {
    repository.findById.mockResolvedValue(existingCustomer);
    repository.findByEmail.mockResolvedValue({
      getId: () => 'uuid-2',
    } as Customer);
    const command = new UpdateCustomerCommand('uuid-1', {
      email: 'other@example.com',
    });
    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if name+DOB already exists', async () => {
    repository.findById.mockResolvedValue(existingCustomer);
    repository.findByEmail.mockResolvedValue(null);
    repository.findByFullNameAndDateOfBirth.mockResolvedValue({
      getId: () => 'uuid-2',
    } as Customer);
    const command = new UpdateCustomerCommand('uuid-1', {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1991-01-01',
    });
    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });
});
