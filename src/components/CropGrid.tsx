import type { ReactElement } from 'react'
import { Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { project, type CropKey } from '../data/project'
import { useFormat } from '../lib/format'
import { Reveal, Section } from './Section'

const S = { fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Simple line illustrations (no emoji), 48×48. */
const ART: Record<CropKey, ReactElement> = {
  mushrooms: (
    <g {...S} stroke="#7A5C3E">
      <path d="M8 24a12 9 0 0 1 24 0z" fill="#F3E6D6" />
      <path d="M16 24v10a4 4 0 0 0 8 0V24" />
      <path d="M26 30a8 6 0 0 1 16 0z" fill="#F3E6D6" />
      <path d="M31 30v6a3 3 0 0 0 6 0v-6" />
      <path d="M4 40h40" />
    </g>
  ),
  cherryTomato: (
    <g {...S}>
      <circle cx="17" cy="28" r="9" fill="#FCD5CF" stroke="#C9372C" />
      <circle cx="32" cy="31" r="8" fill="#FCD5CF" stroke="#C9372C" />
      <path d="M17 19l-3-4m3 4l3-4m-3 4v-6M32 23v-5" stroke="#1F6F40" />
      <path d="M17 13c6-4 12-2 15 5" stroke="#1F6F40" />
    </g>
  ),
  strawberry: (
    <g {...S}>
      <path d="M24 40c-8-4-13-11-12-18 1-4 6-6 12-6s11 2 12 6c1 7-4 14-12 18z" fill="#FCD5CF" stroke="#C9372C" />
      <path d="M16 15l4 3 4-5 4 5 4-3" stroke="#1F6F40" />
      <path d="M19 25h.01M24 23h.01M29 25h.01M21 31h.01M27 31h.01M24 36h.01" stroke="#C9372C" strokeWidth={2.5} />
    </g>
  ),
  spinach: (
    <g {...S} stroke="#1F6F40">
      <path d="M24 42V22" />
      <path d="M24 30c-10 0-15-7-14-16 9 0 14 6 14 16z" fill="#D5EEDD" />
      <path d="M24 26c9 0 14-6 13-15-9 0-13 6-13 15z" fill="#D5EEDD" />
      <path d="M8 42h32" stroke="#7A5C3E" />
    </g>
  ),
  garlic: (
    <g {...S} stroke="#7A5C3E">
      <path d="M24 10c0 6-12 10-12 20a12 10 0 0 0 24 0c0-10-12-14-12-20z" fill="#FBF7EF" />
      <path d="M24 16v24M18 24c0 6 2 12 6 16M30 24c0 6-2 12-6 16" />
      <path d="M22 6c1 2 1 4 2 4s1-2 2-4" stroke="#1F6F40" />
    </g>
  ),
  microgreensBasil: (
    <g {...S}>
      <path d="M8 40h32l-3 6H11z" fill="#EADBC8" stroke="#7A5C3E" />
      <path d="M14 40v-8M20 40v-11M28 40v-11M34 40v-8" stroke="#1F6F40" />
      <ellipse cx="11" cy="31" rx="3.5" ry="2" fill="#D5EEDD" stroke="#1F6F40" />
      <ellipse cx="17" cy="28" rx="3.5" ry="2" fill="#D5EEDD" stroke="#1F6F40" />
      <path d="M28 29c-6-1-8-7-6-13 6 2 7 8 6 13zM28 29c5-2 9-8 7-13-6 2-8 8-7 13z" fill="#D5EEDD" stroke="#1F6F40" />
      <ellipse cx="37" cy="31" rx="3.5" ry="2" fill="#D5EEDD" stroke="#1F6F40" />
    </g>
  ),
}

export function CropGrid() {
  const { t } = useTranslation()
  const { num } = useFormat()

  return (
    <Section id="crops" tone="sky" eyebrow={t('crops.eyebrow')} title={t('crops.title')} lead={t('crops.lead')}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {project.crops.map((crop, i) => (
          <li key={crop.key}>
          <Reveal delay={(i % 3) * 0.06} className="h-full">
            <div className="flex h-full gap-4 rounded-2xl bg-white p-5 shadow-soft">
              <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0" aria-hidden="true" focusable="false">
                {ART[crop.key]}
              </svg>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-ink">{t(`crops.items.${crop.key}.name`)}</h3>
                <p className="text-sm font-semibold text-leaf-dark">{t('common.hectares', { value: num(crop.areaHa, 1, 1) })}</p>
                <p className="mt-1 text-sm text-muted">{t(`crops.items.${crop.key}.note`)}</p>
              </div>
            </div>
          </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-6">
        <article className="relative overflow-hidden rounded-2xl bg-linear-to-br from-sun-soft to-white p-6 shadow-soft ring-2 ring-sun sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sun text-ink">
              <Award aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wider text-soil">{t('crops.premium.eyebrow')}</p>
              <h3 className="mt-1 text-2xl font-bold text-ink">{t('crops.premium.title')}</h3>
              <p className="mt-2 max-w-[70ch] text-ink/85">{t('crops.premium.body')}</p>
            </div>
          </div>
        </article>
      </Reveal>
      <p className="mt-4 text-sm text-muted">
        {t('crops.total', { value: num(project.farmAreaHa.value, 1, 1) })}
      </p>
    </Section>
  )
}
