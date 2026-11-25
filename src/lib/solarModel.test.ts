import { describe, expect, it } from 'vitest'
import {
  ARCH_TILTS_DEG,
  dailySeries,
  dailyStats,
  sunPosition,
  totalPower,
} from './solarModel'

describe('solarModel', () => {
  it('has 9 arch facets from +80° (East) to −80° (West)', () => {
    expect(ARCH_TILTS_DEG).toEqual([80, 60, 40, 20, 0, -20, -40, -60, -80])
  })

  it('produces zero output at night', () => {
    for (const season of ['summer', 'winter'] as const) {
      for (const hour of [0, 3, 23]) {
        expect(totalPower(hour, season, 'arch')).toBe(0)
        expect(totalPower(hour, season, 'flat')).toBe(0)
      }
    }
    // Winter sun is still down at 06:00 at 40° N.
    expect(sunPosition(6, 'winter').elevationDeg).toBeLessThan(0)
    expect(totalPower(6, 'winter', 'arch')).toBe(0)
  })

  // Honest result of the model: in summer the arch leads from sunrise until
  // ~07:45; after that the 30° south-facing flat panel produces more.
  it('arch output in the early morning exceeds flat output (summer)', () => {
    for (const hour of [6, 6.5, 7, 7.5]) {
      expect(totalPower(hour, 'summer', 'arch')).toBeGreaterThan(totalPower(hour, 'summer', 'flat'))
    }
  })

  it('arch output is symmetric around solar noon', () => {
    for (const season of ['summer', 'winter'] as const) {
      for (const dx of [0.5, 1.75, 3, 4.25, 6]) {
        expect(totalPower(12 - dx, season, 'arch')).toBeCloseTo(totalPower(12 + dx, season, 'arch'), 8)
      }
    }
  })

  it('normalises the flat-panel summer peak to 100', () => {
    const stats = dailyStats(dailySeries('summer'), 'flat')
    expect(stats.peak).toBeCloseTo(100, 6)
  })

  it('sun rises in the East and sets in the West', () => {
    expect(sunPosition(7, 'summer').azimuthDeg).toBeLessThan(180)
    expect(sunPosition(17, 'summer').azimuthDeg).toBeGreaterThan(180)
  })

  it('arch gives a wider curve: larger share of energy before 10:00 and after 16:00', () => {
    const series = dailySeries('summer')
    expect(dailyStats(series, 'arch').shoulderShare).toBeGreaterThan(dailyStats(series, 'flat').shoulderShare)
  })

  it('winter produces less than summer', () => {
    const s = dailyStats(dailySeries('summer'), 'flat')
    const w = dailyStats(dailySeries('winter'), 'flat')
    expect(w.dailyEnergy).toBeLessThan(s.dailyEnergy)
  })
})
