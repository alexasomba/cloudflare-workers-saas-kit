export type AuthClientError = {
  code?: string;
  message?: string;
  status?: number;
  statusText?: string;
};

// Mirrors the common BetterFetchResponse shape used by Better Auth's client endpoints.
export type AuthClientResponse<TData> =
  | { data: TData; error: null }
  | { data: null; error: AuthClientError };

type WithFetchOptions<T extends Record<string, unknown>> = T & {
  fetchOptions?: Record<string, unknown>;
};

export type AuthClientLike = {
  signIn: {
    social: (
      opts: WithFetchOptions<{ provider: string; callbackURL?: string }>
    ) => Promise<AuthClientResponse<unknown>>;
    email: (
      opts: WithFetchOptions<{
        email: string;
        password: string;
        rememberMe?: boolean;
        callbackURL?: string;
      }>
    ) => Promise<AuthClientResponse<unknown>>;
    emailOtp: (
      opts: WithFetchOptions<{ email: string; otp: string; callbackURL?: string }>
    ) => Promise<AuthClientResponse<unknown>>;
  };
  signUp: {
    email: (
      opts: WithFetchOptions<{
        email: string;
        password: string;
        name: string;
        username?: string;
        image?: string;
        callbackURL?: string;
      }>
    ) => Promise<AuthClientResponse<unknown>>;
  };
  emailOtp: {
    sendVerificationOtp: (
      opts: WithFetchOptions<{ email: string; type: 'sign-in' | 'email-verification' }>
    ) => Promise<AuthClientResponse<unknown>>;
    verifyEmail: (
      opts: WithFetchOptions<{ email: string; otp: string }>
    ) => Promise<AuthClientResponse<unknown>>;
  };
  requestPasswordReset?: (
    opts: WithFetchOptions<{ email: string; redirectTo: string }>
  ) => Promise<AuthClientResponse<unknown>>;
  resetPassword?: (
    opts: WithFetchOptions<{ newPassword: string; token: string }>
  ) => Promise<AuthClientResponse<unknown>>;
  isUsernameAvailable?: (
    opts: WithFetchOptions<{ username: string }>
  ) => Promise<AuthClientResponse<{ available: boolean }>>;
  twoFactor?: {
    enable: (
      opts: WithFetchOptions<{ password: string; issuer?: string }>
    ) => Promise<AuthClientResponse<{ totpURI: string; backupCodes: string[] }>>;
    verifyTotp: (
      opts: WithFetchOptions<{ code: string; trustDevice?: boolean }>
    ) => Promise<AuthClientResponse<unknown>>;
    verifyOtp: (
      opts: WithFetchOptions<{ code: string; trustDevice?: boolean }>
    ) => Promise<AuthClientResponse<unknown>>;
    sendOtp: (
      opts?: WithFetchOptions<Record<string, unknown>>
    ) => Promise<AuthClientResponse<unknown>>;
  };
  useSession?: () => {
    data: unknown;
    isPending: boolean;
    isRefetching: boolean;
    error: unknown;
    refetch: (queryParams?: {
      query?: {
        disableCookieCache?: boolean;
        disableRefresh?: boolean;
      };
    }) => Promise<void>;
  };
  signOut?: (
    opts?: WithFetchOptions<Record<string, unknown>>
  ) => Promise<AuthClientResponse<unknown>>;
};
