import { Handshake, LandPlot, PlugZap, Tractor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { site } from '../data/project'
import { Reveal, Section } from './Section'

export function Partners() {
  const { t } = useTranslation()
  const cards = [
    { key: 'land', icon: LandPlot, tone: 'bg-soil/10 text-soil' },
    { key: 'grid', icon: PlugZap, tone: 'bg-sky-soft text-sky-dark' },
    { key: 'agri', icon: Tractor, tone: 'bg-leaf/10 text-leaf-dark' },
    { key: 'investor', icon: Handshake, tone: 'bg-sun-soft text-soil' },
  ] as const

  return (
    <Section id="partners" tone="salt" eyebrow={t('partners.eyebrow')} title={t('partners.title')} lead={t('partners.lead')}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, icon: Icon, tone }, i) => (
          <li key={key}>
          <Reveal delay={i * 0.06} className="h-full">
            <div className="h-full rounded-2xl bg-white p-6 shadow-soft">
              <span className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-ink">{t(`partners.cards.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted">{t(`partners.cards.${key}.body`)}</p>
            </div>
          </Reveal>
          </li>
        ))}
      </ul>
      <Reveal className="mt-8">
        <a
          href={`mailto:${site.contactEmail}`}
          className="inline-flex items-center justify-center rounded-full bg-sun px-6 py-3 text-center font-semibold text-ink shadow-soft transition hover:brightness-105"
        >
          {t('partners.cta')}
        </a>
      </Reveal>
    </Section>
  )
}
