'use client';

import { useFormStatus } from 'react-dom';
import type { FormEvent, ReactElement } from 'react';
import { deleteMeeting } from '@/lib/actions';

function SubmitButton({ label }: { label: string }): ReactElement {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-label={pending ? `Deleting meeting for ${label}` : `Delete meeting for ${label}`} className="text-sm text-danger underline underline-offset-4 disabled:cursor-progress">{pending ? 'Deleting…' : 'Delete'}</button>;
}

export default function DeleteMeetingButton({ id, label }: { id: number; label: string }): ReactElement {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete the meeting for ${label}? This cannot be undone.`)) event.preventDefault();
  }
  return <form action={deleteMeeting} onSubmit={confirmDelete}>
    <input type="hidden" name="id" value={id} />
    <SubmitButton label={label} />
  </form>;
}
