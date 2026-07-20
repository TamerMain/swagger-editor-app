import { PASSWORD_MIN_LENGTH } from '@/constants/constants';

export type ValidationErrorCode =
  | 'emailInvalid'
  | 'passwordTooShort'
  | 'passwordNoLetter'
  | 'passwordNoDigit'
  | 'passwordNoSpecial';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function validateEmail(email: string): ValidationErrorCode[] {
  return EMAIL_RE.test(email.trim()) ? [] : ['emailInvalid'];
}

export function validatePassword(password: string): ValidationErrorCode[] {
  const errors: ValidationErrorCode[] = [];

  if ([...password].length < PASSWORD_MIN_LENGTH) {
    errors.push('passwordTooShort');
  }
  if (!/\p{L}/u.test(password)) errors.push('passwordNoLetter');
  if (!/\p{N}/u.test(password)) errors.push('passwordNoDigit');
  if (!/[\p{P}\p{S}]/u.test(password)) errors.push('passwordNoSpecial');

  return errors;
}
