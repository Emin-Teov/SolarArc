import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { project } from '../data/project'
import { useFormat } from '../lib/format'

const HOTSPOTS = ['arch', 'layout', 'shade', 'drip', 'cooling', 'crops'] as const
type HotspotKey = (typeof HOTSPOTS)[number]

/** Hotspot positions in % of the diagram box (viewBox 800 × 480). */
const POS: Record<HotspotKey, { x: number; y: number }> = {
  arch: { x: 17, y: 63 },
  layout: { x: 63, y: 10 },
  shade: { x: 40, y: 50 },
  drip: { x: 58, y: 71 },
  cooling: { x: 74, y: 90 },
  crops: { x: 34, y: 66 },
}

const CX = 400
const GROUND = 360
const R = 270

/** Interactive cross-section of a SolarArc bay (looking North: East on the right). */
export function ArchDiagram() {
  const { t } = useTranslation()
  const { num } = useFormat()
  const vars = { height: num(project.archHeightM.value, 1) }
  const [active, setActive] = useState<HotspotKey>('arch')
  const facets = Array.from({ length: 9 }, (_, i) => 80 - 20 * i)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-soft">
        <svg viewBox="0 0 800 480" className="block h-auto w-full" role="img" aria-labelledby="arch-diagram-title">
          <title id="arch-diagram-title">{t('solution.diagram.alt')}</title>
          <defs>
            <linearGradient id="ad-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#E8F1FD" />
              <stop offset="1" stopColor="#FFF8E1" />
            </linearGradient>
            <linearGradient id="ad-shade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#16241C" stopOpacity="0.02" />
              <stop offset="1" stopColor="#16241C" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <rect width="800" height={GROUND} fill="url(#ad-sky)" />
          {/* Shade under the arch */}
          <path d={`M ${CX - R + 30} ${GROUND} A ${R - 30} ${R - 30} 0 0 1 ${CX + R - 30} ${GROUND} Z`} fill="url(#ad-shade)" />

          {/* Soil layers */}
          <rect y={GROUND} width="800" height="38" fill="#9B7B5B" />
          <rect y={GROUND + 38} width="800" height="44" fill="#7A5C3E" />
          <rect y={GROUND + 82} width="800" height="40" fill="#5E4630" />
          {/* Salt washed down by drip irrigation */}
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={210 + i * 16} cy={GROUND + 60 + (i % 3) * 5} r="2" fill="#F7F5F0" opacity="0.8" />
          ))}

          {/* Ground cooling channel */}
          <rect x="120" y={GROUND + 92} width="560" height="18" rx="9" fill="#E8F1FD" opacity="0.9" stroke="#2F80ED" strokeDasharray="6 5" />
          <path d={`M 600 ${GROUND + 101} h 40 m -10 -6 l 10 6 l -10 6`} stroke="#2F80ED" strokeWidth="2" fill="none" />

          {/* Crops */}
          {Array.from({ length: 9 }, (_, i) => {
            const x = CX - 180 + i * 45
            return (
              <g key={i} transform={`translate(${x} ${GROUND})`}>
                <path d="M0 0 v -18" stroke="#1F6F40" strokeWidth="2" />
                <ellipse cx="-9" cy="-16" rx="10" ry="5" transform="rotate(-30 -9 -16)" fill="#2E9E5B" />
                <ellipse cx="9" cy="-22" rx="10" ry="5" transform="rotate(30 9 -22)" fill="#2E9E5B" />
                {i % 2 === 0 && <circle cx="3" cy="-8" r="4" fill="#E2483D" />}
              </g>
            )
          })}

          {/* Drip line */}
          <path d={`M ${CX - 200} ${GROUND - 2} H ${CX + 200}`} stroke="#2F80ED" strokeWidth="3" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={CX - 180 + i * 45 + 20} cy={GROUND + 4} r="2.5" fill="#2F80ED" />
          ))}
          {/* EC sensor */}
          <g transform={`translate(${CX + 110} ${GROUND})`}>
            <rect x="-6" y="-26" width="12" height="18" rx="3" fill="#16241C" />
            <path d="M -3 -8 v 40 M 3 -8 v 40" stroke="#16241C" strokeWidth="2" />
          </g>

          {/* Arch frame */}
          <path d={`M ${CX - R} ${GROUND} A ${R} ${R} 0 0 1 ${CX + R} ${GROUND}`} fill="none" stroke="#1F6F40" strokeWidth="8" />
          <path d={`M ${CX - R + 22} ${GROUND} A ${R - 22} ${R - 22} 0 0 1 ${CX + R - 22} ${GROUND}`} fill="none" stroke="#1F6F40" strokeWidth="3" />
          {/* Lattice so wind passes through */}
          {Array.from({ length: 16 }, (_, i) => {
            const a1 = ((-85 + i * 11) * Math.PI) / 180
            const a2 = ((-85 + (i + 1) * 11) * Math.PI) / 180
            return (
              <line
                key={i}
                x1={CX + R * Math.sin(a1)}
                y1={GROUND - R * Math.cos(a1)}
                x2={CX + (R - 22) * Math.sin(a2)}
                y2={GROUND - (R - 22) * Math.cos(a2)}
                stroke="#1F6F40"
                strokeWidth="1.5"
                opacity="0.6"
              />
            )
          })}

          {/* Panel facets */}
          {facets.map((tilt) => {
            const a = (tilt * Math.PI) / 180
            return (
              <rect
                key={tilt}
                x={-42}
                y={-7}
                width={84}
                height={14}
                rx={2}
                fill="#2F80ED"
                stroke="#FFFFFF"
                strokeWidth="2"
                transform={`translate(${CX + (R + 12) * Math.sin(a)} ${GROUND - (R + 12) * Math.cos(a)}) rotate(${tilt})`}
              />
            )
          })}

          {/* Height marker */}
          <g stroke="#5E6B63" strokeWidth="1.5">
            <path d={`M 40 ${GROUND} V ${GROUND - R - 18}`} />
            <path d={`M 32 ${GROUND} h 16 M 32 ${GROUND - R - 18} h 16`} />
          </g>
          <text x="52" y={GROUND - R / 2} fontSize="20" fontWeight="700" fill="#16241C">
            {t('common.meters', { value: num(project.archHeightM.value, 1) })}
          </text>

          {/* Compass */}
          <text x="24" y="30" fontSize="18" fontWeight="700" fill="#5E6B63">{t('common.westShort')}</text>
          <text x="760" y="30" fontSize="18" fontWeight="700" fill="#5E6B63">{t('common.eastShort')}</text>
        </svg>

        {/* Accessible hotspots */}
        {HOTSPOTS.map((key, i) => {
          const isActive = key === active
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              aria-label={`${i + 1}. ${t(`solution.hotspots.${key}.title`, vars)}`}
              onClick={() => setActive(key)}
              onMouseEnter={() => setActive(key)}
              onFocus={() => setActive(key)}
              style={{ left: `${POS[key].x}%`, top: `${POS[key].y}%` }}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold shadow-soft ring-4 transition sm:h-9 sm:w-9 ${
                isActive ? 'scale-110 bg-sun text-ink ring-sun/30' : 'bg-white text-ink ring-white/60 hover:bg-sun-soft'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Explanation panel */}
      <div className="rounded-2xl bg-white p-6 shadow-soft" aria-live="polite">
        <p className="text-sm font-semibold text-soil">
          {t('solution.diagram.stepOf', { n: HOTSPOTS.indexOf(active) + 1, total: HOTSPOTS.length })}
        </p>
        <h3 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-bold text-ink">
          {t(`solution.hotspots.${active}.title`, vars)}
          {active === 'cooling' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sun-soft px-2.5 py-0.5 font-body text-xs font-semibold text-soil">
              <FlaskConical aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
              {t('common.inTesting')}
            </span>
          )}
        </h3>
        <p className="mt-3 text-muted">{t(`solution.hotspots.${active}.body`, vars)}</p>

        <ul className="mt-6 grid gap-1.5" aria-label={t('solution.diagram.listLabel')}>
          {HOTSPOTS.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setActive(key)}
                aria-pressed={key === active}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                  key === active ? 'bg-sun-soft font-semibold text-ink' : 'text-muted hover:bg-salt'
                }`}
              >
                <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-bold text-ink">
                  {i + 1}
                </span>
                <span className="min-w-0">{t(`solution.hotspots.${key}.title`, vars)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
