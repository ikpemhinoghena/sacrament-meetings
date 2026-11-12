import { Suspense, type ReactElement } from 'react';
import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import { fetchMeetingsApi } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';
import Loading from './loading';

export const metadata: Metadata = { title: 'Meeting archive' };

async function Archive(): Promise<ReactElement> {
  const response = await fetchMeetingsApi();
  if (!response.ok) throw new Error('Meeting archive could not be loaded.');
  const meetings: SacramentMeeting[] = await response.json();
  meetings.sort((a, b) => b.date.localeCompare(a.date));
  return <div className="mt-10">{meetings.length ? meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />) : <p>No meeting programs are available yet.</p>}</div>;
}

export default function MeetingsPage(): ReactElement {
  return <><p className="eyebrow">Programs to read & keep</p><h1 className="mt-4 font-serif text-5xl text-navy">Meeting archive</h1><p className="mt-5 max-w-xl leading-7 text-muted">Browse Sunday agendas and conference programs, with the most recent meeting first. Select a program to read or print.</p><Suspense fallback={<Loading />}><Archive /></Suspense></>;
}
