import { useTranslation } from 'react-i18next'

export const LANGUAGES = ['en', 'az', 'ru'] as const
export type Lang = (typeof LANGUAGES)[number]

export const LOCALE_BY_LANG: Record<Lang, string> = { en: 'en-US', az: 'az-AZ', ru: 'ru-RU' }

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

/**
 * Some browsers (notably Chrome, which ships trimmed ICU data) report az-AZ as
 * supported but format it with English separators ("7,600.5"). Azerbaijani uses
 * "7.600,5" — the same separators as Turkish — so fall back to tr-TR for numbers.
 */
function resolveLocale(lang: Lang): string {
  if (lang !== 'az') return LOCALE_BY_LANG[lang]
  try {
    return new Intl.NumberFormat('az-AZ').format(1234.5) === '1.234,5' ? 'az-AZ' : 'tr-TR'
  } catch {
    return 'tr-TR'
  }
}

const cache = new Map<string, Intl.NumberFormat>()

export function formatNumber(value: number, lang: Lang, options: Intl.NumberFormatOptions = {}): string {
  const key = lang + JSON.stringify(options)
  let fmt = cache.get(key)
  if (!fmt) {
    fmt = new Intl.NumberFormat(resolveLocale(lang), options)
    cache.set(key, fmt)
  }
  return fmt.format(value)
}

/** "07:30" from 7.5 */
export function formatHour(hour: number): string {
  const total = Math.round(hour * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Hook returning locale-aware number formatters for the active language. */
export function useFormat() {
  const { t, i18n } = useTranslation()
  const lang: Lang = isLang(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'
  const num = (value: number, maxFractionDigits = 0, minFractionDigits = 0) =>
    formatNumber(value, lang, { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: minFractionDigits })
  return {
    lang,
    num,
    /** Percent from a 0…1 fraction; placement of the % sign comes from the locale file. */
    pct: (fraction: number) => t('common.percent', { value: num(fraction * 100) }),
  }
}
