'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, type ReactElement } from 'react';

export default function MeetingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }): ReactElement {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function tryAgain() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return <section role="alert" className="py-10">
    <h1 className="font-serif text-4xl text-navy">Something went wrong</h1>
    <p className="mt-4 max-w-xl leading-7 text-muted">We couldn’t complete that request for the meeting planner. Your connection or the meeting database may be temporarily unavailable. Please try again.</p>
    <div className="mt-6 flex flex-wrap items-center gap-6">
      <button type="button" className="button" onClick={tryAgain}>Try Again</button>
      <Link href="/meetings" className="text-sm text-navy underline underline-offset-4">Back to meetings</Link>
    </div>
  </section>;
}
