import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import AiDevtools from '../lib/ai-devtools';

import StoreDevtools from '@/features/demo/lib/store-devtools';

export function Devtools() {
  return (
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        AiDevtools,
        StoreDevtools,
        TanStackQueryDevtools,
      ]}
    />
  );
}
