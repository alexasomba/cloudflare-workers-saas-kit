import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import React, { Suspense, lazy } from 'react'
import Header from '../components/Header'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'

const Devtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('../components/Devtools').then((m) => ({ default: m.Devtools })),
      )

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <Suspense>
          <Devtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
