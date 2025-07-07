import { NAME_REGEX, EMAIL_REGEX, BANK_ACCOUNT_REGEX } from '../constants/regex';

export function isValidName(name: string): boolean {
  return NAME_REGEX.test(name);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidBankAccount(account: string): boolean {
  return BANK_ACCOUNT_REGEX.test(account);
} 