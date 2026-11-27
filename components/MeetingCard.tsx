import Link from 'next/link';
import type { ReactElement } from 'react';
import type { SacramentMeeting } from '@/lib/types';
import { formatDate, meetingLabels } from '@/lib/dates';
import DeleteMeetingButton from './DeleteMeetingButton';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }): ReactElement {
  const date = formatDate(meeting.date);
  return <article className="border-t border-line py-7 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-6">
    <div><p className="eyebrow mb-2">{meetingLabels[meeting.meetingType]}</p><h2 className="font-serif text-2xl"><Link className="hover:text-bronze" href={`/meetings/${meeting.id}`}><time dateTime={meeting.date}>{date}</time></Link></h2></div>
    <p className="my-4 text-sm text-muted">Conducting<br /><span className="mt-1 inline-block text-ink">{meeting.conducting}</span></p>
    <div className="no-print flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link href={`/meetings/${meeting.id}`} className="text-sm font-medium text-navy underline decoration-bronze underline-offset-4" aria-label={`View program for ${date}`}>View program <span aria-hidden="true">↗</span></Link>
      <Link href={`/meetings/${meeting.id}/edit`} className="text-sm text-navy underline underline-offset-4" aria-label={`Edit meeting for ${date}`}>Edit</Link>
      <DeleteMeetingButton id={meeting.id} label={date} />
    </div>
  </article>;
}
