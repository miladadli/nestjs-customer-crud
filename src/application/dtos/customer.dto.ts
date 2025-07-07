import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({
    description: 'Customer unique identifier',
    example: 'customer_1234567890_abc123def',
  })
  id: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Customer full name',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Customer date of birth',
    example: '1990-01-01',
  })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Customer age',
    example: 33,
  })
  age: number;

  @ApiProperty({
    description: 'Customer phone number (formatted)',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Customer bank account number (masked)',
    example: '************3456',
  })
  bankAccountNumber: string;

  @ApiProperty({
    description: 'Customer creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Customer last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
