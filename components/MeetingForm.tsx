'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { meetingLabels } from '@/lib/dates';
import type { MeetingFormState, MeetingFormValues, SpeakerValues } from '@/lib/meeting-form';
import type { MeetingType } from '@/lib/types';

type FieldProps = { name: string; id?: string; label: string; errors: Record<string, string[]>; help?: string; children: (props: ControlProps) => ReactNode };
type ControlProps = { id: string; 'aria-describedby': string; 'aria-invalid': true | undefined };

const inputClass = 'mt-2 w-full border border-line bg-paper px-4 py-3 text-ink aria-[invalid=true]:border-danger';
const IdPrefix = createContext('meeting');

function Field({ name, id: customId, label, errors, help, children }: FieldProps): ReactElement {
  const prefix = useContext(IdPrefix);
  const id = customId ?? `${prefix}-${name.replace(/\./g, '-')}`;
  const messages = errors[name] ?? [];
  const describedBy = [help ? `${id}-help` : null, `${id}-error`].filter(Boolean).join(' ');
  return <div>
    <label htmlFor={id} className="block text-sm font-medium text-navy">{label}</label>
    {children({ id, 'aria-describedby': describedBy, 'aria-invalid': messages.length ? true : undefined })}
    {help && <p id={`${id}-help`} className="mt-2 text-sm text-muted">{help}</p>}
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">{messages.map((message) => <p key={message} className="mt-2 text-sm text-danger">{message}</p>)}</div>
  </div>;
}

function TextField({ name, label, errors, defaultValue, type = 'text', help, ...rest }: Omit<FieldProps, 'children'> & { defaultValue: string; type?: string; inputMode?: 'numeric'; autoComplete?: string }): ReactElement {
  return <Field name={name} label={label} errors={errors} help={help}>{(props) => <input {...props} {...rest} name={name} type={type} required aria-required="true" defaultValue={defaultValue} className={inputClass} />}</Field>;
}

function HymnFields({ prefix, label, values, errors }: { prefix: 'openingHymn' | 'sacramentHymn' | 'closingHymn'; label: string; values: MeetingFormValues; errors: Record<string, string[]> }): ReactElement {
  return <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
    <Field name={`${prefix}.number`} label={`${label} number`} errors={errors}>{(props) => <input {...props} name={`${prefix}Number`} type="text" inputMode="numeric" required aria-required="true" defaultValue={values[`${prefix}Number`]} className={inputClass} />}</Field>
    <Field name={`${prefix}.title`} label={`${label} title`} errors={errors}>{(props) => <input {...props} name={`${prefix}Title`} type="text" required aria-required="true" defaultValue={values[`${prefix}Title`]} className={inputClass} />}</Field>
  </div>;
}

function Section({ title, children }: { title: string; children: ReactNode }): ReactElement {
  return <fieldset className="border-t border-line pt-8"><legend className="eyebrow pr-3">{title}</legend><div className="mt-6 grid gap-6">{children}</div></fieldset>;
}

type SpeakerRow = { key: number };

function Speakers({ values, errors }: { values: SpeakerValues[]; errors: Record<string, string[]> }): ReactElement {
  const prefix = useContext(IdPrefix);
  const nextKey = useRef(values.length);
  const [rows, setRows] = useState<SpeakerRow[]>(() => values.map((_, index) => ({ key: index })));
  const focusKey = useRef<number | null>(null);
  const listMessages = errors.speakers ?? [];

  useEffect(() => {
    if (focusKey.current === null) return;
    document.getElementById(`${prefix}-speaker-${focusKey.current}-type`)?.focus();
    focusKey.current = null;
  }, [rows, prefix]);

  function addRow() {
    const key = nextKey.current++;
    focusKey.current = key;
    setRows((current) => [...current, { key }]);
  }

  return <Section title="Speakers & music">
    <p id={`${prefix}-speakers-help`} className="text-sm text-muted">List speakers and musical numbers in program order. Leave empty for a testimony meeting.</p>
    {rows.map((row, index) => {
      const value = values[index];
      const base = `speakers.${index}`;
      const rowId = `${prefix}-speaker-${row.key}`;
      return <fieldset key={row.key} className="grid gap-4 border border-line bg-paper p-5 sm:grid-cols-[12rem_1fr_1fr_auto] sm:items-start">
        <legend className="px-2 text-sm font-medium text-navy">Program item {index + 1}</legend>
        <Field name={`${base}.type`} id={`${rowId}-type`} label="Type" errors={errors}>{(props) => <select {...props} key={value?.type ?? 'speaker'} name="speakerType" defaultValue={value?.type ?? 'speaker'} className={inputClass}><option value="speaker">Speaker</option><option value="musical-number">Musical number</option></select>}</Field>
        <Field name={`${base}.name`} id={`${rowId}-name`} label="Name" errors={errors}>{(props) => <input {...props} name="speakerName" type="text" required aria-required="true" defaultValue={value?.name ?? ''} className={inputClass} />}</Field>
        <Field name={`${base}.topic`} id={`${rowId}-topic`} label="Topic or selection" errors={errors}>{(props) => <input {...props} name="speakerTopic" type="text" required aria-required="true" defaultValue={value?.topic ?? ''} className={inputClass} />}</Field>
        <button type="button" onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))} className="mt-7 self-start border border-line px-4 py-3 text-sm text-navy hover:border-danger hover:text-danger" aria-label={`Remove program item ${index + 1}`}>Remove</button>
      </fieldset>;
    })}
    <div id={`${prefix}-speakers-error`} aria-live="polite" aria-atomic="true">{listMessages.map((message) => <p key={message} className="text-sm text-danger">{message}</p>)}</div>
    <div><button type="button" onClick={addRow} aria-describedby={`${prefix}-speakers-help ${prefix}-speakers-error`} className="border border-navy px-5 py-3 text-sm text-navy hover:bg-paper">Add speaker or musical number</button></div>
  </Section>;
}

export default function MeetingForm({ idPrefix, state, formAction, isPending, values, submitLabel, pendingLabel }: {
  idPrefix: string;
  state: MeetingFormState;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  values: MeetingFormValues;
  submitLabel: string;
  pendingLabel: string;
}): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const { errors } = state;

  useEffect(() => {
    if (Object.keys(state.errors).length) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return <IdPrefix value={idPrefix}><form ref={formRef} action={formAction} noValidate aria-busy={isPending} className="mt-10 grid max-w-3xl gap-10">
    <Section title="Meeting details">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="date" label="Meeting date" type="date" errors={errors} defaultValue={values.date} />
        <Field name="meetingType" label="Meeting type" errors={errors}>{(props) => <select {...props} key={values.meetingType} name="meetingType" required aria-required="true" defaultValue={values.meetingType} className={inputClass}><option value="" disabled>Choose a meeting type</option>{(Object.entries(meetingLabels) as [MeetingType, string][]).map(([type, label]) => <option key={type} value={type}>{label}</option>)}</select>}</Field>
        <TextField name="presiding" label="Presiding" errors={errors} defaultValue={values.presiding} autoComplete="off" />
        <TextField name="conducting" label="Conducting" errors={errors} defaultValue={values.conducting} autoComplete="off" />
      </div>
      <Field name="announcements" label="Announcements (optional)" help="Enter one announcement per line." errors={errors}>{(props) => <textarea {...props} name="announcements" rows={3} defaultValue={values.announcements} className={inputClass} />}</Field>
    </Section>
    <Section title="Opening & business">
      <HymnFields prefix="openingHymn" label="Opening hymn" values={values} errors={errors} />
      <TextField name="openingPrayer" label="Opening prayer (invocation)" errors={errors} defaultValue={values.openingPrayer} autoComplete="off" />
      <Field name="wardBusiness" label="Ward business (optional)" help="Enter one item per line." errors={errors}>{(props) => <textarea {...props} name="wardBusiness" rows={3} defaultValue={values.wardBusiness} className={inputClass} />}</Field>
      <div>
        <div className="flex items-center gap-3"><input id={`${idPrefix}-stakeBusiness`} name="stakeBusiness" type="checkbox" defaultChecked={values.stakeBusiness} aria-describedby={`${idPrefix}-stakeBusiness-error`} className="h-5 w-5 accent-navy" /><label htmlFor={`${idPrefix}-stakeBusiness`} className="text-sm font-medium text-navy">Stake business will be presented</label></div>
        <div id={`${idPrefix}-stakeBusiness-error`} aria-live="polite" aria-atomic="true">{(errors.stakeBusiness ?? []).map((message) => <p key={message} className="mt-2 text-sm text-danger">{message}</p>)}</div>
      </div>
    </Section>
    <Section title="The sacrament">
      <HymnFields prefix="sacramentHymn" label="Sacrament hymn" values={values} errors={errors} />
    </Section>
    <Speakers key={values.speakers.length} values={values.speakers} errors={errors} />
    <Section title="Closing">
      <HymnFields prefix="closingHymn" label="Closing hymn" values={values} errors={errors} />
      <TextField name="closingPrayer" label="Closing prayer (benediction)" errors={errors} defaultValue={values.closingPrayer} autoComplete="off" />
    </Section>
    <div className="border-t border-line pt-8">
      <div id={`${idPrefix}-form-message`} role="status" aria-live="polite">{state.message && <p className="mb-6 border-l-2 border-danger bg-paper p-4 text-sm text-danger">{state.message}</p>}</div>
      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="button disabled:cursor-progress disabled:opacity-80" disabled={isPending} aria-describedby={`${idPrefix}-form-message`}>{isPending ? pendingLabel : submitLabel}</button>
        <Link href="/meetings" className="text-sm text-navy underline underline-offset-4">Cancel</Link>
      </div>
    </div>
  </form></IdPrefix>;
}
