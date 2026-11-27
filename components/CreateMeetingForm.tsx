'use client';

import { useActionState, type ReactElement } from 'react';
import MeetingForm from './MeetingForm';
import { createMeeting } from '@/lib/actions';
import { emptyMeetingFormValues, initialMeetingFormState } from '@/lib/meeting-form';

export default function CreateMeetingForm(): ReactElement {
  const [state, formAction, isPending] = useActionState(createMeeting, initialMeetingFormState);
  return <MeetingForm idPrefix="create-meeting" state={state} formAction={formAction} isPending={isPending} values={state.values ?? emptyMeetingFormValues} submitLabel="Create meeting" pendingLabel="Creating meeting…" />;
}
