import {
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  IsMobilePhone,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer first name',
    example: 'Milad',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name must contain only letters and spaces',
  })
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Adli',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name must contain only letters and spaces',
  })
  lastName: string;

  @ApiProperty({
    description: 'Customer date of birth (ISO 8601 format)',
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Customer mobile phone number',
    example: '+989370147529',
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
    example: '79927398713',
    minLength: 8,
    maxLength: 17,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(17)
  @Matches(/^\d+$/, {
    message: 'Bank account number must contain only digits',
  })
  bankAccountNumber: string;
}
