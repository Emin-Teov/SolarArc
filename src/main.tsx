import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts: each CSS file contains latin, latin-ext (Azerbaijani ə ğ ı ş …) and
// cyrillic faces with unicode-range, so browsers only download what a page uses.
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './styles/index.css'
import './i18n'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
