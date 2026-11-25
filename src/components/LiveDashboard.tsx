import { Suspense, lazy, useEffect, useState } from 'react'
import { Activity, Droplets, Gauge, Thermometer, Waves, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createMockGenerator, parseReading, type PrototypeReading } from '../lib/mockPrototype'
import { useFormat } from '../lib/format'
import { Reveal, Section } from './Section'

const PowerSparkline = lazy(() => import('./charts/PowerSparkline'))

const POLL_MS = 2000
const HISTORY = 60
const PROTOTYPE_URL = (import.meta.env.VITE_PROTOTYPE_URL as string | undefined)?.replace(/\/+$/, '') || ''

type Mode = 'demo' | 'live' | 'offline'

function useTelemetry() {
  const [mock] = useState(createMockGenerator)
  const [mode, setMode] = useState<Mode>('demo')
  const [history, setHistory] = useState<PrototypeReading[]>(() => Array.from({ length: HISTORY }, () => mock()))

  useEffect(() => {
    let cancelled = false
    let controller: AbortController | null = null

    const push = (r: PrototypeReading) => setHistory((h) => [...h.slice(-(HISTORY - 1)), r])

    const tick = async () => {
      if (!PROTOTYPE_URL) {
        push(mock())
        return
      }
      controller?.abort()
      controller = new AbortController()
      const timeout = window.setTimeout(() => controller?.abort(), 1500)
      try {
        const res = await fetch(`${PROTOTYPE_URL}/data`, { signal: controller.signal, cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const reading = parseReading(await res.json())
        if (!reading) throw new Error('bad payload')
        if (cancelled) return
        setMode('live')
        push(reading)
      } catch {
        if (cancelled) return
        // Fall back to demo data; keep retrying the prototype on the next tick.
        setMode('offline')
        push(mock())
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void tick()
    const id = window.setInterval(() => void tick(), POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
      controller?.abort()
    }
  }, [mock])

  return { mode, history, latest: history[history.length - 1] }
}

function ModeBadge({ mode }: { mode: Mode }) {
  const { t } = useTranslation()
  if (mode === 'live') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-leaf-dark px-3 py-1 text-sm font-semibold text-white">
        <span className="anim-pulse-dot h-2 w-2 rounded-full bg-white" aria-hidden="true" />
        {t('common.live')}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sun-soft px-3 py-1 text-sm font-semibold text-soil ring-1 ring-sun/50">
      <span className="h-2 w-2 rounded-full bg-sun" aria-hidden="true" />
      {mode === 'offline' ? t('common.offline') : t('common.demoData')}
    </span>
  )
}

export function LiveDashboard() {
  const { t } = useTranslation()
  const { num } = useFormat()
  const { mode, history, latest } = useTelemetry()

  const tiles: { key: string; icon: LucideIcon; value: string }[] = [
    { key: 'power', icon: Zap, value: t('dashboard.units.w', { value: num(latest.power_w, 2, 2) }) },
    { key: 'voltage', icon: Gauge, value: t('dashboard.units.v', { value: num(latest.voltage_v, 2, 2) }) },
    { key: 'current', icon: Activity, value: t('dashboard.units.ma', { value: num(latest.current_ma) }) },
    { key: 'temp', icon: Thermometer, value: t('dashboard.units.c', { value: num(latest.panel_temp_c, 1, 1) }) },
    { key: 'ec', icon: Waves, value: t('dashboard.units.ec', { value: num(latest.soil_ec_ds_m, 2, 2) }) },
    { key: 'moisture', icon: Droplets, value: t('dashboard.units.pct', { value: num(latest.soil_moisture_pct, 1, 1) }) },
  ]

  return (
    <Section id="dashboard" tone="salt" eyebrow={t('dashboard.eyebrow')} title={t('dashboard.title')} lead={t('dashboard.lead')}>
      <Reveal>
        <div className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ModeBadge mode={mode} />
            <p className="text-xs text-muted">{t('dashboard.refresh')}</p>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {tiles.map(({ key, icon: Icon, value }) => (
              <li key={key} className="min-w-0 rounded-xl bg-salt p-3 sm:p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted sm:text-sm">
                  <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">{t(`dashboard.tiles.${key}`)}</span>
                </p>
                <p className="mt-1 font-heading text-lg font-bold tabular-nums text-ink sm:text-xl">{value}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <p className="mb-1 text-sm font-semibold text-ink">{t('dashboard.chartTitle', { count: HISTORY })}</p>
            <div className="h-28" role="img" aria-label={t('dashboard.chartAlt', { count: HISTORY })}>
              <Suspense fallback={<div className="h-full w-full animate-pulse rounded-xl bg-salt" />}>
                <PowerSparkline values={history.map((r) => r.power_w)} />
              </Suspense>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
