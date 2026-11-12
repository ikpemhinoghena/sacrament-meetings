import Link from 'next/link';
import type { ReactElement } from 'react';

export default function NotFound(): ReactElement {
  return <section className="mx-auto max-w-3xl px-6 py-20"><p className="eyebrow">Page not found</p><h1 className="mt-4 font-serif text-4xl">We couldn’t find that program.</h1><p className="mt-5 text-muted">The address may be incorrect, or the meeting is not in the archive.</p><Link href="/meetings" className="button mt-8">Browse meeting archive</Link></section>;
}
