import { useForm } from '@tanstack/react-form';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import type { AuthClientLike } from './auth-client-types';
import { QRCodeSVG } from 'qrcode.react';

export function TwoFactorSetupForm({
  authClient,
  redirectTo = '/_dashboard/dashboard',
}: {
  authClient: AuthClientLike;
  redirectTo?: string;
}) {
  const twoFactor = authClient.twoFactor;
  const [step, setStep] = useState<'enter-password' | 'scan-qr' | 'verified'>('enter-password');
  const [loading, setLoading] = useState(false);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const passwordForm = useForm({
    defaultValues: {
      password: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        if (!twoFactor) return;
        const res = await twoFactor.enable({ password: value.password });
        if (res.error || !res.data) {
          toast.error('Could not start 2FA setup', {
            description: 'No TOTP URI received',
          });
          return;
        }

        setTotpUri(res.data.totpURI);
        setBackupCodes(res.data.backupCodes);
        setStep('scan-qr');
        toast.success('2FA enabled (pending verification)');
      } catch (err) {
        toast.error('Enable 2FA failed', {
          description: err instanceof Error ? err.message : 'Please check your password',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const verifyForm = useForm({
    defaultValues: {
      code: '',
      trustDevice: true,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        if (!twoFactor) return;
        await twoFactor.verifyTotp({
          code: value.code,
          trustDevice: value.trustDevice,
        });
        toast.success('2FA verified', { description: "You're all set" });
        setStep('verified');
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

  if (!twoFactor) {
    return (
      <div className="text-sm text-muted-foreground">
        Two-factor authentication is not enabled for this app.
      </div>
    );
  }

  if (step === 'enter-password') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          passwordForm.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="password">Confirm Password</Label>
          <passwordForm.Field
            name="password"
            validators={{ onChange: z.string().min(6, 'Password required') }}
          >
            {(field) => (
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              />
            )}
          </passwordForm.Field>
        </div>
        <div className="text-xs text-muted-foreground">
          Enabling 2FA will generate backup codes. Store them in a safe place.
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enabling...' : 'Enable 2FA'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => (window.location.href = '/auth/two-factor')}
        >
          Use Email OTP instead
        </Button>
      </form>
    );
  }

  if (step === 'scan-qr') {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <div className="inline-block rounded-md border p-4 bg-background">
            {totpUri ? <QRCodeSVG value={totpUri} size={180} /> : null}
          </div>
          <div className="text-sm text-muted-foreground">
            Scan this QR with your authenticator app
          </div>
          <div className="text-xs break-all text-muted-foreground">{totpUri}</div>
        </div>

        {backupCodes && backupCodes.length > 0 && (
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-sm font-medium mb-2">Backup Codes</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {backupCodes.map((c, i) => (
                <code key={i} className="rounded bg-background px-2 py-1 border">
                  {c}
                </code>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Store these codes securely. Each can be used once.
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            verifyForm.handleSubmit();
          }}
          className="space-y-3"
        >
          <verifyForm.Field
            name="code"
            validators={{
              onChange: z.string().min(6, '6 digits').max(6, '6 digits'),
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="totp-code">Enter Code</Label>
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
              </div>
            )}
          </verifyForm.Field>
          <verifyForm.Field name="trustDevice">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  id="trust-device-setup"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="trust-device-setup" className="text-sm">
                  Trust this device for 30 days
                </label>
              </div>
            )}
          </verifyForm.Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Finish'}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => (window.location.href = '/auth/two-factor')}
        >
          Prefer Email OTP? Verify by Email
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-center">
      <div className="text-sm">Two-Factor Authentication is enabled.</div>
      <Button onClick={() => (window.location.href = redirectTo)}>Go to Dashboard</Button>
    </div>
  );
}
