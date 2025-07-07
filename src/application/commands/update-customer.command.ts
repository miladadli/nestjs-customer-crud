import { UpdateCustomerDto } from '../dtos/update-customer.dto';

export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly update: UpdateCustomerDto,
  ) {}
}
