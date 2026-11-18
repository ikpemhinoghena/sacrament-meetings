'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [input, setInput] = useState({ query, value: query });
  if (input.query !== query) setInput({ query, value: query });
  const search = useDebouncedCallback((value: string) => {
    if (value === query) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('query', value);
    else params.delete('query');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);
  useEffect(() => () => search.cancel(), [query, search]);

  return <div role="search" className="mt-8 max-w-xl">
    <label htmlFor="meeting-search" className="block text-sm font-medium text-navy">Search meetings</label>
    <input id="meeting-search" type="search" value={input.value} onChange={(event) => { setInput({ query, value: event.target.value }); search(event.target.value); }} aria-describedby="meeting-search-help" className="mt-2 w-full border border-line bg-paper px-4 py-3 text-ink" />
    <p id="meeting-search-help" className="mt-2 text-sm text-muted">Search by speaker, presiding or conducting leader, or meeting type.</p>
  </div>;
}
