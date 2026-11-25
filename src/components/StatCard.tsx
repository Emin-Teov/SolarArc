import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Status } from '../data/project'
import { useCountUp } from '../hooks/useCountUp'
import { useFormat } from '../lib/format'
import { StatusMark } from './StatusMark'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  /** Second value for ranges (e.g. 7–10). */
  valueMax?: number
  /** Renders the formatted number(s) into a translated template, e.g. "{{value}} MW". */
  render: (formatted: string, formattedMax?: string) => ReactNode
  decimals?: number
  status: Status
  accent?: 'sky' | 'leaf' | 'soil' | 'sun'
  note?: string
}

const accentClass = {
  sky: 'bg-sky-soft text-sky-dark',
  leaf: 'bg-leaf/10 text-leaf-dark',
  soil: 'bg-soil/10 text-soil',
  sun: 'bg-sun-soft text-soil',
}

export function StatCard({ icon: Icon, label, value, valueMax, render, decimals = 0, status, accent = 'sky', note }: StatCardProps) {
  const { num } = useFormat()
  const { ref, value: animated } = useCountUp<HTMLDivElement>(value)
  const max = useCountUp<HTMLSpanElement>(valueMax ?? 0)
  const done = Math.abs(animated - value) < 1e-9
  const shown = num(done ? value : animated, decimals, done ? 0 : decimals)

  return (
    <div ref={ref} className="flex min-w-0 flex-col rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accentClass[accent]}`}>
        <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
      </span>
      <p className="font-heading text-2xl font-bold text-ink sm:text-3xl">
        <span ref={max.ref}>
          <StatusMark status={status}>
            {render(shown, valueMax !== undefined ? num(Math.round(max.value), 0) : undefined)}
          </StatusMark>
        </span>
      </p>
      <p className="mt-1 break-words text-sm text-muted">{label}</p>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </div>
  )
}
