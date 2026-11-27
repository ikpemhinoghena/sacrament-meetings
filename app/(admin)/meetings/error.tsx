'use client';

import type { ReactElement } from 'react';
import MeetingsError from '@/components/MeetingsError';

export default function MeetingAdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }): ReactElement {
  return <MeetingsError error={error} reset={reset} />;
}
