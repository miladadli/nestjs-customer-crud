import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber';

export function isValidMobilePhone(phone: string, countryCode: string = 'US'): boolean {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const parsed = phoneUtil.parse(phone, countryCode);
    return (
      phoneUtil.isValidNumber(parsed) &&
      phoneUtil.getNumberType(parsed) === PhoneNumberType.MOBILE
    );
  } catch {
    return false;
  }
} 