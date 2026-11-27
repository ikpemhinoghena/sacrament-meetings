'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import * as db from './meetings-db';
import { parseMeetingId } from './dates';
import type { MeetingFormState, MeetingFormValues, SpeakerValues } from './meeting-form';

const meetingTypes = ['regular', 'testimony', 'stake', 'general', 'special'] as const;
const speakerTypes = ['speaker', 'musical-number'] as const;

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const requiredText = (label: string) => z.string().trim().min(1, `Enter the ${label}.`).max(255, `The ${label} must be 255 characters or fewer.`);

const hymn = (label: string) => z.object({
  number: z.string().trim().min(1, { error: `Enter the ${label} number.`, abort: true })
    .regex(/^\d{1,4}$/, `The ${label} number must be a whole number from 1 to 9999.`)
    .transform(Number)
    .refine((value) => value >= 1, `The ${label} number must be a whole number from 1 to 9999.`),
  title: requiredText(`${label} title`),
});

const lines = (label: string) => z.string()
  .transform((value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
  .pipe(z.array(z.string().max(500, `Each ${label} line must be 500 characters or fewer.`)).max(20, `List no more than 20 ${label} items.`));

const MeetingFormSchema = z.object({
  date: z.string().trim().min(1, { error: 'Choose the meeting date.', abort: true }).refine(isCalendarDate, 'Enter a valid calendar date.'),
  meetingType: z.enum(meetingTypes, { error: 'Choose a meeting type.' }),
  presiding: requiredText('presiding leader'),
  conducting: requiredText('conducting leader'),
  announcements: lines('announcement'),
  openingHymn: hymn('opening hymn'),
  openingPrayer: requiredText('opening prayer'),
  wardBusiness: lines('ward business').transform((items) => items.map((description) => ({ description }))),
  stakeBusiness: z.boolean(),
  sacramentHymn: hymn('sacrament hymn'),
  speakers: z.array(z.object({
    name: requiredText('speaker or performer name'),
    topic: requiredText('topic or musical selection'),
    type: z.enum(speakerTypes, { error: 'Choose speaker or musical number.' }),
  })).max(20, 'List no more than 20 speakers and musical numbers.'),
  closingHymn: hymn('closing hymn'),
  closingPrayer: requiredText('closing prayer'),
});

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

function readMeetingForm(formData: FormData): MeetingFormValues {
  const all = (name: string) => formData.getAll(name).map((value) => (typeof value === 'string' ? value : ''));
  const names = all('speakerName');
  const topics = all('speakerTopic');
  const types = all('speakerType');
  return {
    date: text(formData, 'date'),
    meetingType: text(formData, 'meetingType') as MeetingFormValues['meetingType'],
    presiding: text(formData, 'presiding'),
    conducting: text(formData, 'conducting'),
    announcements: text(formData, 'announcements'),
    openingHymnNumber: text(formData, 'openingHymnNumber'),
    openingHymnTitle: text(formData, 'openingHymnTitle'),
    openingPrayer: text(formData, 'openingPrayer'),
    wardBusiness: text(formData, 'wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymnNumber: text(formData, 'sacramentHymnNumber'),
    sacramentHymnTitle: text(formData, 'sacramentHymnTitle'),
    speakers: names.map((name, index) => ({ name, topic: topics[index] ?? '', type: (types[index] ?? '') as SpeakerValues['type'] })),
    closingHymnNumber: text(formData, 'closingHymnNumber'),
    closingHymnTitle: text(formData, 'closingHymnTitle'),
    closingPrayer: text(formData, 'closingPrayer'),
  };
}

function validate(values: MeetingFormValues) {
  return MeetingFormSchema.safeParse({
    date: values.date,
    meetingType: values.meetingType,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: values.announcements,
    openingHymn: { number: values.openingHymnNumber, title: values.openingHymnTitle },
    openingPrayer: values.openingPrayer,
    wardBusiness: values.wardBusiness,
    stakeBusiness: values.stakeBusiness,
    sacramentHymn: { number: values.sacramentHymnNumber, title: values.sacramentHymnTitle },
    speakers: values.speakers,
    closingHymn: { number: values.closingHymnNumber, title: values.closingHymnTitle },
    closingPrayer: values.closingPrayer,
  });
}

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const [first] = issue.path;
    const key = first === 'announcements' || first === 'wardBusiness' ? String(first) : issue.path.join('.');
    errors[key] = [...new Set([...(errors[key] ?? []), issue.message])];
  }
  return errors;
}

const invalidMessage = 'Please correct the highlighted fields and try again.';

export async function createMeeting(prevState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  const values = readMeetingForm(formData);
  const parsed = validate(values);
  if (!parsed.success) return { message: invalidMessage, errors: fieldErrors(parsed.error), values };
  try {
    await db.createMeeting(parsed.data);
  } catch (error) {
    if (error instanceof db.MeetingDateTakenError) return { message: invalidMessage, errors: { date: [error.message] }, values };
    console.error('Failed to create meeting:', error);
    throw new Error('The meeting could not be saved. Please try again.');
  }
  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(id: number, prevState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  const values = readMeetingForm(formData);
  const meetingId = parseMeetingId(String(id));
  if (meetingId === null) return { message: 'This meeting could not be found.', errors: {}, values };
  const parsed = validate(values);
  if (!parsed.success) return { message: invalidMessage, errors: fieldErrors(parsed.error), values };
  let updated: boolean;
  try {
    updated = await db.updateMeeting(meetingId, parsed.data);
  } catch (error) {
    if (error instanceof db.MeetingDateTakenError) return { message: invalidMessage, errors: { date: [error.message] }, values };
    console.error('Failed to update meeting:', error);
    throw new Error('The meeting could not be updated. Please try again.');
  }
  if (!updated) return { message: 'This meeting no longer exists. It may have been deleted.', errors: {}, values };
  revalidatePath('/meetings');
  revalidatePath(`/meetings/${meetingId}`);
  redirect('/meetings');
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const id = parseMeetingId(text(formData, 'id'));
  if (id === null) throw new Error('This meeting could not be found.');
  try {
    await db.deleteMeeting(id);
  } catch (error) {
    console.error('Failed to delete meeting:', error);
    throw new Error('The meeting could not be deleted. Please try again.');
  }
  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
}
