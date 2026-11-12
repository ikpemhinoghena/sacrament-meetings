import { getMeetingById } from '@/lib/meetings-db';
import { parseMeetingId } from '@/lib/dates';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const id = parseMeetingId((await params).id);
  if (id === null) return Response.json({ error: 'Meeting ID must be a positive whole number.' }, { status: 400 });
  const meeting = getMeetingById(id);
  if (!meeting) return Response.json({ error: 'Meeting not found.' }, { status: 404 });
  return Response.json(meeting);
}
