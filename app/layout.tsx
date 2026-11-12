import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Suspense } from 'react';
import { Geist } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Palm Grove Ward | Meeting Planner', template: '%s | Palm Grove Ward' },
  description: 'View and print meeting programs for Palm Grove Ward, Lagos.',
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactElement {
  return <html lang="en" className={`${geist.variable} h-full antialiased`}><body className="flex min-h-full flex-col"><a href="#main-content" className="skip-link no-print">Skip to content</a><Suspense fallback={<div className="no-print h-36" />}><Header /></Suspense><main id="main-content" className="flex-1">{children}</main><Footer /></body></html>;
}
