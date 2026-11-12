'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';

export default function NavLinks(): ReactElement {
  const pathname = usePathname();
  return <nav aria-label="Primary" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
    {[['/', 'Home'], ['/meetings', 'Meetings'], ['/meetings/current', 'Current Program']].map(([href, label]) => {
      const active = href === '/meetings' ? pathname.startsWith('/meetings') && pathname !== '/meetings/current' : pathname === href;
      return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`border-b-2 pb-2 ${active ? 'border-bronze text-ink' : 'border-transparent text-muted hover:border-bronze hover:text-ink'}`}>{label}</Link>;
    })}
  </nav>;
}
