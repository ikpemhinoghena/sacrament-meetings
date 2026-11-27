'use client';

import { useActionState, type ReactElement } from 'react';
import MeetingForm from './MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { initialMeetingFormState, meetingToFormValues } from '@/lib/meeting-form';
import type { SacramentMeeting } from '@/lib/types';

export default function EditMeetingForm({ meeting }: { meeting: SacramentMeeting }): ReactElement {
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);
  const [state, formAction, isPending] = useActionState(updateMeetingWithId, initialMeetingFormState);
  return <MeetingForm idPrefix={`edit-meeting-${meeting.id}`} state={state} formAction={formAction} isPending={isPending} values={state.values ?? meetingToFormValues(meeting)} submitLabel="Save changes" pendingLabel="Saving changes…" />;
}
