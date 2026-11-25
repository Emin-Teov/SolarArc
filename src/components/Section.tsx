import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export type SectionTone = 'salt' | 'sky' | 'sun' | 'white'

const toneClass: Record<SectionTone, string> = {
  salt: 'bg-salt',
  sky: 'bg-sky-soft',
  sun: 'bg-sun-soft',
  white: 'bg-white',
}

interface SectionProps {
  id: string
  tone?: SectionTone
  eyebrow?: string
  title: string
  lead?: ReactNode
  children: ReactNode
  className?: string
}

/** Page section with anchor id, alternating background, header and entrance animation. */
export function Section({ id, tone = 'salt', eyebrow, title, lead, children, className = '' }: SectionProps) {
  const headingId = `${id}-title`
  return (
    <section id={id} aria-labelledby={headingId} className={`relative scroll-mt-16 overflow-hidden py-16 sm:py-24 ${toneClass[tone]} ${className}`}>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10 max-w-[70ch] sm:mb-14"
        >
          {eyebrow && (
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-soil">{eyebrow}</p>
          )}
          <h2 id={headingId} className="text-3xl font-bold text-leaf-dark sm:text-4xl">
            {title}
          </h2>
          {lead && <div className="mt-4 text-lg text-muted">{lead}</div>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}

/** Fade/slide-in wrapper for content blocks. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
