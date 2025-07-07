import { Email } from '../../../src/domain/value-objects/email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for empty email', () => {
    expect(() => new Email('')).toThrow('Email cannot be empty');
  });

  it('should throw error for invalid email format', () => {
    expect(() => new Email('invalid-email')).toThrow('Invalid email format');
  });

  it('should be case-insensitive and trimmed', () => {
    const email = new Email('  TEST@Example.com  ');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should compare equality correctly', () => {
    const email1 = new Email('a@b.com');
    const email2 = new Email('A@B.com');
    expect(email1.equals(email2)).toBe(true);
  });
});
