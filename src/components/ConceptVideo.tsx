import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BASE = import.meta.env.BASE_URL
const VIDEO = `${BASE}videos/solararc-concept.mp4`
const POSTER = `${BASE}videos/solararc-concept.jpg`

/**
 * AI-generated concept video. Muted, looping, plays only while on screen.
 * With reduced motion it never autoplays: the poster shows and the visitor can press play.
 * Native controls let visitors pause or unmute.
 */
export function ConceptVideo() {
  const { t } = useTranslation()
  const ref = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduceMotion) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <figure className="overflow-hidden rounded-2xl bg-ink shadow-soft">
      <div className="relative aspect-video w-full">
        <video
          ref={ref}
          src={VIDEO}
          poster={POSTER}
          muted
          loop
          playsInline
          controls
          preload="none"
          aria-label={t('solution.video.label')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          <Sparkles aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
          {t('common.conceptImage')}
        </span>
      </div>
      <figcaption className="bg-white px-5 py-4 text-sm text-muted">{t('solution.video.caption')}</figcaption>
    </figure>
  )
}
