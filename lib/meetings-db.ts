import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1, date: '2026-11-08', meetingType: 'regular',
    presiding: 'Bishop Tunde Adeyemi', conducting: 'Brother Emeka Okoro',
    announcements: ['Ward service morning: Saturday, 14 November at 9:00 a.m. Meet at the meetinghouse.', 'Choir practice follows the Sunday classes.'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' }, openingPrayer: 'Sister Ada Eze',
    wardBusiness: [{ description: 'Sustaining of Sister Bisi Adebayo as a ward choir director.' }], stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [{ name: 'Sister Ngozi Obi', topic: 'Finding peace through prayer', type: 'speaker' }, { name: 'Ward choir', topic: 'Lead, Kindly Light', type: 'musical-number' }, { name: 'Brother Chidi Nwosu', topic: 'Serving with a willing heart', type: 'speaker' }],
    closingHymn: { number: 97, title: 'Lead, Kindly Light' }, closingPrayer: 'Brother Femi Bello',
  },
  {
    id: 2, date: '2026-11-01', meetingType: 'testimony',
    presiding: 'Bishop Tunde Adeyemi', conducting: 'Brother Emeka Okoro',
    announcements: ['Contributions for the ward service morning may be coordinated with the service committee.'],
    openingHymn: { number: 2, title: 'The Spirit of God' }, openingPrayer: 'Brother Chidi Nwosu',
    wardBusiness: [], stakeBusiness: false,
    sacramentHymn: { number: 180, title: 'Father in Heaven, We Do Believe' }, speakers: [],
    closingHymn: { number: 97, title: 'Lead, Kindly Light' }, closingPrayer: 'Sister Bisi Adebayo',
  },
  {
    id: 3, date: '2026-10-25', meetingType: 'stake',
    presiding: 'President Daniel Udo', conducting: 'President Samuel Akinola',
    announcements: ['Sunday general session of stake conference.'],
    openingHymn: { number: 85, title: 'How Firm a Foundation' }, openingPrayer: 'Sister Grace Okafor',
    wardBusiness: [], stakeBusiness: true,
    sacramentHymn: { number: 0, title: 'Not applicable' },
    speakers: [{ name: 'President Samuel Akinola', topic: 'Strengthening faith at home', type: 'speaker' }, { name: 'Stake choir', topic: 'The Spirit of God', type: 'musical-number' }, { name: 'President Daniel Udo', topic: 'Following Jesus Christ together', type: 'speaker' }],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' }, closingPrayer: 'Brother Femi Bello',
  },
  {
    id: 4, date: '2026-10-04', meetingType: 'general',
    presiding: 'President James Williams', conducting: 'President David Thomas',
    announcements: ['Sunday session of general conference.'],
    openingHymn: { number: 2, title: 'The Spirit of God' }, openingPrayer: 'Sister Mary Adams',
    wardBusiness: [], stakeBusiness: false,
    sacramentHymn: { number: 0, title: 'Not applicable' },
    speakers: [{ name: 'President James Williams', topic: 'Hope in Jesus Christ', type: 'speaker' }, { name: 'Conference choir', topic: 'How Firm a Foundation', type: 'musical-number' }, { name: 'Sister Elizabeth Harris', topic: 'Living with charity', type: 'speaker' }],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' }, closingPrayer: 'Brother John Clark',
  },
  {
    id: 5, date: '2026-05-03', meetingType: 'testimony',
    presiding: 'Bishop Tunde Adeyemi', conducting: 'Brother Femi Bello',
    openingHymn: { number: 85, title: 'How Firm a Foundation' }, openingPrayer: 'Sister Ngozi Obi',
    wardBusiness: [{ description: 'Sustaining of Brother Chidi Nwosu as a Sunday School teacher.' }], stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' }, speakers: [],
    closingHymn: { number: 97, title: 'Lead, Kindly Light' }, closingPrayer: 'Brother Emeka Okoro',
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  return structuredClone(date ? meetings.filter((meeting) => meeting.date === date) : meetings);
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return structuredClone(meetings.find((meeting) => meeting.id === id) ?? null);
}
