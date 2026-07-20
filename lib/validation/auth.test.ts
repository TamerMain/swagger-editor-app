import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from './auth';

describe('validateEmail', () => {
  it.each(['user@example.com', 'a.b+c@sub.domain.co', '  spaced@mail.io  '])(
    'accepts %s',
    (email) => {
      expect(validateEmail(email)).toEqual([]);
    },
  );

  it.each(['', 'plain', 'no@tld', 'no domain@mail.com', '@example.com'])(
    'rejects %s',
    (email) => {
      expect(validateEmail(email)).toEqual(['emailInvalid']);
    },
  );
});

describe('validatePassword', () => {
  it('accepts a password meeting every rule', () => {
    expect(validatePassword('Passw0rd!')).toEqual([]);
  });

  it('accepts a Unicode password', () => {
    expect(validatePassword('Пароль1!')).toEqual([]);
  });

  it('reports a too short password', () => {
    expect(validatePassword('Ab1!')).toContain('passwordTooShort');
  });

  it('reports a missing letter', () => {
    expect(validatePassword('12345678!')).toContain('passwordNoLetter');
  });

  it('reports a missing digit', () => {
    expect(validatePassword('Password!')).toContain('passwordNoDigit');
  });

  it('reports a missing special character', () => {
    expect(validatePassword('Password1')).toContain('passwordNoSpecial');
  });

  it('reports every broken rule at once', () => {
    expect(validatePassword('abc')).toEqual([
      'passwordTooShort',
      'passwordNoDigit',
      'passwordNoSpecial',
    ]);
  });

  it('counts surrogate pairs as single characters', () => {
    expect(validatePassword('Ab1!😀😀😀')).toContain('passwordTooShort');
  });
});
