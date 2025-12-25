export const SUPABASE_AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "invalid_credentials",
  USER_ALREADY_EXISTS: "user_already_exists",
  EMAIL_NOT_CONFIRMED: "email_not_confirmed",
  SIGNUP_DISABLED: "signup_disabled",
  RATE_LIMITED: "over_request_rate_limit",
} as const;

export type KnownSupabaseAuthErrorCode =
  (typeof SUPABASE_AUTH_ERROR_CODES)[keyof typeof SUPABASE_AUTH_ERROR_CODES];

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  status?: number;
  name?: string;
};

export function getSupabaseAuthErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const { code } = error as SupabaseErrorLike;
  return typeof code === "string" && code.length > 0 ? code : null;
}

export function getSupabaseAuthErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const { message } = error as SupabaseErrorLike;
  return typeof message === "string" && message.length > 0 ? message : null;
}

export function authErrorMessageFromCode(code: string | null): string | null {
  switch (code) {
    case SUPABASE_AUTH_ERROR_CODES.INVALID_CREDENTIALS:
      return "Invalid email or password.";
    case SUPABASE_AUTH_ERROR_CODES.USER_ALREADY_EXISTS:
      return "An account with this email already exists.";
    case SUPABASE_AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED:
      return "Please confirm your email before signing in.";
    case SUPABASE_AUTH_ERROR_CODES.SIGNUP_DISABLED:
      return "Signups are currently disabled.";
    case SUPABASE_AUTH_ERROR_CODES.RATE_LIMITED:
      return "Too many attempts. Try again later.";
    default:
      return null;
  }
}
