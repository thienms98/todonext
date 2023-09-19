'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo',
  description: 'My Todo with Nextjs',
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          {children}
          {modal}
        </Provider>
      </body>
    </html>
  );
}
