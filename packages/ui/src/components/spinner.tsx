import { SpinnerIcon } from '@phosphor-icons/react';
import { cn } from '@workspace/ui/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <SpinnerIcon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  );
}

export { Spinner };
