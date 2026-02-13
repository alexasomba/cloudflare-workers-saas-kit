import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { authClient } from '@/lib/auth-client';

export function RequestResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      await authClient.requestPasswordReset({ email, redirectTo });
      setMessage('If the email exists, a reset link was sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
