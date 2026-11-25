import { useState } from 'react'
import { ImageOff, Maximize2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SmartImageProps {
  src: string
  alt: string
  caption: string
  /** AI-generated render → labelled as a concept visualization. */
  concept?: boolean
  aspect?: string
  priority?: boolean
  /** 'contain' for drawings/diagrams whose edges must not be cropped. */
  fit?: 'cover' | 'contain'
  /** Clicking opens the full-size image in a new tab (useful for detailed drawings). */
  zoomable?: boolean
}

/**
 * Image with a captioned figure. If the file is missing (the team copies real
 * photos into public/images/), a tasteful placeholder is shown instead of a broken icon.
 */
export function SmartImage({
  src,
  alt,
  caption,
  concept = false,
  aspect = 'aspect-[4/3]',
  priority = false,
  fit = 'cover',
  zoomable = false,
}: SmartImageProps) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const url = `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`

  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <div className={`relative ${aspect} w-full`}>
        {failed ? (
          <div
            role="img"
            aria-label={alt}
            className="panel-grid absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-sky-soft via-white to-sun-soft p-6 text-center"
          >
            <ImageOff aria-hidden="true" strokeWidth={1.5} className="h-10 w-10 text-muted" />
            <p className="max-w-[28ch] text-sm font-medium text-muted">{t('common.imageMissing')}</p>
          </div>
        ) : zoomable ? (
          <a href={url} target="_blank" rel="noopener" className="group absolute inset-0 cursor-zoom-in">
            <img
              src={url}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => setFailed(true)}
              className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition group-hover:opacity-90`}
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white opacity-90 backdrop-blur">
              <Maximize2 aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
              {t('common.fullSize')}
            </span>
          </a>
        ) : (
          <img
            src={url}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
          />
        )}
        {concept && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Sparkles aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
            {t('common.conceptImage')}
          </span>
        )}
      </div>
      <figcaption className="px-5 py-4 text-sm text-muted">{caption}</figcaption>
    </figure>
  )
}
