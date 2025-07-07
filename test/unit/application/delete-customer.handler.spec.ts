import { DeleteCustomerHandler } from '../../../src/application/handlers/command/delete-customer.handler';
import { DeleteCustomerCommand } from '../../../src/application/commands/delete-customer.command';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../../src/domain/value-objects/phone-number.vo';
import { BankAccount } from '../../../src/domain/value-objects/bank-account.vo';

describe('DeleteCustomerHandler', () => {
  let handler: DeleteCustomerHandler;
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
    handler = new DeleteCustomerHandler(repository);
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

  it('should delete a customer if found', async () => {
    repository.findById.mockResolvedValue(existingCustomer);
    repository.delete.mockResolvedValue();
    const command = new DeleteCustomerCommand('uuid-1');
    await expect(handler.execute(command)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException if customer does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new DeleteCustomerCommand('uuid-2');
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
