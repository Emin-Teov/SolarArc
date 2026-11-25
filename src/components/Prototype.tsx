import { Cpu, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, Section } from './Section'
import { SmartImage } from './SmartImage'

export function Prototype() {
  const { t } = useTranslation()
  return (
    <Section id="prototype" tone="salt" eyebrow={t('prototype.eyebrow')} title={t('prototype.title')} lead={t('prototype.lead')}>
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <SmartImage src="images/prototype-arch.jpg" alt={t('prototype.photo.alt')} caption={t('prototype.photo.caption')} aspect="aspect-[16/9]" />
        </Reveal>
        <Reveal delay={0.08}>
          <SmartImage src="images/fig1-section.jpg" alt={t('prototype.drawing.alt')} caption={t('prototype.drawing.caption')} aspect="aspect-[16/9]" fit="contain" zoomable />
        </Reveal>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { key: 'realtime', icon: Zap },
          { key: 'controller', icon: Cpu },
        ].map(({ key, icon: Icon }) => (
          <Reveal key={key}>
            <div className="flex h-full gap-4 rounded-2xl bg-white p-5 shadow-soft">
              <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-6 w-6 shrink-0 text-sky-dark" />
              <p className="text-ink">{t(`prototype.points.${key}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
