import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UserProvider } from '@/context/UserContext';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'InternSync',
  description: 'Academic Activity Monitoring Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <UserProvider>{children}</UserProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
