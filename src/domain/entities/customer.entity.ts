import { Email } from '../value-objects/email.vo';
import { PhoneNumberVO } from '../value-objects/phone-number.vo';
import { BankAccount } from '../value-objects/bank-account.vo';

export class Customer {
  private readonly id?: string;
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly dateOfBirth: Date;
  private readonly phoneNumber: PhoneNumberVO;
  private readonly email: Email;
  private readonly bankAccountNumber: BankAccount;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: string | undefined,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber: PhoneNumberVO,
    email: Email,
    bankAccountNumber: BankAccount,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.validate(firstName, lastName, dateOfBirth);
    this.id = id;
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.bankAccountNumber = bankAccountNumber;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validate(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    if (!dateOfBirth) {
      throw new Error('Date of birth cannot be empty');
    }
    if (dateOfBirth > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }
    const age = this.calculateAge(dateOfBirth);
    if (age < 18) {
      throw new Error('Customer must be at least 18 years old');
    }
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  }

  getId(): string | undefined {
    return this.id;
  }
  getFirstName(): string {
    return this.firstName;
  }
  getLastName(): string {
    return this.lastName;
  }
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  getDateOfBirth(): Date {
    return this.dateOfBirth;
  }
  getPhoneNumber(): PhoneNumberVO {
    return this.phoneNumber;
  }
  getEmail(): Email {
    return this.email;
  }
  getBankAccountNumber(): BankAccount {
    return this.bankAccountNumber;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  isSamePerson(other: Customer): boolean {
    return (
      this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
      this.lastName.toLowerCase() === other.lastName.toLowerCase() &&
      this.dateOfBirth.getTime() === other.dateOfBirth.getTime()
    );
  }
  hasSameEmail(other: Customer): boolean {
    return this.email.equals(other.email);
  }
  getAge(): number {
    return this.calculateAge(this.dateOfBirth);
  }
  static create(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber: PhoneNumberVO,
    email: Email,
    bankAccountNumber: BankAccount,
  ): Customer {
    return new Customer(
      undefined,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      bankAccountNumber,
    );
  }
}
