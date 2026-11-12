import type { MeetingType } from './types';

export const wardName = 'Palm Grove Ward';
export const meetingLabels: Record<MeetingType, string> = {
  regular: 'Sacrament meeting',
  testimony: 'Fast & testimony meeting',
  stake: 'Stake conference',
  general: 'General conference',
};

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

export function localDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function mostRecentSunday(now: Date = new Date()): string {
  const date = new Date(`${localDate(now)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}

export function parseMeetingId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
