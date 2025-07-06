export class BankAccount {
  private readonly value: string;

  constructor(accountNumber: string) {
    this.validate(accountNumber);
    this.value = accountNumber.replace(/\s/g, ''); // Remove spaces
  }

  private validate(accountNumber: string): void {
    if (!accountNumber || accountNumber.trim().length === 0) {
      throw new Error('Bank account number cannot be empty');
    }

    const cleanNumber = accountNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanNumber)) {
      throw new Error('Bank account number must contain only digits');
    }

    if (cleanNumber.length < 8 || cleanNumber.length > 17) {
      throw new Error('Bank account number must be between 8 and 17 digits');
    }

    if (!this.isValidLuhn(cleanNumber)) {
      throw new Error('Invalid bank account number checksum');
    }
  }

  private isValidLuhn(number: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  getValue(): string {
    return this.value;
  }

  getMaskedValue(): string {
    if (this.value.length <= 4) {
      return this.value;
    }
    return '*'.repeat(this.value.length - 4) + this.value.slice(-4);
  }

  equals(other: BankAccount): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
} 