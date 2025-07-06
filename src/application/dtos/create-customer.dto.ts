import { IsString, IsEmail, IsDateString, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Customer date of birth (ISO 8601 format)',
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Customer mobile phone number',
    example: '+1234567890',
  })
  @IsMobilePhone()
  phoneNumber: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer bank account number',
    example: '1234567890123456',
    minLength: 8,
    maxLength: 17,
  })
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;
} 