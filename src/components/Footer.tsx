import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { site } from '../data/project'
import { LogoMark } from './Logo'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-ink text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <LogoMark className="h-8 w-8" />
            {t('common.brand')}
          </p>
          <p className="mt-3 text-sm">{t('hero.subtitle')}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{t('footer.team')}</p>
          <a href={`mailto:${site.contactEmail}`} className="mt-2 inline-flex items-center gap-2 underline underline-offset-4 hover:text-sun">
            <Mail aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
            {site.contactEmail}
          </a>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{t('footer.event')}</p>
          <p className="mt-2">{t('footer.occasion')}</p>
          <p className="mt-2">{t('footer.aiNote')}</p>
          <p className="mt-2 text-white/70">{t('footer.modelNote')}</p>
        </div>
      </div>
    </footer>
  )
}
