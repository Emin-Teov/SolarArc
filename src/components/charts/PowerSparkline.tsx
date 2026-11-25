import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useFormat } from '../../lib/format'

export default function PowerSparkline({ values }: { values: number[] }) {
  const { t } = useTranslation()
  const { num } = useFormat()
  const data = values.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2F80ED" stopOpacity={0.35} />
            <stop offset="1" stopColor="#2F80ED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin - 0.2', 'dataMax + 0.2']} />
        <Tooltip
          labelFormatter={() => ''}
          formatter={(value) => [t('dashboard.units.w', { value: num(Number(value), 2, 2) }), t('dashboard.tiles.power')]}
          contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px -8px rgb(22 36 28 / 0.25)' }}
        />
        <Area type="monotone" dataKey="v" stroke="#2F80ED" strokeWidth={2} fill="url(#spark-fill)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
