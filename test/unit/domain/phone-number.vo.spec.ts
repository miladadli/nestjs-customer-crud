import { PhoneNumberVO } from '../../../src/domain/value-objects/phone-number.vo';

describe('PhoneNumberVO Value Object', () => {
  it('should create a valid US mobile phone number', () => {
    // Example US mobile number
    const phone = new PhoneNumberVO('+14155552671');
    expect(phone.getFormattedNumber()).toBe('+14155552671');
  });

  it('should throw error for empty phone number', () => {
    expect(() => new PhoneNumberVO('')).toThrow('Phone number cannot be empty');
  });

  it('should throw error for invalid phone number', () => {
    expect(() => new PhoneNumberVO('12345')).toThrow('Invalid phone number format');
  });

  it('should throw error for non-mobile number', () => {
    // Example US toll-free (not mobile)
    expect(() => new PhoneNumberVO('+18005550199')).toThrow('Phone number must be a mobile number');
  });

  it('should compare equality correctly', () => {
    const phone1 = new PhoneNumberVO('+14155552671');
    const phone2 = new PhoneNumberVO('+1 415-555-2671');
    expect(phone1.equals(phone2)).toBe(true);
  });
});
