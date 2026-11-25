import { Suspense, lazy } from 'react'
import { Briefcase, CloudSun, Home, LandPlot, Wheat, Zap, BatteryCharging } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { project } from '../data/project'
import { useFormat } from '../lib/format'
import { Reveal, Section } from './Section'
import { StatCard } from './StatCard'
import { StatusMark } from './StatusMark'

const ImpactChart = lazy(() => import('./charts/ImpactChart'))

export function ImpactStats() {
  const { t } = useTranslation()
  const { num } = useFormat()
  const p = project

  const groups = [
    {
      key: 'energy',
      cards: [
        { icon: Zap, label: t('impact.stats.capacity'), value: p.capacityMW.solararc, decimals: 0, status: p.capacityMW.status, render: (v: string) => t('impact.units.mw', { value: v }), accent: 'sky' as const },
        { icon: BatteryCharging, label: t('impact.stats.generation'), value: p.annualGWh.solararc, decimals: 1, status: p.annualGWh.status, render: (v: string) => t('impact.units.gwh', { value: v }), accent: 'sky' as const },
        { icon: Home, label: t('impact.stats.homes'), value: p.homesPowered.solararc, decimals: 0, status: p.homesPowered.status, render: (v: string) => v, accent: 'sky' as const },
      ],
    },
    {
      key: 'food',
      cards: [{ icon: Wheat, label: t('impact.stats.food'), value: p.foodTonnesPerYear.value, decimals: 1, status: p.foodTonnesPerYear.status, render: (v: string) => t('impact.units.t', { value: v }), accent: 'leaf' as const }],
    },
    {
      key: 'climate',
      cards: [{ icon: CloudSun, label: t('impact.stats.co2'), value: p.co2TonnesPerYear.value, decimals: 0, status: p.co2TonnesPerYear.status, render: (v: string) => t('impact.units.t', { value: v }), accent: 'leaf' as const }],
    },
    {
      key: 'people',
      cards: [{ icon: Briefcase, label: t('impact.stats.jobs'), value: p.jobs.value, decimals: 0, status: p.jobs.status, render: (v: string) => v, accent: 'sun' as const }],
    },
    {
      key: 'land',
      cards: [
        {
          icon: LandPlot,
          label: t('impact.stats.land'),
          value: p.landValueUplift.min,
          valueMax: p.landValueUplift.max,
          decimals: 0,
          status: p.landValueUplift.status,
          render: (v: string, max?: string) => t('impact.units.uplift', { min: v, max }),
          accent: 'soil' as const,
        },
      ],
    },
  ]

  return (
    <Section
      id="impact"
      tone="salt"
      eyebrow={t('impact.eyebrow')}
      title={t('impact.title', { area: num(p.pilotAreaHa.value) })}
      lead={t('impact.lead', { area: num(p.pilotAreaHa.value) })}
    >
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-6">
        {groups.map((g) => (
          <div key={g.key} className={g.key === 'energy' ? 'md:col-span-2 lg:col-span-6' : 'lg:col-span-3 xl:col-span-3'}>
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-soil">{t(`impact.groups.${g.key}`)}</h3>
            <div className={`grid gap-4 ${g.key === 'energy' ? 'sm:grid-cols-3' : ''}`}>
              {g.cards.map((c) => (
                <Reveal key={c.label}>
                  <StatCard {...c} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Reveal className="mt-10">
        <div className="rounded-2xl bg-white p-5 shadow-soft sm:p-8">
          <h3 className="text-xl font-bold text-ink">
            <StatusMark status={p.capacityMW.status}>{t('impact.chart.title', { area: num(p.pilotAreaHa.value) })}</StatusMark>
          </h3>
          <div className="mt-4 h-72" role="img" aria-label={t('impact.chart.alt', {
            area: num(p.pilotAreaHa.value),
            sMw: num(p.capacityMW.solararc), cMw: num(p.capacityMW.classic),
            sGwh: num(p.annualGWh.solararc, 1), cGwh: num(p.annualGWh.classic, 1),
          })}>
            <Suspense fallback={<div className="h-full w-full animate-pulse rounded-xl bg-salt" />}>
              <ImpactChart />
            </Suspense>
          </div>
        </div>
      </Reveal>

      <p className="mt-6 max-w-[70ch] text-sm italic text-muted">{t('impact.footnote', { area: num(p.pilotAreaHa.value) })}</p>
    </Section>
  )
}
