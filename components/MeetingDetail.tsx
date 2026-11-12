import type { ReactElement, ReactNode } from 'react';
import type { Hymn, SacramentMeeting } from '@/lib/types';
import { formatDate, meetingLabels, wardName } from '@/lib/dates';

function AgendaRow({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return <div className="agenda-row grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6"><dt className="text-sm text-muted">{label}</dt><dd>{children}</dd></div>;
}

function hymnText(hymn: Hymn): string {
  return `No. ${hymn.number} · ${hymn.title}`;
}

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }): ReactElement {
  const isSacrament = meeting.meetingType === 'regular' || meeting.meetingType === 'testimony';
  return <article className="program mx-auto max-w-3xl border border-line bg-paper px-6 py-10 sm:px-12 sm:py-12">
    <header className="border-b border-line pb-8 text-center"><p className="eyebrow">{wardName} · Lagos, Nigeria</p><h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{meetingLabels[meeting.meetingType]}</h1><p className="mt-4 text-muted"><time dateTime={meeting.date}>{formatDate(meeting.date)}</time></p></header>
    <section className="agenda-section py-6" aria-labelledby="leadership"><h2 id="leadership" className="eyebrow mb-2">Meeting leadership</h2><dl><AgendaRow label="Presiding">{meeting.presiding}</AgendaRow><AgendaRow label="Conducting">{meeting.conducting}</AgendaRow></dl></section>
    {!!meeting.announcements?.length && <section className="agenda-section border-t border-line py-6" aria-labelledby="announcements"><h2 id="announcements" className="eyebrow mb-3">Announcements</h2><ul className="list-disc space-y-2 pl-5 text-sm leading-6">{meeting.announcements.map((announcement) => <li key={announcement}>{announcement}</li>)}</ul></section>}
    <section className="agenda-section border-t border-line py-6" aria-labelledby="opening"><h2 id="opening" className="eyebrow mb-2">Opening & business</h2><dl><AgendaRow label="Opening hymn">{hymnText(meeting.openingHymn)}</AgendaRow><AgendaRow label="Invocation">{meeting.openingPrayer}</AgendaRow>{meeting.wardBusiness.length > 0 && <AgendaRow label="Ward business"><ul className="space-y-2">{meeting.wardBusiness.map((item) => <li key={item.description}>{item.description}</li>)}</ul></AgendaRow>}<AgendaRow label="Stake business">{meeting.stakeBusiness ? 'Stake business will be presented.' : 'None scheduled.'}</AgendaRow></dl></section>
    {isSacrament && <section className="agenda-section border-y border-line py-6" aria-labelledby="sacrament"><h2 id="sacrament" className="eyebrow mb-2">The sacrament</h2><dl><AgendaRow label="Sacrament hymn">{hymnText(meeting.sacramentHymn)}</AgendaRow></dl><p className="mt-3 font-serif text-xl">Administration of the sacrament</p></section>}
    <section className="agenda-section py-6" aria-labelledby="messages"><h2 id="messages" className="eyebrow mb-4">{meeting.meetingType === 'testimony' ? 'Bearing testimony' : isSacrament ? 'Messages & music' : 'Conference messages & music'}</h2>{meeting.meetingType === 'testimony' && <p className="leading-7">Members of the congregation are invited to share brief testimonies of Jesus Christ and His gospel.</p>}<ol className="space-y-5">{meeting.speakers.map((item, index) => <li key={`${item.name}-${index}`} className="agenda-row"><p className="text-xs text-muted">{item.type === 'musical-number' ? 'Musical number' : 'Speaker'}</p><p className="mt-1 font-medium">{item.name}</p><p className="mt-1 text-sm text-muted">{item.topic}</p></li>)}</ol>{meeting.speakers.length === 0 && meeting.meetingType !== 'testimony' && <p className="text-sm text-muted">No individual messages listed.</p>}</section>
    <section className="agenda-section border-t border-line pt-6" aria-labelledby="closing"><h2 id="closing" className="eyebrow mb-2">Closing</h2><dl><AgendaRow label="Closing hymn">{hymnText(meeting.closingHymn)}</AgendaRow><AgendaRow label="Benediction">{meeting.closingPrayer}</AgendaRow></dl></section>
  </article>;
}
