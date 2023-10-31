import { ModeContextProvider } from '@-ft/mode-next';
import { cookies } from 'next/headers';
import React from 'react';

import './tailwind.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cookies().get('theme')?.value === 'dark' ? 'dark' : undefined}
      suppressHydrationWarning
    >
      <head>
        <title>ft_transcendence</title>
        <link rel="icon" href="/favicon.ico" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/script/mode.js" />
      </head>
      <body className="bg-background text-text">
        <ModeContextProvider variableName="npm:@-ft/mode-codegen">
          {children}
        </ModeContextProvider>
      </body>
    </html>
  );
}
