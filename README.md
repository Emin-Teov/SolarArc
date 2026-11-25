# SolarArc — web app

Single-page site presenting **SolarArc** at the CECECO Clean Energy Hackathon 2027:
solar panels on 3.5 m steel arches over saline land — energy on top, an oasis below.

English (default) · Azərbaycanca · Русский

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # local dev server → http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build → http://localhost:4173
npm test           # simulator unit tests (Vitest)
npm run lint       # oxlint
npm run check-locales   # verify en/az/ru have the same keys and placeholders
```

The build is fully static (`dist/`) and works on Netlify, Vercel or GitHub Pages
(asset paths are relative, so sub-paths like `user.github.io/solararc/` work too).

Open a specific language directly with `?lang=en`, `?lang=az` or `?lang=ru`. The choice is remembered.

## Images

Copy the real files into `public/images/` with exactly these names:

| File | Shown in |
|---|---|
| `prototype-arch.jpg` | Prototype — photo of the working model |
| `fig1-section.jpg` | Prototype — East–West section drawing |
| `concept-interior.jpg` | Solution — AI concept render (inside the arch) |
| `concept-aerial.jpg` | Solution — AI concept render (aerial) |

Until a file exists, a placeholder ("Image coming soon") is shown. Concept renders are automatically
labelled "Concept visualization (AI-generated)". Landscape images around 1600 × 1200 px work best.

## Concept video

`public/videos/solararc-concept.mp4` (AI-generated, 16:9) is shown in the Solution section with the poster
`public/videos/solararc-concept.jpg` (a frame from the video). It plays muted and looped only while on screen,
never autoplays with reduced motion, and has native controls. To replace it, keep the same file names.

## Editing numbers

**Every figure lives in [`src/data/project.ts`](src/data/project.ts)** — change it there and nowhere else.

Each value has a `status`:

- `measured` — confirmed by measurement
- `estimate` — planning estimate
- `under_review` — shown with a dotted underline and an "Under review" tooltip

Example: once the capacity is confirmed, change
`capacityMW: { solararc: 15, classic: 8, status: 'under_review' }` to `status: 'measured'`.

Financial figures are deliberately **not** shown (the model is being revised). A commented-out
`finance` block is waiting in `project.ts`.

The contact email (footer and "Get in touch" button) is `site.contactEmail` in the same file.

## Translations

Texts live in [`src/locales/`](src/locales/): `en.json` (source), `az.json`, `ru.json`.

- Keep the same keys in all three files; run `npm run check-locales` after editing.
- `{{value}}`-style placeholders are filled in by the app (numbers are formatted per language) — keep them in every translation.
- Units are part of the translation (`"{{value}} MW"` / `"{{value}} MVt"` / `"{{value}} МВт"`).
- Glossary and style rules: [`.ai-knowledge/06-i18n.md`](.ai-knowledge/06-i18n.md).

## Connecting the prototype (live dashboard)

Create `.env.local` in the project root:

```
VITE_PROTOTYPE_URL=http://192.168.1.50:8080
```

then restart `npm run dev` (or rebuild). The dashboard polls `GET {VITE_PROTOTYPE_URL}/data` every 2 s and expects:

```json
{ "power_w": 1.8, "voltage_v": 5.2, "current_ma": 346, "panel_temp_c": 31.4,
  "soil_ec_ds_m": 2.4, "soil_moisture_pct": 38, "timestamp": "2026-11-25T10:00:00Z" }
```

- Connected → green **Live** badge.
- No URL set → **Demo data** badge with realistic simulated values.
- URL set but unreachable / bad JSON → "Prototype offline — showing demo data"; it keeps retrying.

The controller must send `Access-Control-Allow-Origin: *` (CORS), otherwise the browser blocks the request.
If the site is served over HTTPS, the prototype must be HTTPS too (browsers block HTTP requests from HTTPS pages).

## The simulator

[`src/lib/solarModel.ts`](src/lib/solarModel.ts) is a deliberately simple geometric model (40° N, clear sky,
9 arch facets from +80° to −80° vs 9 flat panels at 30° South). It is not tuned in the arch's favour:
the arch shows a wider, flatter daily curve, and the flat panel produces more total energy per panel —
the page says so openly. Details: [`.ai-knowledge/05-simulator-model.md`](.ai-knowledge/05-simulator-model.md).

## Project notes

Design decisions, open questions and the build checklist are in [`.ai-knowledge/`](.ai-knowledge/README.md).
