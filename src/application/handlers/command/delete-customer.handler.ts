import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from '../../commands/delete-customer.command';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';

@Injectable()
@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(command.id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await this.customerRepository.delete(command.id);
  }
} 