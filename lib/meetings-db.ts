import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

type MeetingRow = {
  id: number;
  date: string;
  meeting_type: SacramentMeeting['meetingType'];
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: SacramentMeeting['openingHymn'];
  opening_prayer: string;
  ward_business: SacramentMeeting['wardBusiness'];
  stake_business: boolean;
  sacrament_hymn: SacramentMeeting['sacramentHymn'];
  speakers: SacramentMeeting['speakers'];
  closing_hymn: SacramentMeeting['closingHymn'];
  closing_prayer: string;
};

const columns = `id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
  presiding, conducting, announcements, opening_hymn, opening_prayer,
  ward_business, stake_business, sacrament_hymn, speakers, closing_hymn, closing_prayer`;
const searchFilter = `presiding ILIKE $1 OR conducting ILIKE $1 OR meeting_type ILIKE $1
  OR EXISTS (SELECT 1 FROM jsonb_array_elements(speakers) AS speaker WHERE speaker->>'name' ILIKE $1)`;
export const MEETINGS_PER_PAGE = 5;

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('The meeting database is not configured.');
  return neon(url);
}

function mapMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id, date: row.date, meetingType: row.meeting_type,
    presiding: row.presiding, conducting: row.conducting,
    ...(row.announcements === null ? {} : { announcements: row.announcements }),
    openingHymn: row.opening_hymn, openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business, stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn, speakers: row.speakers,
    closingHymn: row.closing_hymn, closingPrayer: row.closing_prayer,
  };
}

export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {
  const rows = await database().query(
    `SELECT ${columns} FROM meetings WHERE ($1::text IS NULL OR to_char(date, 'YYYY-MM-DD') = $1) ORDER BY date DESC, id DESC`,
    [date || null],
  );
  return (rows as MeetingRow[]).map(mapMeeting);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await database().query(`SELECT ${columns} FROM meetings WHERE id = $1::bigint`, [id]);
  return rows.length ? mapMeeting(rows[0] as MeetingRow) : null;
}

export function normalizePage(value?: string): number {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export async function getMeetingSearchResults(query: string, requestedPage: number) {
  const sql = database();
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
  const counts = await sql.query(`SELECT count(*)::int AS total FROM meetings WHERE ${searchFilter}`, [pattern]);
  const total = counts[0].total as number;
  const totalPages = Math.max(1, Math.ceil(total / MEETINGS_PER_PAGE));
  const page = Math.min(normalizePage(String(requestedPage)), totalPages);
  const rows = await sql.query(
    `SELECT ${columns} FROM meetings WHERE ${searchFilter} ORDER BY date DESC, id DESC LIMIT $2 OFFSET $3`,
    [pattern, MEETINGS_PER_PAGE, (page - 1) * MEETINGS_PER_PAGE],
  );
  return { meetings: (rows as MeetingRow[]).map(mapMeeting), total, totalPages, page };
}

export async function createMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<never> {
  void meeting;
  throw new Error('Creating meetings is coming in Week 04.');
}

export async function updateMeeting(id: number, meeting: Partial<Omit<SacramentMeeting, 'id'>>): Promise<never> {
  void id;
  void meeting;
  throw new Error('Updating meetings is coming in Week 04.');
}

export async function deleteMeeting(id: number): Promise<never> {
  void id;
  throw new Error('Deleting meetings is coming in Week 04.');
}
