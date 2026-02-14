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

export function TwoFactorForm({
  authClient,
  redirectTo = '/dashboard',
}: {
  authClient: AuthClientLike;
  redirectTo?: string;
}) {
  const twoFactor = authClient.twoFactor;
  const [method, setMethod] = useState<'totp' | 'email'>('totp');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const totpForm = useForm({
    defaultValues: {
      code: '',
      trustDevice: false,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        if (!twoFactor) return;
        await twoFactor.verifyTotp({ code: value.code });
        toast.success('Verification successful', {
          description: 'Redirecting...',
        });
        window.location.assign(redirectTo);
      } catch (err) {
        toast.error('Verification failed', {
          description: err instanceof Error ? err.message : 'Invalid code',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const emailForm = useForm({
    defaultValues: {
      code: '',
      trustDevice: false,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        if (!twoFactor) return;
        await twoFactor.verifyOtp({
          code: value.code,
          trustDevice: value.trustDevice,
        });
        toast.success('Verification successful', {
          description: 'Redirecting...',
        });
        window.location.assign(redirectTo);
      } catch (err) {
        toast.error('Verification failed', {
          description: err instanceof Error ? err.message : 'Invalid code',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const sendEmailOtp = async () => {
    setLoading(true);
    try {
      if (!twoFactor) return;
      await twoFactor.sendOtp();
      setOtpSent(true);
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
  };

  if (!twoFactor) {
    return (
      <div className="text-sm text-muted-foreground">
        Two-factor authentication is not enabled for this app.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <Button
          type="button"
          variant={method === 'totp' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setMethod('totp')}
        >
          Authenticator App
        </Button>
        <Button
          type="button"
          variant={method === 'email' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => {
            setMethod('email');
            if (!otpSent) {
              sendEmailOtp();
            }
          }}
        >
          Email OTP
        </Button>
      </div>

      {method === 'totp' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            totpForm.handleSubmit();
          }}
          className="space-y-3"
        >
          <totpForm.Field
            name="code"
            validators={{
              onChange: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="totp-code">Authentication Code</Label>
                <Input
                  id="totp-code"
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {getErrorMessages(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </totpForm.Field>
          <totpForm.Field name="trustDevice">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  id="trust-device-totp"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="trust-device-totp" className="text-sm">
                  Trust this device for 30 days
                </label>
              </div>
            )}
          </totpForm.Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            emailForm.handleSubmit();
          }}
          className="space-y-3"
        >
          <emailForm.Field
            name="code"
            validators={{
              onChange: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="email-code">Email Code</Label>
                <Input
                  id="email-code"
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  disabled={!otpSent}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {getErrorMessages(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </emailForm.Field>
          <emailForm.Field name="trustDevice">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  id="trust-device-email"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.checked)
                  }
                  className="h-4 w-4"
                  disabled={!otpSent}
                />
                <label htmlFor="trust-device-email" className="text-sm">
                  Trust this device for 30 days
                </label>
              </div>
            )}
          </emailForm.Field>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={sendEmailOtp}
              disabled={loading}
            >
              {otpSent ? 'Resend OTP' : 'Send OTP'}
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !otpSent}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
