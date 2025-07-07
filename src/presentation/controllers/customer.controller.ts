import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../../application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../../application/dtos/update-customer.dto';
import { CustomerDto } from '../../application/dtos/customer.dto';
import { CreateCustomerCommand } from '../../application/commands/create-customer.command';
import { UpdateCustomerCommand } from '../../application/commands/update-customer.command';
import { DeleteCustomerCommand } from '../../application/commands/delete-customer.command';
import {
  GetCustomersQuery,
  GetCustomerByIdQuery,
  GetCustomerByEmailQuery,
} from '../../application/queries/get-customers.query';
import { Customer } from '../../domain/entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Customer already exists (email or name+DOB)',
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    const command = CreateCustomerCommand.fromDto(createCustomerDto);
    const customer = await this.commandBus.execute(command);
    return this.toCustomerDto(customer);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated',
    type: CustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({
    status: 409,
    description: 'Customer already exists (email or name+DOB)',
  })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const command = new UpdateCustomerCommand(id, updateCustomerDto);
    const customer = await this.commandBus.execute(command);
    return this.toCustomerDto(customer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    const command = new DeleteCustomerCommand(id);
    await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of customers to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of customers to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [CustomerDto],
  })
  async getCustomers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{
    data: CustomerDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const query = new GetCustomersQuery(limit, offset);
    const result = await this.queryBus.execute(query);
    return {
      data: result.data.map((customer: Customer) =>
        this.toCustomerDto(customer),
      ),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  async getCustomerById(@Param('id') id: string): Promise<CustomerDto> {
    const query = new GetCustomerByIdQuery(id);
    const customer = await this.queryBus.execute(query);
    return this.toCustomerDto(customer);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get customer by email' })
  @ApiParam({ name: 'email', description: 'Customer email address' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  async getCustomerByEmail(
    @Param('email') email: string,
  ): Promise<CustomerDto> {
    const query = new GetCustomerByEmailQuery(email);
    const customer = await this.queryBus.execute(query);
    return this.toCustomerDto(customer);
  }

  private toCustomerDto(customer: Customer): CustomerDto {
    return {
      id: customer.getId() ?? '',
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      fullName: customer.getFullName(),
      dateOfBirth: customer.getDateOfBirth().toISOString().split('T')[0],
      age: customer.getAge(),
      phoneNumber: customer.getPhoneNumber().getFormattedNumber(),
      email: customer.getEmail().getValue(),
      bankAccountNumber: customer.getBankAccountNumber().getMaskedValue(),
      createdAt: customer.getCreatedAt().toISOString(),
      updatedAt: customer.getUpdatedAt().toISOString(),
    };
  }
}
