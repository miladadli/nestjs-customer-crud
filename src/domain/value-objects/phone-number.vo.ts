import { PhoneNumber, PhoneNumberUtil } from 'google-libphonenumber';

export class PhoneNumberVO {
  private readonly value: string;
  private readonly phoneNumber: PhoneNumber;

  constructor(phoneNumber: string, countryCode: string = 'US') {
    this.validate(phoneNumber, countryCode);
    this.value = phoneNumber;
    this.phoneNumber = PhoneNumberUtil.getInstance().parse(phoneNumber, countryCode);
  }

  private validate(phoneNumber: string, countryCode: string): void {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error('Phone number cannot be empty');
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    const parsedNumber = phoneUtil.parse(phoneNumber, countryCode);

    if (!phoneUtil.isValidNumber(parsedNumber)) {
      throw new Error('Invalid phone number format');
    }

    if (!phoneUtil.getNumberType(parsedNumber) === PhoneNumberUtil.PhoneNumberType.MOBILE) {
      throw new Error('Phone number must be a mobile number');
    }
  }

  getValue(): string {
    return this.value;
  }

  getFormattedNumber(): string {
    return PhoneNumberUtil.getInstance().format(this.phoneNumber, PhoneNumberUtil.PhoneNumberFormat.E164);
  }

  getCountryCode(): string {
    return this.phoneNumber.getCountryCode().toString();
  }

  getNationalNumber(): string {
    return this.phoneNumber.getNationalNumber().toString();
  }

  equals(other: PhoneNumberVO): boolean {
    return this.getFormattedNumber() === other.getFormattedNumber();
  }

  toString(): string {
    return this.getFormattedNumber();
  }
} 