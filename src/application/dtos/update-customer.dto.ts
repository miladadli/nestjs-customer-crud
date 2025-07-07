import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsMobilePhone,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer first name',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name must contain only letters and spaces',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Customer last name',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name must contain only letters and spaces',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Customer date of birth (ISO 8601 format)',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Customer mobile phone number' })
  @IsMobilePhone()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Customer email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Customer bank account number',
    minLength: 8,
    maxLength: 17,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(17)
  @Matches(/^\d+$/, { message: 'Bank account number must contain only digits' })
  bankAccountNumber?: string;
}
