import { useForm } from '@tanstack/react-form';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import type { AuthClientLike } from './auth-client-types';
import { CheckCircle, XCircle, Spinner } from '@phosphor-icons/react';

// Helper to extract error messages from TanStack Form validation errors
function getErrorMessages(errors: unknown[] | undefined): string {
  if (!errors || errors.length === 0) return '';
  return errors
    .map((err) => {
      if (typeof err === 'string') return err;
      if (err && typeof err === 'object' && 'message' in err)
        return (err as { message: string }).message;
      return String(err);
    })
    .filter(Boolean)
    .join(', ');
}

export function EmailPasswordForm({
  authClient,
  mode = 'sign-in',
  redirectTo = '/dashboard',
  onVerifyEmail,
  onSuccess,
}: {
  authClient: AuthClientLike;
  mode?: 'sign-in' | 'sign-up';
  redirectTo?: string;
  onVerifyEmail?: (email: string) => void;
  onSuccess?: (data: { data: unknown; error: unknown }) => void;
}) {
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>(
    'idle'
  );
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    if (!authClient.isUsernameAvailable) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    try {
      const result = await authClient.isUsernameAvailable({ username });
      setUsernameStatus(result.data?.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('idle');
    }
  };

  const handleUsernameChange = (username: string, onChange: (value: string) => void) => {
    onChange(username);

    // Debounce the availability check
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    const timeout = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);

    setUsernameCheckTimeout(timeout);
  };

  const signInForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (onSuccess) {
          onSuccess(result);
        } else {
          toast.success('Sign in successful', { description: 'Redirecting...' });
          window.location.assign(redirectTo);
        }
      } catch (err) {
        toast.error('Sign in failed', {
          description: err instanceof Error ? err.message : 'Invalid credentials',
        });
      }
    },
  });

  const signUpForm = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (usernameStatus === 'taken') {
        toast.error('Username taken', {
          description: 'Please choose a different username',
        });
        return;
      }
      try {
        await authClient.signUp.email({
          name: value.name,
          username: value.username,
          email: value.email,
          password: value.password,
        });
        toast.success('Account created', {
          description: 'Please verify your email to continue',
        });
        if (onVerifyEmail) {
          onVerifyEmail(value.email);
        }
      } catch (err) {
        toast.error('Sign up failed', {
          description: err instanceof Error ? err.message : 'Please try again',
        });
      }
    },
  });

  if (mode === 'sign-in') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signInForm.handleSubmit();
        }}
        className="space-y-3"
      >
        <signInForm.Field
          name="email"
          validators={{
            onChange: z.string().email('Please enter a valid email address'),
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </signInForm.Field>
        <signInForm.Field
          name="password"
          validators={{
            onChange: z.string().min(8, 'Password must be at least 8 characters'),
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </signInForm.Field>
        <signInForm.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }: { canSubmit: boolean; isSubmitting: boolean }) => (
            <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </signInForm.Subscribe>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        signUpForm.handleSubmit();
      }}
      className="space-y-3"
    >
      <signUpForm.Field
        name="name"
        validators={{
          onChange: z.string().min(2, 'Name must be at least 2 characters'),
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </signUpForm.Field>
      <signUpForm.Field
        name="username"
        validators={{
          onChange: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters')
            .regex(
              /^[a-zA-Z0-9_.]+$/,
              'Username can only contain letters, numbers, underscores, and dots'
            ),
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleUsernameChange(e.target.value, field.handleChange)
                }
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Spinner className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {usernameStatus === 'available' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {usernameStatus === 'taken' && <XCircle className="h-4 w-4 text-destructive" />}
              </div>
            </div>
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
            {usernameStatus === 'taken' && !field.state.meta.errors?.length && (
              <p className="text-sm text-destructive">Username is already taken</p>
            )}
            {usernameStatus === 'available' && (
              <p className="text-sm text-green-600">Username is available</p>
            )}
          </div>
        )}
      </signUpForm.Field>
      <signUpForm.Field
        name="email"
        validators={{
          onChange: z.string().email('Please enter a valid email address'),
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </signUpForm.Field>
      <signUpForm.Field
        name="password"
        validators={{
          onChange: z.string().min(8, 'Password must be at least 8 characters'),
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </signUpForm.Field>
      <signUpForm.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue('password')) {
              return "Passwords don't match";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </signUpForm.Field>
      <signUpForm.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }: { canSubmit: boolean; isSubmitting: boolean }) => (
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        )}
      </signUpForm.Subscribe>
    </form>
  );
}
