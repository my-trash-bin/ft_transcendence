import './style.css';

import { ModeContextProvider } from '@-ft/mode-next';
import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';
import { ApiContextProvider } from './_internal/provider/ApiContextProvider';
import { QueryClientProvider } from './_internal/provider/QueryClientProvider';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html
      className={cookies().get('theme')?.value === 'dark' ? 'dark' : undefined}
      suppressHydrationWarning
    >
      <head>
        <title>ft_transcendence</title>
        <link rel="icon" href="/avatar-black.ico" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/script/mode.js" />
      </head>
      <body className="bg-background text-text overflow-auto">
        <QueryClientProvider>
          <ApiContextProvider>
            <ModeContextProvider variableName="npm:@-ft/mode-codegen">
              {children}
            </ModeContextProvider>
          </ApiContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
