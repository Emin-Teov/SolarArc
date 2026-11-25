/**
 * SolarArc — ALL project numbers live here, and nowhere else.
 *
 * To update a figure, change the value and (if needed) its status:
 *   'measured'     → confirmed by prototype / pilot measurement
 *   'estimate'     → planning estimate
 *   'under_review' → shown with a dotted underline + "Under review" tooltip
 *
 * Labels and units are in src/locales/*.json, so editing numbers here never
 * requires touching components or translations.
 */

export type Status = 'measured' | 'estimate' | 'under_review'

export type CropKey =
  | 'mushrooms'
  | 'cherryTomato'
  | 'strawberry'
  | 'spinach'
  | 'garlic'
  | 'microgreensBasil'

export const project = {
  archHeightM: { value: 3.5, status: 'estimate' },
  pilotAreaHa: { value: 10, status: 'estimate' },
  capacityMW: { solararc: 15, classic: 8, status: 'under_review' },
  annualGWh: { solararc: 23.6, classic: 12.4, status: 'under_review' },
  homesPowered: { solararc: 7600, classic: 4000, status: 'estimate' },
  farmAreaHa: { value: 5.5, status: 'estimate' },
  foodTonnesPerYear: { value: 445.6, status: 'under_review' },
  co2TonnesPerYear: { value: 11420, status: 'estimate' },
  jobs: { value: 64, status: 'estimate' },
  landValueUplift: { min: 7, max: 10, status: 'estimate' },
  crops: [
    { key: 'mushrooms', areaHa: 1.0 },
    { key: 'cherryTomato', areaHa: 1.2 },
    { key: 'strawberry', areaHa: 1.0 },
    { key: 'spinach', areaHa: 1.0 },
    { key: 'garlic', areaHa: 0.8 },
    { key: 'microgreensBasil', areaHa: 0.5 },
  ],

  // The financial model is being revised. Do NOT display any finance figures
  // (revenue, profit, payback, "x times more profit") until the team confirms.
  // finance: {
  //   revenuePerYear: { value: 0, status: 'under_review' },
  //   paybackYears: { value: 0, status: 'under_review' },
  // },
} as const satisfies {
  archHeightM: { value: number; status: Status }
  pilotAreaHa: { value: number; status: Status }
  capacityMW: { solararc: number; classic: number; status: Status }
  annualGWh: { solararc: number; classic: number; status: Status }
  homesPowered: { solararc: number; classic: number; status: Status }
  farmAreaHa: { value: number; status: Status }
  foodTonnesPerYear: { value: number; status: Status }
  co2TonnesPerYear: { value: number; status: Status }
  jobs: { value: number; status: Status }
  landValueUplift: { min: number; max: number; status: Status }
  crops: ReadonlyArray<{ key: CropKey; areaHa: number }>
}

/** Non-numeric site settings (placeholders until the team fills them in). */
export const site = {
  contactEmail: 'e1000.tavakkulov@gmail.com',
} as const
