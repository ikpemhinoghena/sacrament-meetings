import Link from 'next/link';
import type { ReactElement } from 'react';

export default function MeetingNotFound(): ReactElement {
  return <section className="py-10">
    <h1 className="font-serif text-4xl text-navy">Meeting not found</h1>
    <p className="mt-4 text-muted">This meeting may have been deleted, or the address may be incorrect.</p>
    <Link href="/meetings" className="button mt-8">Back to meetings</Link>
  </section>;
}
