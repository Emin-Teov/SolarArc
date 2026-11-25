/**
 * Prototype telemetry: the shape returned by GET {VITE_PROTOTYPE_URL}/data,
 * plus a mock generator that produces realistic, smoothly varying values for demos.
 */

export interface PrototypeReading {
  power_w: number
  voltage_v: number
  current_ma: number
  panel_temp_c: number
  soil_ec_ds_m: number
  soil_moisture_pct: number
  timestamp: string
}

const FIELDS = [
  'power_w',
  'voltage_v',
  'current_ma',
  'panel_temp_c',
  'soil_ec_ds_m',
  'soil_moisture_pct',
] as const

/** Validate an unknown JSON payload from the prototype. Returns null if it doesn't match. */
export function parseReading(json: unknown): PrototypeReading | null {
  if (typeof json !== 'object' || json === null) return null
  const obj = json as Record<string, unknown>
  for (const f of FIELDS) {
    if (typeof obj[f] !== 'number' || !Number.isFinite(obj[f])) return null
  }
  return {
    power_w: obj.power_w as number,
    voltage_v: obj.voltage_v as number,
    current_ma: obj.current_ma as number,
    panel_temp_c: obj.panel_temp_c as number,
    soil_ec_ds_m: obj.soil_ec_ds_m as number,
    soil_moisture_pct: obj.soil_moisture_pct as number,
    timestamp: typeof obj.timestamp === 'string' ? obj.timestamp : new Date().toISOString(),
  }
}

/** Mean-reverting random walk: smooth, bounded drift around a centre value. */
class Drift {
  private value: number
  constructor(
    private readonly centre: number,
    private readonly spread: number,
    private readonly speed: number,
  ) {
    this.value = centre + (Math.random() - 0.5) * spread
  }
  next(): number {
    const pull = (this.centre - this.value) * 0.08
    const noise = (Math.random() - 0.5) * this.spread * this.speed
    this.value += pull + noise
    return this.value
  }
}

/** Create a stateful mock generator for a small tabletop prototype panel. */
export function createMockGenerator() {
  const irradiance = new Drift(0.85, 0.25, 0.35) // relative light level
  const temp = new Drift(31, 2.5, 0.25)
  const ec = new Drift(2.4, 0.3, 0.15)
  const moisture = new Drift(38, 4, 0.2)
  let tick = 0

  return function next(): PrototypeReading {
    tick++
    // Slow passing-cloud wave on top of the random drift.
    const light = Math.min(1, Math.max(0.35, irradiance.next() + 0.06 * Math.sin(tick / 9)))
    const voltage = 4.6 + 0.7 * light + (Math.random() - 0.5) * 0.04
    const power = 2.1 * light + (Math.random() - 0.5) * 0.03
    return {
      power_w: round(power, 2),
      voltage_v: round(voltage, 2),
      current_ma: Math.round((power / voltage) * 1000),
      panel_temp_c: round(temp.next() + light * 1.5, 1),
      soil_ec_ds_m: round(ec.next(), 2),
      soil_moisture_pct: round(moisture.next(), 1),
      timestamp: new Date().toISOString(),
    }
  }
}

const round = (x: number, digits: number) => Math.round(x * 10 ** digits) / 10 ** digits
