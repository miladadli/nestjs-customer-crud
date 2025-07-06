import { CreateCustomerDto } from '../dtos/create-customer.dto';

export class CreateCustomerCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: Date,
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly bankAccountNumber: string,
  ) {}

  static fromDto(dto: CreateCustomerDto): CreateCustomerCommand {
    return new CreateCustomerCommand(
      dto.firstName,
      dto.lastName,
      new Date(dto.dateOfBirth),
      dto.phoneNumber,
      dto.email,
      dto.bankAccountNumber,
    );
  }
} 