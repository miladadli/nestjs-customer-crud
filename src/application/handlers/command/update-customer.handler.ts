import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from '../../commands/update-customer.command';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { Customer } from '../../../domain/entities/customer.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { PhoneNumberVO } from '../../../domain/value-objects/phone-number.vo';
import { BankAccount } from '../../../domain/value-objects/bank-account.vo';

@Injectable()
@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const { id, update } = command;
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Prepare updated fields
    const firstName = update.firstName ?? customer.getFirstName();
    const lastName = update.lastName ?? customer.getLastName();
    const dateOfBirth = update.dateOfBirth ? new Date(update.dateOfBirth) : customer.getDateOfBirth();
    const phoneNumber = update.phoneNumber ? new PhoneNumberVO(update.phoneNumber) : customer.getPhoneNumber();
    const email = update.email ? new Email(update.email) : customer.getEmail();
    const bankAccountNumber = update.bankAccountNumber ? new BankAccount(update.bankAccountNumber) : customer.getBankAccountNumber();

    // Uniqueness checks
    if (update.email && update.email !== customer.getEmail().getValue()) {
      const existingByEmail = await this.customerRepository.findByEmail(update.email);
      if (existingByEmail && existingByEmail.getId() !== id) {
        throw new ConflictException('Customer with this email already exists');
      }
    }
    if (
      (update.firstName && update.firstName !== customer.getFirstName()) ||
      (update.lastName && update.lastName !== customer.getLastName()) ||
      (update.dateOfBirth && new Date(update.dateOfBirth).getTime() !== customer.getDateOfBirth().getTime())
    ) {
      const existingByName = await this.customerRepository.findByFullNameAndDateOfBirth(
        firstName,
        lastName,
        dateOfBirth,
      );
      if (existingByName && existingByName.getId() !== id) {
        throw new ConflictException('Customer with this name and date of birth already exists');
      }
    }

    // Create updated customer entity
    const updatedCustomer = new Customer(
      id,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      bankAccountNumber,
      customer.getCreatedAt(),
      new Date(),
    );
    return await this.customerRepository.update(updatedCustomer);
  }
} 