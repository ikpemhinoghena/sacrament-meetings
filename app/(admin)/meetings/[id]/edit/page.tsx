import { Suspense, type ReactElement } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import EditMeetingForm from '@/components/EditMeetingForm';
import ResetWhenHidden from '@/components/ResetWhenHidden';
import { getMeetingById } from '@/lib/meetings-db';
import { formatDate, meetingLabels, parseMeetingId } from '@/lib/dates';

export const metadata: Metadata = { title: 'Edit meeting' };

async function EditMeeting({ params }: PageProps<'/meetings/[id]/edit'>): Promise<ReactElement> {
  await connection();
  const id = parseMeetingId((await params).id);
  if (id === null) notFound();
  const meeting = await getMeetingById(id);
  if (!meeting) notFound();
  return <>
    <p className="mt-5 max-w-xl leading-7 text-muted">{meetingLabels[meeting.meetingType]} · <time dateTime={meeting.date}>{formatDate(meeting.date)}</time></p>
    <ResetWhenHidden><EditMeetingForm key={JSON.stringify(meeting)} meeting={meeting} /></ResetWhenHidden>
  </>;
}

export default function EditMeetingPage(props: PageProps<'/meetings/[id]/edit'>): ReactElement {
  return <>
    <p className="eyebrow">Bishopric planning</p>
    <h1 className="mt-4 font-serif text-4xl text-navy sm:text-5xl">Edit meeting</h1>
    <Suspense fallback={<div className="min-h-screen"><p role="status" className="py-12 text-muted">Loading meeting…</p></div>}><EditMeeting {...props} /></Suspense>
  </>;
}
