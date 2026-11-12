import Link from 'next/link';
import type { ReactElement } from 'react';

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>): ReactElement {
  return <div className="meetings-shell mx-auto max-w-6xl px-6 pb-16 pt-8"><nav aria-label="Meeting section" className="no-print mb-10 flex flex-wrap gap-6 text-xs text-muted"><Link href="/meetings" className="hover:text-navy underline underline-offset-4">Meeting archive</Link><Link href="/meetings/current" className="hover:text-navy underline underline-offset-4">Latest Sunday program</Link></nav>{children}</div>;
}
