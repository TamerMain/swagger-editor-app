'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  validateEmail,
  validatePassword,
  type ValidationErrorCode,
} from '@/lib/validation/auth';

type ServerErrorCode =
  | 'credentialsInvalid'
  | 'emailTaken'
  | 'emailNotConfirmed'
  | 'rateLimited'
  | 'unknown';

export type AuthActionError = ValidationErrorCode | ServerErrorCode;

function mapSupabaseError(code: string | undefined): AuthActionError {
  switch (code) {
    case 'invalid_credentials':
      return 'credentialsInvalid';
    case 'user_already_exists':
    case 'email_exists':
      return 'emailTaken';
    case 'email_not_confirmed':
      return 'emailNotConfirmed';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'rateLimited';
    default:
      return 'unknown';
  }
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ errors: AuthActionError[] } | null> {
  const errors: AuthActionError[] = [
    ...validateEmail(email),
    ...validatePassword(password),
  ];

  if (errors.length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { errors: [mapSupabaseError(error.code)] };
  }

  revalidatePath('/');
  return null;
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ errors: AuthActionError[] } | null> {
  const errors: AuthActionError[] = [];
  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) errors.push(...emailErrors);
  if (password.length === 0) errors.push('credentialsInvalid');

  if (errors.length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { errors: [mapSupabaseError(error.code)] };
  }

  revalidatePath('/');
  return null;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
}

export async function getSession() {
  const supabase = await createClient();
  return await supabase.auth.getSession();
}
