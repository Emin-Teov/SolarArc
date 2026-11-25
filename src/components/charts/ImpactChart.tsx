import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { project } from '../../data/project'
import { useFormat } from '../../lib/format'

export default function ImpactChart() {
  const { t } = useTranslation()
  const { num } = useFormat()
  const data = [
    { metric: t('impact.chart.capacity'), solararc: project.capacityMW.solararc, classic: project.capacityMW.classic },
    { metric: t('impact.chart.generation'), solararc: project.annualGWh.solararc, classic: project.annualGWh.classic },
  ]
  const names = { solararc: t('impact.chart.solararc'), classic: t('impact.chart.classic') }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 24, right: 8, bottom: 4, left: -12 }} barGap={6}>
        <CartesianGrid stroke="#16241C" strokeOpacity={0.07} vertical={false} />
        <XAxis dataKey="metric" tick={{ fill: '#5E6B63', fontSize: 12 }} stroke="#16241C" strokeOpacity={0.2} interval={0} />
        <YAxis tick={{ fill: '#5E6B63', fontSize: 12 }} tickFormatter={(v: number) => num(v)} stroke="#16241C" strokeOpacity={0.2} />
        <Tooltip
          cursor={{ fill: '#F7F5F0' }}
          formatter={(value, name) => [num(Number(value), 1), names[name as keyof typeof names] ?? String(name)]}
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px -8px rgb(22 36 28 / 0.25)' }}
        />
        <Legend formatter={(value: string) => names[value as keyof typeof names] ?? value} wrapperStyle={{ fontSize: 13 }} />
        <Bar dataKey="solararc" fill="#2F80ED" radius={[8, 8, 0, 0]} isAnimationActive={false}>
          <LabelList dataKey="solararc" position="top" formatter={(v: unknown) => num(Number(v), 1)} fill="#16241C" fontSize={12} />
        </Bar>
        <Bar dataKey="classic" fill="#7A5C3E" radius={[8, 8, 0, 0]} isAnimationActive={false}>
          <LabelList dataKey="classic" position="top" formatter={(v: unknown) => num(Number(v), 1)} fill="#16241C" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
