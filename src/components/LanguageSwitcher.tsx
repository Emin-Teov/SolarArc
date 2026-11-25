import { useTranslation } from 'react-i18next'
import { LANGUAGES, isLang } from '../lib/format'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = isLang(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'

  return (
    <div role="group" aria-label={t('nav.languageGroup')} className="flex items-center gap-0.5 rounded-full bg-ink/5 p-0.5">
      {LANGUAGES.map((lng) => {
        const active = lng === current
        return (
          <button
            key={lng}
            type="button"
            lang={lng}
            aria-pressed={active}
            aria-label={`${t(`nav.languageCode.${lng}`)} — ${t(`nav.languageName.${lng}`)}`}
            onClick={() => void i18n.changeLanguage(lng)}
            className={`min-w-10 rounded-full px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
              active ? 'bg-ink text-white shadow-sm' : 'text-ink hover:bg-white'
            }`}
          >
            {t(`nav.languageCode.${lng}`)}
          </button>
        )
      })}
    </div>
  )
}
