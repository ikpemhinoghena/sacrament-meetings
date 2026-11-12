import { Suspense, type ReactElement } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { fetchMeetingsApi } from '@/lib/api';
import { mostRecentSunday } from '@/lib/dates';
import type { SacramentMeeting } from '@/lib/types';
import Loading from '../loading';

async function CurrentProgram(): Promise<ReactElement> {
  await connection();
  const sunday = mostRecentSunday();
  const response = await fetchMeetingsApi();
  if (!response.ok) throw new Error('The current program could not be loaded.');
  const meetings: SacramentMeeting[] = await response.json();
  const current = meetings.find((meeting) => meeting.date === sunday);
  if (current) redirect(`/meetings/${current.id}`);
  const previous = meetings.filter((meeting) => meeting.date < sunday).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (previous) redirect(`/meetings/${previous.id}?fallback=1`);
  return <section><h1 className="font-serif text-4xl">No Sunday program available</h1><p className="mt-4">There is no program for this Sunday or an earlier meeting yet.</p><Link className="button mt-6" href="/meetings">Browse meeting archive</Link></section>;
}

export default function CurrentPage(): ReactElement {
  return <Suspense fallback={<Loading />}><CurrentProgram /></Suspense>;
}
