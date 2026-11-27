import { Suspense, type ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetingSearchResults, normalizePage } from '@/lib/meetings-db';
import Loading from './loading';

export const metadata: Metadata = { title: 'Meeting archive' };

async function Archive({ searchParams }: PageProps<'/meetings'>): Promise<ReactElement> {
  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : '';
  const rawPage = typeof params.page === 'string' ? params.page : undefined;
  const { meetings, total, totalPages, page } = await getMeetingSearchResults(query, normalizePage(rawPage));
  if (params.page !== undefined && rawPage !== String(page)) {
    const canonical = new URLSearchParams({ page: String(page) });
    if (query) canonical.set('query', query);
    redirect(`/meetings?${canonical.toString()}`);
  }
  return <>
    <MeetingSearch query={query} />
    <div className="mt-10">
      <p role="status" className="mb-4 text-sm text-muted">{total} {total === 1 ? 'meeting' : 'meetings'} found</p>
      {meetings.length ? meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />) : <p>{query ? 'No meetings match your search.' : 'No meeting programs are available yet.'}</p>}
    </div>
    <Pagination page={page} totalPages={totalPages} query={query} />
  </>;
}

export default function MeetingsPage(props: PageProps<'/meetings'>): ReactElement {
  return <><p className="eyebrow">Programs to read & keep</p><h1 className="mt-4 font-serif text-5xl text-navy">Meeting archive</h1><p className="mt-5 max-w-xl leading-7 text-muted">Browse Sunday agendas and conference programs, with the most recent meeting first. Select a program to read or print.</p><Link href="/meetings/new" className="button no-print mt-8">Add meeting</Link><Suspense fallback={<div className="min-h-[88rem] sm:min-h-[62rem]"><Loading /></div>}><Archive {...props} /></Suspense></>;
}
