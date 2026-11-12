import { Suspense, type ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { fetchMeetingsApi } from '@/lib/api';
import { parseMeetingId } from '@/lib/dates';
import type { SacramentMeeting } from '@/lib/types';
import Loading from '../loading';

async function Program({ params, searchParams }: PageProps<'/meetings/[id]'>): Promise<ReactElement> {
  await connection();
  const id = parseMeetingId((await params).id);
  if (id === null) notFound();
  const response = await fetchMeetingsApi(`/${id}`);
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error('This meeting program could not be loaded.');
  const meeting: SacramentMeeting = await response.json();
  const query = await searchParams;
  return <>{query.fallback === '1' && <p role="status" className="no-print mx-auto mb-6 max-w-3xl border-l-2 border-bronze bg-paper p-4 text-sm leading-6">No program is available for the latest Sunday. Showing the most recent available past meeting, dated below.</p>}<div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between gap-4"><p className="eyebrow">Meeting program</p><PrintButton /></div><MeetingDetail meeting={meeting} /></>;
}

export default function MeetingPage(props: PageProps<'/meetings/[id]'>): ReactElement {
  return <Suspense fallback={<Loading />}><Program {...props} /></Suspense>;
}
