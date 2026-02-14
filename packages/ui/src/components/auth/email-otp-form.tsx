import { useForm } from '@tanstack/react-form';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import type { AuthClientLike } from './auth-client-types';

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

export function EmailOtpForm({
  authClient,
  mode = 'sign-in',
  redirectTo = '/dashboard',
  onVerifyEmail,
  onSuccess,
}: {
  authClient: AuthClientLike;
  mode?: 'sign-in' | 'verify-email';
  redirectTo?: string;
  onVerifyEmail?: (email: string) => void;
  onSuccess?: (data: { data: unknown; error: unknown }) => void;
}) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email: value.email,
          type: mode === 'verify-email' ? 'email-verification' : 'sign-in',
        });
        otpForm.setFieldValue('email', value.email);
        setSent(true);
        toast.success('OTP sent', {
          description: 'Check your email for the verification code',
        });
      } catch (err) {
        toast.error('Failed to send OTP', {
          description: err instanceof Error ? err.message : 'Please try again',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const otpForm = useForm({
    defaultValues: {
      email: '',
      otp: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        if (mode === 'verify-email') {
          await authClient.emailOtp.verifyEmail({
            email: value.email,
            otp: value.otp,
          });
          toast.success('Email verified', {
            description: 'You can now sign in to your account',
          });
          onVerifyEmail?.(value.email);
        } else {
          const result = await authClient.signIn.emailOtp({
            email: value.email,
            otp: value.otp,
          });

          if (onSuccess) {
            onSuccess(result);
          } else {
            toast.success('Sign in successful', {
              description: 'Redirecting...',
            });
            window.location.assign(redirectTo);
          }
        }
      } catch (err) {
        toast.error('Verification failed', {
          description: err instanceof Error ? err.message : 'Invalid code',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  if (!sent) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          emailForm.handleSubmit();
        }}
        className="space-y-3"
      >
        <emailForm.Field
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
        </emailForm.Field>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        otpForm.handleSubmit();
      }}
      className="space-y-3"
    >
      <otpForm.Field
        name="otp"
        validators={{
          onChange: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              placeholder="123456"
              maxLength={6}
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
      </otpForm.Field>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            setSent(false);
            otpForm.reset();
          }}
        >
          Change Email
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Verifying...' : mode === 'verify-email' ? 'Verify' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
