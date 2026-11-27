import type { MeetingType, SacramentMeeting, SpeakerItem } from './types';

export type SpeakerValues = { name: string; topic: string; type: SpeakerItem['type'] };

export type MeetingFormValues = {
  date: string;
  meetingType: MeetingType | '';
  presiding: string;
  conducting: string;
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: SpeakerValues[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
};

export type MeetingFormState = {
  message: string | null;
  errors: Record<string, string[]>;
  values?: MeetingFormValues;
};

export const initialMeetingFormState: MeetingFormState = { message: null, errors: {} };

export const emptyMeetingFormValues: MeetingFormValues = {
  date: '', meetingType: '', presiding: '', conducting: '', announcements: '',
  openingHymnNumber: '', openingHymnTitle: '', openingPrayer: '', wardBusiness: '', stakeBusiness: false,
  sacramentHymnNumber: '', sacramentHymnTitle: '', speakers: [],
  closingHymnNumber: '', closingHymnTitle: '', closingPrayer: '',
};

export function meetingToFormValues(meeting: SacramentMeeting): MeetingFormValues {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join('\n'),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map(({ name, topic, type }) => ({ name, topic, type })),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}
