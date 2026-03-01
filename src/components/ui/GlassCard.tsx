import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function GlassCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={clsx('glass rounded-2xl p-5 shadow-2xl', className)}>{children}</section>;
}
