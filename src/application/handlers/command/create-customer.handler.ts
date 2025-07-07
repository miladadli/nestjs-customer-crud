import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../../commands/create-customer.command';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { Customer } from '../../../domain/entities/customer.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../../domain/value-objects/phone-number.vo';
import { BankAccount } from '../../../domain/value-objects/bank-account.vo';

@Injectable()
@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    // Create value objects
    const email = new Email(command.email);
    const phoneNumber = new PhoneNumberVO(command.phoneNumber);
    const bankAccountNumber = new BankAccount(command.bankAccountNumber);

    // Check if customer already exists by email
    const existingCustomerByEmail = await this.customerRepository.findByEmail(
      email.getValue(),
    );
    if (existingCustomerByEmail) {
      throw new ConflictException('Customer with this email already exists');
    }

    // Check if customer already exists by full name and date of birth
    const existingCustomerByName =
      await this.customerRepository.findByFullNameAndDateOfBirth(
        command.firstName,
        command.lastName,
        command.dateOfBirth,
      );
    if (existingCustomerByName) {
      throw new ConflictException(
        'Customer with this name and date of birth already exists',
      );
    }

    // Create customer entity
    const customer = Customer.create(
      command.firstName,
      command.lastName,
      command.dateOfBirth,
      phoneNumber,
      email,
      bankAccountNumber,
    );

    // Save to repository
    return await this.customerRepository.create(customer);
  }
}
