import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { authClient } from '@/lib/auth-client';

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.resetPassword({ newPassword: password, token });
      setMessage('Password reset successful. You can sign in now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="new-password" className="text-sm text-foreground">
          New password
        </label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
}
