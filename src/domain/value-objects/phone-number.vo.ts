import { PhoneNumberUtil } from 'google-libphonenumber';

export class PhoneNumberVO {
  private readonly value: string;
  private readonly phoneNumber: any;

  constructor(phoneNumber: string, countryCode: string = 'US') {
    this.validate(phoneNumber, countryCode);
    this.value = phoneNumber;
    this.phoneNumber = PhoneNumberUtil.getInstance().parseAndKeepRawInput(
      phoneNumber,
      countryCode,
    );
  }

  private validate(phoneNumber: string, countryCode: string): void {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error('Phone number cannot be empty');
    }

    const libphonenumber = require('google-libphonenumber');
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    const parsedNumber = phoneUtil.parseAndKeepRawInput(
      phoneNumber,
      countryCode,
    );

    if (!phoneUtil.isValidNumber(parsedNumber)) {
      throw new Error('Invalid phone number format');
    }

    const numberType = phoneUtil.getNumberType(parsedNumber);
    if (
      numberType !== libphonenumber.PhoneNumberType.MOBILE &&
      numberType !== libphonenumber.PhoneNumberType.FIXED_LINE_OR_MOBILE
    ) {
      throw new Error('Phone number must be a valid mobile number');
    }
  }

  getValue(): string {
    return this.value;
  }

  getFormattedNumber(): string {
    const libphonenumber = require('google-libphonenumber');
    return libphonenumber.PhoneNumberUtil.getInstance().format(
      this.phoneNumber,
      libphonenumber.PhoneNumberFormat.E164,
    );
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
