'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

export default function MeetingError({ reset }: { error: Error & { digest?: string }; reset: () => void }): ReactElement {
  return <section className="py-10"><h1 className="font-serif text-4xl">The program could not be loaded</h1><p className="mt-4 text-muted">Please try again in a moment.</p><div className="mt-6 flex flex-wrap items-center gap-6"><button className="button" onClick={reset}>Try again</button><Link href="/" className="underline underline-offset-4">Return home</Link></div></section>;
}
