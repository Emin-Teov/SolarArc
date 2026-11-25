import { ArrowDown, Gauge } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { project } from '../data/project'
import { useFormat } from '../lib/format'

/** Large arch silhouette with facets, crops and a sun travelling along an arc. */
function HeroArt() {
  // Facets along the arch, same geometry idea as the simulator (80° … −80°).
  const cx = 400
  const cy = 430
  const r = 250
  const facets = Array.from({ length: 9 }, (_, i) => 80 - 20 * i)
  return (
    <svg viewBox="0 0 800 460" className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="hero-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7A5C3E" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7A5C3E" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="hero-sun">
          <stop offset="0" stopColor="#FFE07A" />
          <stop offset="0.6" stopColor="#F5B700" />
          <stop offset="1" stopColor="#F5B700" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun on an arc (rotates around the arch centre) */}
      <g className="anim-sun-arc" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy - 400} r="46" fill="url(#hero-sun)" />
        <circle cx={cx} cy={cy - 400} r="22" fill="#F5B700" />
      </g>
      <path d={`M ${cx - 400} ${cy} A 400 400 0 0 1 ${cx + 400} ${cy}`} fill="none" stroke="#F5B700" strokeOpacity="0.25" strokeDasharray="4 10" />

      {/* Ground */}
      <rect x="0" y={cy} width="800" height="40" fill="url(#hero-ground)" />

      {/* Crops under the arch */}
      {Array.from({ length: 11 }, (_, i) => {
        const x = cx - 200 + i * 40
        return (
          <g key={i} transform={`translate(${x} ${cy})`} className="anim-float" style={{ animationDelay: `${i * 0.4}s` }}>
            <path d="M0 0 C -2 -14 -12 -18 -16 -20 C -12 -12 -6 -6 0 0 Z" fill="#2E9E5B" opacity="0.75" />
            <path d="M0 0 C 2 -16 12 -22 16 -24 C 12 -14 6 -6 0 0 Z" fill="#2E9E5B" opacity="0.9" />
          </g>
        )
      })}

      {/* Arch frame */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1F6F40" strokeWidth="7" strokeLinecap="round" />
      <path d={`M ${cx - r + 26} ${cy} A ${r - 26} ${r - 26} 0 0 1 ${cx + r - 26} ${cy}`} fill="none" stroke="#1F6F40" strokeOpacity="0.35" strokeWidth="2" />

      {/* Panel facets */}
      {facets.map((tilt) => {
        const a = (tilt * Math.PI) / 180
        const x = cx + (r + 10) * Math.sin(a)
        const y = cy - (r + 10) * Math.cos(a)
        return (
          <rect
            key={tilt}
            x={-38}
            y={-6}
            width={76}
            height={12}
            rx={2}
            fill="#2F80ED"
            stroke="#E8F1FD"
            strokeWidth="1.5"
            transform={`translate(${x} ${y}) rotate(${tilt})`}
          />
        )
      })}
    </svg>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const { num } = useFormat()
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-linear-to-b from-[#D9E9FC] via-[#EEF4F8] to-[#FFEBB0] pb-0 pt-28 sm:pt-32"
    >
      <div className="panel-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <p className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-leaf-dark shadow-soft backdrop-blur sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-sun" aria-hidden="true" />
            <span className="min-w-0">{t('hero.badge')}</span>
          </p>
          <h1 id="hero-title" className="text-[2rem] font-bold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-5 font-heading text-xl font-semibold text-leaf-dark sm:text-2xl">{t('hero.subtitle')}</p>
          <p className="mt-4 max-w-[60ch] text-base text-muted sm:text-lg">{t('hero.lead', { height: num(project.archHeightM.value, 1) })}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#solution"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-6 py-3 text-center font-semibold text-ink shadow-soft transition hover:brightness-105"
            >
              <ArrowDown aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 shrink-0" />
              {t('hero.ctaHow')}
            </a>
            <a
              href="#simulator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-center font-semibold text-leaf-dark shadow-soft ring-1 ring-leaf-dark/15 transition hover:bg-sky-soft"
            >
              <Gauge aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 shrink-0" />
              {t('hero.ctaSim')}
            </a>
          </div>
        </motion.div>
      </div>
      <div className="mx-auto mt-6 h-[220px] max-w-5xl sm:mt-0 sm:h-[340px] lg:-mt-16 lg:h-[400px]">
        <HeroArt />
      </div>
    </section>
  )
}
