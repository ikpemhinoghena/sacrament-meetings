import type { ReactElement } from 'react';

export default function Footer(): ReactElement {
  return <footer className="no-print mt-auto border-t border-line"><div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-7 text-xs leading-5 text-muted sm:flex-row sm:justify-between"><p>Sacrament Meeting Planner</p><p>Not an official Church website.</p></div></footer>;
}
