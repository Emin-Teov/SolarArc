import { useTranslation } from 'react-i18next'
import { Reveal, Section } from './Section'

const STEPS = ['s1', 's2', 's3', 's4', 's5'] as const

export function Roadmap() {
  const { t } = useTranslation()
  return (
    <Section id="roadmap" tone="sun" eyebrow={t('roadmap.eyebrow')} title={t('roadmap.title')} lead={t('roadmap.lead')}>
      <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
        {/* connecting line: vertical on mobile, horizontal on desktop */}
        <span aria-hidden="true" className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-sun/60 lg:bottom-auto lg:left-4 lg:right-4 lg:top-[19px] lg:h-0.5 lg:w-auto" />
        {STEPS.map((s, i) => (
          <li key={s} className="relative pl-14 lg:pl-0 lg:pt-14">
            <Reveal delay={i * 0.06}>
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full font-heading font-bold shadow-soft ${
                  i === 0 ? 'bg-sun text-ink' : 'bg-white text-ink ring-2 ring-sun'
                }`}
              >
                {i + 1}
              </span>
              <div className="rounded-2xl bg-white p-5 shadow-soft">
                <p className="font-heading text-sm font-bold text-soil">{t(`roadmap.steps.${s}.when`)}</p>
                <p className="mt-2 text-ink">{t(`roadmap.steps.${s}.what`)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
