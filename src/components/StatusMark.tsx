import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Status } from '../data/project'

/**
 * Wraps a value. If its status is 'under_review', it gets a dotted underline and
 * an "Under review" tooltip that works on hover, keyboard focus and tap.
 */
export function StatusMark({ status, children }: { status: Status; children: ReactNode }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const tipId = useId()

  if (status !== 'under_review') return <>{children}</>

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={tipId}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        className="cursor-help underline decoration-muted decoration-dotted decoration-2 underline-offset-[6px]"
      >
        {children}
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 font-body text-xs font-medium text-white shadow-soft transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        {t('common.underReview')}
      </span>
    </span>
  )
}
