import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SIGNAL | Premium Intelligence',
  description: 'Data-focused SaaS for social media intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-text-primary min-h-screen font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
