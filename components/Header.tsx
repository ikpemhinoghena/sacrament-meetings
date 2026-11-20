import Link from 'next/link';
import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { formatDate, localDate, wardName } from '@/lib/dates';
import NavLinks from './NavLinks';

export default async function Header(): Promise<ReactElement> {
  await connection();
  const today = localDate();
  return <header className="no-print border-b border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-7 md:flex-row md:items-end md:justify-between">
      <div><Link href="/" className="font-serif text-2xl text-navy">{wardName}</Link><p className="mt-1 text-xs tracking-wide text-muted">Lagos, Nigeria</p></div>
      <div className="flex flex-col gap-4 md:items-end"><time dateTime={today} className="text-xs text-muted">{formatDate(today)} · WAT</time><NavLinks /></div>
    </div>
  </header>;
}
