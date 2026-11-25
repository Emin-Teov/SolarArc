import { Factory, Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, Section } from './Section'

/** Sun → evaporation arrows → white salt layer left in the topsoil. */
function SaltRisingDiagram() {
  const { t } = useTranslation()
  return (
    <figure className="rounded-2xl bg-white p-5 shadow-soft sm:p-8">
      <svg viewBox="0 0 640 300" className="h-auto w-full" role="img" aria-labelledby="salt-diagram-title">
        <title id="salt-diagram-title">{t('problem.diagram.alt')}</title>
        {/* sky */}
        <rect width="640" height="170" fill="#E8F1FD" />
        {/* sun */}
        <circle cx="90" cy="62" r="30" fill="#F5B700" />
        <g stroke="#F5B700" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            return <line key={i} x1={90 + 40 * Math.cos(a)} y1={62 + 40 * Math.sin(a)} x2={90 + 52 * Math.cos(a)} y2={62 + 52 * Math.sin(a)} />
          })}
        </g>
        <text x="150" y="52" fontSize="18" fontWeight="600" fill="#16241C">{t('problem.diagram.heat')}</text>

        {/* evaporation arrows */}
        {[230, 310, 390, 470, 550].map((x, i) => (
          <g key={x} className="anim-rise" style={{ animationDelay: `${i * 0.45}s` }}>
            <path d={`M ${x} 150 v -46`} stroke="#2F80ED" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${x - 8} 112 l 8 -10 l 8 10`} fill="none" stroke="#2F80ED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        <text x="230" y="88" fontSize="16" fill="#1C5FBF" fontWeight="600">{t('problem.diagram.evaporation')}</text>

        {/* soil */}
        <rect y="170" width="640" height="130" fill="#B8977A" />
        <rect y="170" width="640" height="18" fill="#FFFFFF" />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={8 + i * 16} cy={179 + (i % 3) * 2} r={2.2} fill="#E3E0D8" />
        ))}
        <rect y="188" width="640" height="112" fill="#7A5C3E" opacity="0.5" />
        {/* dying plant */}
        <g transform="translate(130 170)">
          <path d="M0 0 v -28" stroke="#7A5C3E" strokeWidth="3" />
          <path d="M0 -18 c -10 2 -16 10 -18 16" fill="none" stroke="#9C8B5E" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 -24 c 9 0 14 6 16 12" fill="none" stroke="#9C8B5E" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* salt moving upward in soil */}
        {[260, 360, 460, 560].map((x) => (
          <path key={x} d={`M ${x} 280 v -70`} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 6" />
        ))}
        <rect x="380" y="205" rx="8" width="244" height="30" fill="#16241C" opacity="0.75" />
        <text x="392" y="226" fontSize="15" fontWeight="600" fill="#FFFFFF">{t('problem.diagram.salt')}</text>
        <text x="16" y="286" fontSize="14" fill="#FFFFFF" fontWeight="500">{t('problem.diagram.soil')}</text>
      </svg>
      <figcaption className="mt-4 text-sm text-muted">{t('problem.diagram.caption')}</figcaption>
    </figure>
  )
}

export function Problem() {
  const { t } = useTranslation()
  const cards = [
    { key: 'saline', icon: Sprout, tone: 'bg-soil/10 text-soil' },
    { key: 'singleUse', icon: Factory, tone: 'bg-sky-soft text-sky-dark' },
  ] as const

  return (
    <Section id="problem" tone="salt" eyebrow={t('problem.eyebrow')} title={t('problem.title')} lead={t('problem.lead')}>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map(({ key, icon: Icon, tone }, i) => (
          <Reveal key={key} delay={i * 0.08}>
            <article className="h-full rounded-2xl bg-white p-6 shadow-soft sm:p-8">
              <span className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-ink sm:text-2xl">{t(`problem.cards.${key}.title`)}</h3>
              <p className="mt-3 text-muted">{t(`problem.cards.${key}.body`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <SaltRisingDiagram />
      </Reveal>
    </Section>
  )
}
