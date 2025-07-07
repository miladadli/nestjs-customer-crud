import { BankAccount } from '../../../src/domain/value-objects/bank-account.vo';

describe('BankAccount Value Object', () => {
  it('should create a valid bank account number', () => {
    // 79927398713 is a valid Luhn number
    const account = new BankAccount('79927398713');
    expect(account.getValue()).toBe('79927398713');
  });

  it('should throw error for empty account number', () => {
    expect(() => new BankAccount('')).toThrow('Bank account number cannot be empty');
  });

  it('should throw error for non-digit account number', () => {
    expect(() => new BankAccount('abc123')).toThrow('Bank account number must contain only digits');
  });

  it('should throw error for too short account number', () => {
    expect(() => new BankAccount('1234567')).toThrow('Bank account number must be between 8 and 17 digits');
  });

  it('should throw error for too long account number', () => {
    expect(() => new BankAccount('123456789012345678')).toThrow('Bank account number must be between 8 and 17 digits');
  });

  it('should throw error for invalid Luhn checksum', () => {
    expect(() => new BankAccount('123456789')).toThrow('Invalid bank account number checksum');
  });

  it('should mask the account number', () => {
    const account = new BankAccount('79927398713');
    expect(account.getMaskedValue()).toBe('*******8713');
  });
});
