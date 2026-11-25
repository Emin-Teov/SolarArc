import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LogoMark } from './Logo'

const LINKS = ['problem', 'solution', 'prototype', 'simulator', 'impact', 'roadmap'] as const

export function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid ? 'bg-salt/85 shadow-[0_1px_0_rgb(22_36_28/0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        {t('nav.skip')}
      </a>
      <nav aria-label={t('nav.label')} className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex shrink-0 items-center gap-2" aria-label={t('nav.home')}>
          <LogoMark className="h-8 w-8" />
          <span className="font-heading text-lg font-bold text-ink">{t('common.brand')}</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-white hover:text-ink">
                {t(`nav.links.${id}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X strokeWidth={1.5} aria-hidden="true" /> : <Menu strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-ink/5 bg-salt/95 backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:grid-cols-2 sm:px-6">
          {LINKS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-medium text-ink hover:bg-white"
              >
                {t(`nav.links.${id}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
