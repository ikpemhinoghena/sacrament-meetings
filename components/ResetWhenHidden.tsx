'use client';

import { Fragment, useEffect, useState, type ReactElement, type ReactNode } from 'react';

export default function ResetWhenHidden({ children }: { children: ReactNode }): ReactElement {
  const [version, setVersion] = useState(0);
  useEffect(() => () => setVersion((current) => current + 1), []);
  return <Fragment key={version}>{children}</Fragment>;
}
