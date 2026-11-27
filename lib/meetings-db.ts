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
  const pattern = `%${query.trim().replace(/[\\%_]/g, '\\$&')}%`;
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

export type MeetingInput = Omit<SacramentMeeting, 'id'>;

export class MeetingDateTakenError extends Error {
  constructor() {
    super('A meeting is already scheduled for this date.');
    this.name = 'MeetingDateTakenError';
  }
}

function meetingValues(meeting: MeetingInput): unknown[] {
  return [
    meeting.date, meeting.meetingType, meeting.presiding, meeting.conducting,
    JSON.stringify(meeting.announcements ?? []), JSON.stringify(meeting.openingHymn), meeting.openingPrayer,
    JSON.stringify(meeting.wardBusiness), meeting.stakeBusiness, JSON.stringify(meeting.sacramentHymn),
    JSON.stringify(meeting.speakers), JSON.stringify(meeting.closingHymn), meeting.closingPrayer,
  ];
}

function rethrowDateConflict(error: unknown): never {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') throw new MeetingDateTakenError();
  throw error;
}

export async function createMeeting(meeting: MeetingInput): Promise<number> {
  try {
    const rows = await database().query(
      `INSERT INTO meetings (date, meeting_type, presiding, conducting, announcements, opening_hymn, opening_prayer,
        ward_business, stake_business, sacrament_hymn, speakers, closing_hymn, closing_prayer)
      VALUES ($1::date, $2, $3, $4, ARRAY(SELECT jsonb_array_elements_text($5::jsonb)), $6::jsonb, $7,
        $8::jsonb, $9::boolean, $10::jsonb, $11::jsonb, $12::jsonb, $13)
      RETURNING id`,
      meetingValues(meeting),
    );
    return rows[0].id as number;
  } catch (error) {
    rethrowDateConflict(error);
  }
}

export async function updateMeeting(id: number, meeting: MeetingInput): Promise<boolean> {
  try {
    const rows = await database().query(
      `UPDATE meetings SET date = $1::date, meeting_type = $2, presiding = $3, conducting = $4,
        announcements = ARRAY(SELECT jsonb_array_elements_text($5::jsonb)), opening_hymn = $6::jsonb, opening_prayer = $7,
        ward_business = $8::jsonb, stake_business = $9::boolean, sacrament_hymn = $10::jsonb, speakers = $11::jsonb,
        closing_hymn = $12::jsonb, closing_prayer = $13
      WHERE id = $14::bigint
      RETURNING id`,
      [...meetingValues(meeting), id],
    );
    return rows.length > 0;
  } catch (error) {
    rethrowDateConflict(error);
  }
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await database().query('DELETE FROM meetings WHERE id = $1::bigint RETURNING id', [id]);
  return rows.length > 0;
}
