import Link from 'next/link';

export default function Pagination({ page, totalPages, query }: { page: number; totalPages: number; query: string }) {
  function href(target: number) {
    const params = new URLSearchParams({ page: String(target) });
    if (query) params.set('query', query);
    return `/meetings?${params.toString()}`;
  }

  return <nav aria-label="Meeting archive pagination" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
    {page > 1 ? <Link href={href(page - 1)} className="button" aria-label="Previous page of meetings">Previous</Link> : <span aria-disabled="true" className="px-5 py-3 text-muted">Previous</span>}
    <p>Page {page} of {totalPages}</p>
    {page < totalPages ? <Link href={href(page + 1)} className="button" aria-label="Next page of meetings">Next</Link> : <span aria-disabled="true" className="px-5 py-3 text-muted">Next</span>}
  </nav>;
}
