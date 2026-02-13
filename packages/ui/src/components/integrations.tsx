import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/components/button';
import { cn } from '@workspace/ui/lib/utils';

type Integration = {
  src: string;
  name: string;
  description: string;
  isInvertable?: boolean;
};

const data: Integration[] = [
  {
    src: 'https://storage.efferd.com/logo/vercel.svg',
    name: 'Vercel',
    description: 'Amet praesentium deserunt ex commodi tempore fuga....',
    isInvertable: true,
  },
  {
    src: 'https://storage.efferd.com/logo/openai.svg',
    name: 'OpenAI',
    description: 'Amet praesentium deserunt ex commodi tempore fuga....',
    isInvertable: true,
  },
  {
    src: 'https://storage.efferd.com/logo/supabase.svg',
    name: 'Supabase',
    description: 'Amet praesentium deserunt ex commodi tempore fuga....',
  },
  {
    src: 'https://storage.efferd.com/logo/notion.svg',
    name: 'Notion',
    description: 'Amet praesentium deserunt ex commodi tempore fuga....',
  },
];

export function Integrations() {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-5xl gap-1 overflow-hidden rounded-md bg-secondary p-1 sm:grid-cols-2 lg:grid-cols-4 dark:bg-secondary/50'
      )}
    >
      {data.map((item) => (
        <div
          className={cn(
            'group relative flex flex-col justify-between gap-2 rounded-md bg-background p-6 shadow-sm'
          )}
          key={item.name}
        >
          <img
            alt={item.name}
            className={cn(
              'pointer-events-none size-8 shrink-0 select-none object-contain',
              item.isInvertable && 'dark:invert'
            )}
            height={32}
            src={item.src}
            width={32}
          />
          <div className="space-y-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-muted-foreground text-xs md:text-sm">{item.description}</p>
          </div>
        </div>
      ))}
      <div className="relative flex items-center justify-center p-1 sm:col-span-2 lg:col-span-4">
        <Button
          className="group text-xs"
          size="sm"
          variant="link"
          render={<a href="#" />}
          nativeButton={false}
        >
          View all integrations
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
