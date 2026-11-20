import Link from 'next/link';
import type { ReactElement } from 'react';
import type { SacramentMeeting } from '@/lib/types';
import { formatDate, meetingLabels } from '@/lib/dates';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }): ReactElement {
  return <article className="border-t border-line py-7 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-6">
    <div><p className="eyebrow mb-2">{meetingLabels[meeting.meetingType]}</p><h2 className="font-serif text-2xl"><Link className="hover:text-bronze" href={`/meetings/${meeting.id}`}><time dateTime={meeting.date}>{formatDate(meeting.date)}</time></Link></h2></div>
    <p className="my-4 text-sm text-muted">Conducting<br /><span className="mt-1 inline-block text-ink">{meeting.conducting}</span></p>
    <Link href={`/meetings/${meeting.id}`} className="text-sm font-medium text-navy underline decoration-bronze underline-offset-4" aria-label={`View program for ${formatDate(meeting.date)}`}>View program <span aria-hidden="true">↗</span></Link>
  </article>;
}
