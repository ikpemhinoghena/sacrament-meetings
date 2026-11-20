import type { ReactElement } from 'react';

export default function Loading(): ReactElement {
  return <p role="status" className="py-12 text-muted">Loading meeting program…</p>;
}
