import { Mountain, Sprout, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ArchDiagram } from './ArchDiagram'
import { Reveal, Section } from './Section'
import { SmartImage } from './SmartImage'

export function Solution() {
  const { t } = useTranslation()
  const pillars = [
    { key: 'energy', icon: Zap, tone: 'bg-sky-soft text-sky-dark' },
    { key: 'food', icon: Sprout, tone: 'bg-leaf/10 text-leaf-dark' },
    { key: 'soil', icon: Mountain, tone: 'bg-soil/10 text-soil' },
  ] as const

  return (
    <Section id="solution" tone="sky" eyebrow={t('solution.eyebrow')} title={t('solution.title')} lead={t('solution.lead')}>
      <Reveal>
        <ArchDiagram />
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {pillars.map(({ key, icon: Icon, tone }, i) => (
          <Reveal key={key} delay={i * 0.08}>
            <article className="h-full rounded-2xl bg-white p-6 shadow-soft">
              <span className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-ink">{t(`solution.pillars.${key}.title`)}</h3>
              <p className="mt-2 text-muted">{t(`solution.pillars.${key}.body`)}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <SmartImage src="images/concept-interior.jpg" alt={t('solution.concepts.interior.alt')} caption={t('solution.concepts.interior.caption')} concept aspect="aspect-[16/9]" />
        </Reveal>
        <Reveal delay={0.08}>
          <SmartImage src="images/concept-aerial.jpg" alt={t('solution.concepts.aerial.alt')} caption={t('solution.concepts.aerial.caption')} concept aspect="aspect-[16/9]" />
        </Reveal>
      </div>
    </Section>
  )
}
