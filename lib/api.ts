import 'server-only';
import { headers } from 'next/headers';

export async function fetchMeetingsApi(path: string = ''): Promise<Response> {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host');
  if (!host) throw new Error('The request host is unavailable.');
  const protocol = requestHeaders.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return fetch(`${protocol}://${host}/api/meetings${path}`, { cache: 'no-store' });
}
