import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import az from './locales/az.json'
import ru from './locales/ru.json'
import { isLang, type Lang } from './lib/format'

const STORAGE_KEY = 'solararc.lang'

function readUrlLang(): Lang | null {
  try {
    const value = new URLSearchParams(window.location.search).get('lang')
    return isLang(value) ? value : null
  } catch {
    return null
  }
}

function readStoredLang(): Lang | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isLang(value) ? value : null
  } catch {
    return null
  }
}

function storeLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* storage unavailable (private mode etc.) — ignore */
  }
}

/** Priority: ?lang= URL param → saved choice → English. */
const initialLang: Lang = readUrlLang() ?? readStoredLang() ?? 'en'

function applyDocumentLang(lang: Lang) {
  document.documentElement.lang = lang
  document.title = i18n.t('meta.title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'))
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    az: { translation: az },
    ru: { translation: ru },
  },
  lng: initialLang,
  fallbackLng: 'en',
  supportedLngs: ['en', 'az', 'ru'],
  interpolation: { escapeValue: false },
  returnNull: false,
})

storeLang(initialLang)
applyDocumentLang(initialLang)

i18n.on('languageChanged', (lng) => {
  if (!isLang(lng)) return
  storeLang(lng)
  applyDocumentLang(lng)
  // Keep a shareable URL in sync if the visitor arrived with ?lang=.
  try {
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lng)
      window.history.replaceState(null, '', url)
    }
  } catch {
    /* ignore */
  }
})

export default i18n
