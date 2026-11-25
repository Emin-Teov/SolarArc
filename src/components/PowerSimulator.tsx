import { Suspense, lazy, useId, useMemo, useState } from 'react'
import { Info, Snowflake, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatHour, useFormat } from '../lib/format'
import {
  ARCH_TILTS_DEG,
  END_HOUR,
  START_HOUR,
  STEP_HOURS,
  dailySeries,
  dailyStats,
  facetLightLevels,
  sunPosition,
  totalPower,
  type Season,
} from '../lib/solarModel'
import { Reveal, Section } from './Section'

const SimChart = lazy(() => import('./charts/SimChart'))

/** Grey (no light) → sun-gold (full light). */
function tint(level: number): string {
  const from = [203, 213, 208]
  const to = [245, 183, 0]
  const c = from.map((f, i) => Math.round(f + (to[i] - f) * Math.max(0, Math.min(1, level))))
  return `rgb(${c[0]} ${c[1]} ${c[2]})`
}

function SunArchView({ hour, season }: { hour: number; season: Season }) {
  const { t } = useTranslation()
  const { num } = useFormat()
  const sun = sunPosition(hour, season)
  const arch = facetLightLevels(hour, season, 'arch')
  const flat = facetLightLevels(hour, season, 'flat')
  const up = sun.elevationDeg > 0

  const cx = 200
  const gy = 220
  const r = 120
  // Project the sun onto the East–West cross-section (looking North, East on the right).
  const angle = Math.atan2(sun.vector[0], Math.max(sun.vector[2], 0.0001))
  const sr = 175
  const sx = cx + sr * Math.sin(angle)
  const sy = gy - sr * Math.cos(angle)

  return (
    <svg viewBox="0 0 400 330" className="h-auto w-full" role="img" aria-labelledby="sim-view-title">
      <title id="sim-view-title">
        {up
          ? t('sim.view.altUp', { time: formatHour(hour), elevation: num(sun.elevationDeg), azimuth: num(sun.azimuthDeg) })
          : t('sim.view.altDown', { time: formatHour(hour) })}
      </title>
      <rect width="400" height={gy} fill={up ? '#E8F1FD' : '#D7DEE6'} />
      <path d={`M ${cx - sr} ${gy} A ${sr} ${sr} 0 0 1 ${cx + sr} ${gy}`} fill="none" stroke="#F5B700" strokeOpacity="0.4" strokeDasharray="3 6" />
      {up && (
        <g>
          <line x1={sx} y1={sy} x2={cx} y2={gy - r} stroke="#F5B700" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={sx} cy={sy} r="18" fill="#F5B700" />
          <circle cx={sx} cy={sy} r="27" fill="#F5B700" opacity="0.2" />
        </g>
      )}
      <rect y={gy} width="400" height="110" fill="#F7F5F0" />
      <rect y={gy} width="400" height="6" fill="#B8977A" />

      {/* Arch with tinted facets */}
      <path d={`M ${cx - r} ${gy} A ${r} ${r} 0 0 1 ${cx + r} ${gy}`} fill="none" stroke="#1F6F40" strokeWidth="4" />
      {ARCH_TILTS_DEG.map((tilt, i) => {
        const a = (tilt * Math.PI) / 180
        return (
          <rect
            key={tilt}
            x={-19}
            y={-5}
            width={38}
            height={10}
            rx={2}
            fill={tint(arch[i])}
            stroke="#16241C"
            strokeOpacity="0.25"
            transform={`translate(${cx + (r + 6) * Math.sin(a)} ${gy - (r + 6) * Math.cos(a)}) rotate(${tilt})`}
          />
        )
      })}
      <text x="14" y="24" fontSize="14" fontWeight="700" fill="#5E6B63">{t('common.westShort')}</text>
      <text x="372" y="24" fontSize="14" fontWeight="700" fill="#5E6B63">{t('common.eastShort')}</text>

      {/* Flat reference row */}
      <text x="20" y={gy + 40} fontSize="13" fontWeight="600" fill="#16241C">{t('sim.view.flatRow')}</text>
      {flat.map((level, i) => (
        <rect key={i} x={20 + i * 40} y={gy + 52} width="34" height="16" rx="2" fill={tint(level)} stroke="#16241C" strokeOpacity="0.25" />
      ))}
      <text x="20" y={gy + 98} fontSize="12" fill="#5E6B63">
        {up ? t('sim.view.sunInfo', { elevation: num(sun.elevationDeg), azimuth: num(sun.azimuthDeg) }) : t('sim.view.night')}
      </text>
    </svg>
  )
}

export function PowerSimulator() {
  const { t } = useTranslation()
  const { num, pct } = useFormat()
  const [hour, setHour] = useState(8)
  const [season, setSeason] = useState<Season>('summer')
  const sliderId = useId()

  const series = useMemo(() => dailySeries(season), [season])
  const stats = useMemo(() => ({ arch: dailyStats(series, 'arch'), flat: dailyStats(series, 'flat') }), [series])
  const nowArch = totalPower(hour, season, 'arch')
  const nowFlat = totalPower(hour, season, 'flat')

  const rows = [
    { key: 'shoulder', arch: pct(stats.arch.shoulderShare), flat: pct(stats.flat.shoulderShare) },
    { key: 'peak', arch: num(stats.arch.peak), flat: num(stats.flat.peak) },
    { key: 'energy', arch: num(stats.arch.dailyEnergy), flat: num(stats.flat.dailyEnergy) },
  ] as const

  return (
    <Section id="simulator" tone="sun" eyebrow={t('sim.eyebrow')} title={t('sim.title')} lead={t('sim.lead')}>
      <Reveal>
        <div className="rounded-2xl bg-white p-4 shadow-soft sm:p-6 lg:p-8">
          {/* Controls */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 flex-1">
              <label htmlFor={sliderId} className="flex items-baseline justify-between gap-3 font-semibold text-ink">
                <span>{t('sim.timeLabel')}</span>
                <span className="font-heading text-2xl font-bold tabular-nums text-ink">{formatHour(hour)}</span>
              </label>
              <input
                id={sliderId}
                type="range"
                min={START_HOUR}
                max={END_HOUR}
                step={STEP_HOURS}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                aria-valuetext={formatHour(hour)}
                className="mt-3 h-2 w-full cursor-pointer accent-[#F5B700]"
              />
              <div className="mt-1 flex justify-between text-xs text-muted" aria-hidden="true">
                <span>05:00</span>
                <span>13:00</span>
                <span>21:00</span>
              </div>
            </div>
            <div role="group" aria-label={t('sim.seasonLabel')} className="flex shrink-0 rounded-full bg-salt p-1">
              {(['summer', 'winter'] as const).map((s) => {
                const Icon = s === 'summer' ? Sun : Snowflake
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={season === s}
                    onClick={() => setSeason(s)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      season === s ? 'bg-ink text-white shadow-sm' : 'text-ink hover:bg-white'
                    }`}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    {t(`sim.season.${s}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="rounded-xl bg-salt/60 p-3">
              <SunArchView hour={hour} season={season} />
              <dl className="mt-2 grid grid-cols-2 gap-2 px-1 text-sm" aria-live="polite">
                <div className="min-w-0 rounded-lg bg-white p-2.5">
                  <dt className="text-muted">{t('sim.series.arch')}</dt>
                  <dd className="font-heading text-lg font-bold tabular-nums text-sky-dark">{num(nowArch)}</dd>
                </div>
                <div className="min-w-0 rounded-lg bg-white p-2.5">
                  <dt className="text-muted">{t('sim.series.flat')}</dt>
                  <dd className="font-heading text-lg font-bold tabular-nums text-ink">{num(nowFlat)}</dd>
                </div>
              </dl>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-ink">{t('sim.chartTitle')}</p>
              <div className="h-[280px] sm:h-[320px]" role="img" aria-label={t('sim.chartAlt')}>
                <Suspense fallback={<div className="h-full w-full animate-pulse rounded-xl bg-salt" />}>
                  <SimChart data={series} hour={hour} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[300px] border-separate border-spacing-y-2 text-left text-sm sm:text-base">
              <caption className="sr-only">{t('sim.stats.caption', { season: t(`sim.season.${season}`) })}</caption>
              <thead>
                <tr className="text-muted">
                  <th scope="col" className="px-3 font-medium">{t('sim.stats.metric')}</th>
                  <th scope="col" className="px-3 text-right font-semibold text-sky-dark">{t('sim.series.arch')}</th>
                  <th scope="col" className="px-3 text-right font-semibold text-ink">{t('sim.series.flat')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="bg-salt">
                    <th scope="row" className="rounded-l-xl px-3 py-3 font-medium text-ink">
                      {t(`sim.stats.${row.key}`)}
                    </th>
                    <td className="px-3 py-3 text-right font-heading font-bold tabular-nums text-sky-dark">{row.arch}</td>
                    <td className="rounded-r-xl px-3 py-3 text-right font-heading font-bold tabular-nums text-ink">{row.flat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 px-3 text-xs text-muted">{t('sim.stats.units')}</p>
          </div>

          <div className="mt-6 rounded-xl bg-sky-soft p-4 text-ink">
            <p className="font-semibold">{t('sim.takeawayTitle')}</p>
            <p className="mt-1 text-sm">{t('sim.takeaway')}</p>
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm text-muted">
            <Info aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0" />
            <em>{t('sim.caption')}</em>
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
