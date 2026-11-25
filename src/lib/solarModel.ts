/**
 * SolarArc simulator — a deliberately simple, transparent geometric model.
 *
 * - Latitude 40° N, solar time, clear sky (Meinel air-mass model).
 * - Arch: runs North–South, 9 flat facets tilted +80° (East) … −80° (West).
 * - Flat reference: the same 9 panels, all tilted 30° facing South.
 * - Output of a facet = max(0, cos θ) × I(β).
 * - Everything is normalised so that the flat-panel summer peak = 100.
 *
 * The model is NOT tuned in favour of the arch. Its honest message is a wider,
 * flatter daily curve; the flat panel may well produce more energy per panel.
 *
 * Coordinates: x = East, y = North, z = Up.
 */

export type Season = 'summer' | 'winter'
export type Design = 'arch' | 'flat'
export type Vec3 = readonly [number, number, number]

export const LATITUDE_DEG = 40
export const DECLINATION_DEG: Record<Season, number> = { summer: 23.4, winter: -23.4 }
export const FACET_COUNT = 9
export const FLAT_TILT_DEG = 30
export const START_HOUR = 5
export const END_HOUR = 21
export const STEP_HOURS = 0.25

const rad = (deg: number) => (deg * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

/** Facet tilts in degrees: 80, 60, 40, 20, 0, −20, −40, −60, −80 (positive = facing East). */
export const ARCH_TILTS_DEG: readonly number[] = Array.from(
  { length: FACET_COUNT },
  (_, i) => 80 - (160 / (FACET_COUNT - 1)) * i,
)

/** Unit normal of an arch facet with the given tilt (positive = towards East). */
export function archNormal(tiltDeg: number): Vec3 {
  const t = rad(tiltDeg)
  return [Math.sin(t), 0, Math.cos(t)]
}

/** Unit normal of the flat reference panel (30° tilt, facing South). */
export const FLAT_NORMAL: Vec3 = [0, -Math.sin(rad(FLAT_TILT_DEG)), Math.cos(rad(FLAT_TILT_DEG))]

export interface SunPosition {
  /** Solar elevation β in degrees (negative = below horizon). */
  elevationDeg: number
  /** Azimuth in degrees, clockwise from North (90 = East, 180 = South, 270 = West). */
  azimuthDeg: number
  /** Unit vector pointing to the sun (East, North, Up). */
  vector: Vec3
}

export function sunPosition(hour: number, season: Season): SunPosition {
  const lat = rad(LATITUDE_DEG)
  const dec = rad(DECLINATION_DEG[season])
  const omega = rad(15 * (hour - 12))

  const east = -Math.cos(dec) * Math.sin(omega)
  const north = Math.cos(lat) * Math.sin(dec) - Math.sin(lat) * Math.cos(dec) * Math.cos(omega)
  // sin β = sin(lat)·sin δ + cos(lat)·cos δ·cos ω
  const up = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(omega)

  const azimuth = (deg(Math.atan2(east, north)) + 360) % 360
  return { elevationDeg: deg(Math.asin(up)), azimuthDeg: azimuth, vector: [east, north, up] }
}

/** Meinel clear-sky irradiance in W/m² for a given sin(β). Zero when the sun is down. */
export function irradiance(sinElevation: number): number {
  if (sinElevation <= 0) return 0
  const airMass = 1 / sinElevation
  return 1000 * Math.pow(0.7, Math.pow(airMass, 0.678))
}

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Raw per-facet irradiance on the panel plane, in W/m². */
export function rawFacetPowers(hour: number, season: Season, design: Design): number[] {
  const sun = sunPosition(hour, season)
  const sinBeta = sun.vector[2]
  if (sinBeta <= 0) return new Array<number>(FACET_COUNT).fill(0)
  const intensity = irradiance(sinBeta)
  const normals = design === 'arch' ? ARCH_TILTS_DEG.map(archNormal) : new Array(FACET_COUNT).fill(FLAT_NORMAL)
  return normals.map((n: Vec3) => Math.max(0, dot(n, sun.vector)) * intensity)
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Normalisation constant: total flat-panel power at the summer peak (solar noon). */
const NORMALISER = (() => {
  let peak = 0
  for (let h = START_HOUR; h <= END_HOUR + 1e-9; h += 1 / 60) {
    peak = Math.max(peak, sum(rawFacetPowers(h, 'summer', 'flat')))
  }
  return peak
})()

/** Total normalised power (flat summer peak = 100). */
export function totalPower(hour: number, season: Season, design: Design): number {
  return (sum(rawFacetPowers(hour, season, design)) / NORMALISER) * 100
}

/**
 * Per-facet light level in 0…1, for tinting the diagram.
 * 1 = the brightest a single facet can ever get in this model (sun at zenith, facing it).
 */
export function facetLightLevels(hour: number, season: Season, design: Design): number[] {
  const maxSingle = irradiance(1)
  return rawFacetPowers(hour, season, design).map((p) => Math.min(1, p / maxSingle))
}

export interface SeriesPoint {
  hour: number
  arch: number
  flat: number
}

/** 15-minute series from 05:00 to 21:00 (65 points), normalised. */
export function dailySeries(season: Season): SeriesPoint[] {
  const points: SeriesPoint[] = []
  const steps = Math.round((END_HOUR - START_HOUR) / STEP_HOURS)
  for (let i = 0; i <= steps; i++) {
    const hour = START_HOUR + i * STEP_HOURS
    points.push({ hour, arch: totalPower(hour, season, 'arch'), flat: totalPower(hour, season, 'flat') })
  }
  return points
}

export interface DailyStats {
  /** Fraction (0…1) of daily energy produced before 10:00 and after 16:00. */
  shoulderShare: number
  /** Peak normalised power. */
  peak: number
  /** Daily energy in relative units (normalised power × hours). */
  dailyEnergy: number
}

export function dailyStats(series: SeriesPoint[], design: Design): DailyStats {
  let energy = 0
  let shoulder = 0
  let peak = 0
  for (const p of series) {
    const e = p[design] * STEP_HOURS
    energy += e
    if (p.hour < 10 || p.hour >= 16) shoulder += e
    peak = Math.max(peak, p[design])
  }
  return { shoulderShare: energy > 0 ? shoulder / energy : 0, peak, dailyEnergy: energy }
}
