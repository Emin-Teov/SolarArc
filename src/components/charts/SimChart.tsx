import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { formatHour, useFormat } from '../../lib/format'
import type { SeriesPoint } from '../../lib/solarModel'

const SKY = '#2F80ED'
const MUTED = '#5E6B63'

export default function SimChart({ data, hour }: { data: SeriesPoint[]; hour: number }) {
  const { t } = useTranslation()
  const { num } = useFormat()
  const names = { arch: t('sim.series.arch'), flat: t('sim.series.flat') }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
        <CartesianGrid stroke="#16241C" strokeOpacity={0.07} vertical={false} />
        <XAxis
          dataKey="hour"
          type="number"
          domain={[5, 21]}
          ticks={[6, 9, 12, 15, 18, 21]}
          tickFormatter={formatHour}
          tick={{ fill: MUTED, fontSize: 12 }}
          stroke="#16241C"
          strokeOpacity={0.2}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(v: number) => num(v)}
          tick={{ fill: MUTED, fontSize: 12 }}
          stroke="#16241C"
          strokeOpacity={0.2}
          width={44}
        />
        <Tooltip
          labelFormatter={(label) => formatHour(Number(label))}
          formatter={(value, name) => [num(Number(value), 1), names[name as keyof typeof names] ?? String(name)]}
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px -8px rgb(22 36 28 / 0.25)' }}
        />
        <Legend formatter={(value: string) => names[value as keyof typeof names] ?? value} wrapperStyle={{ fontSize: 13 }} />
        <ReferenceLine x={hour} stroke="#F5B700" strokeWidth={2} />
        <Line type="monotone" dataKey="arch" stroke={SKY} strokeWidth={3} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="flat" stroke={MUTED} strokeWidth={2.5} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
