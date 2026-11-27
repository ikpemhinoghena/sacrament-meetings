import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import CreateMeetingForm from '@/components/CreateMeetingForm';
import ResetWhenHidden from '@/components/ResetWhenHidden';

export const metadata: Metadata = { title: 'Add meeting' };

export default function NewMeetingPage(): ReactElement {
  return <>
    <p className="eyebrow">Bishopric planning</p>
    <h1 className="mt-4 font-serif text-4xl text-navy sm:text-5xl">Add meeting</h1>
    <p className="mt-5 max-w-xl leading-7 text-muted">Plan a new program. Fields marked as optional may be left empty.</p>
    <ResetWhenHidden><CreateMeetingForm /></ResetWhenHidden>
  </>;
}
