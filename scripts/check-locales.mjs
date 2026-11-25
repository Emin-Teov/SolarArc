// Verifies that en.json, az.json and ru.json have identical key sets and matching {{placeholders}}.
import { readFileSync } from 'node:fs'

const load = (l) => JSON.parse(readFileSync(new URL(`../src/locales/${l}.json`, import.meta.url), 'utf8'))
const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)]]))
const vars = (s) => [...s.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort().join(',')

const en = new Map(flatten(load('en')))
let problems = 0
for (const lang of ['az', 'ru']) {
  const other = new Map(flatten(load(lang)))
  for (const [k, v] of en) {
    if (!other.has(k)) { console.error(`[${lang}] missing key: ${k}`); problems++ }
    else if (vars(v) !== vars(other.get(k))) { console.error(`[${lang}] placeholder mismatch in ${k}: en{${vars(v)}} vs ${lang}{${vars(other.get(k))}}`); problems++ }
    else if (!other.get(k).trim()) { console.error(`[${lang}] empty: ${k}`); problems++ }
  }
  for (const k of other.keys()) if (!en.has(k)) { console.error(`[${lang}] extra key: ${k}`); problems++ }
}
if (problems) { console.error(`\n${problems} problem(s).`); process.exit(1) }
console.log(`Locales OK — ${en.size} keys in en/az/ru, placeholders match.`)
