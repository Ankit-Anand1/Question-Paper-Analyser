'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useStore } from '@/store/useStore'
import { BarChart2 } from 'lucide-react'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip" style={{ padding: '16px 20px' }}>
      <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
              <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 15, color: 'var(--text)', fontWeight: 800 }}>{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card card-p" style={{ textAlign: 'center', padding: 60 }}>
      <BarChart2 size={44} color="var(--indigo)" style={{ margin: '0 auto 12px', opacity: .3 }} />
      <p style={{ fontWeight: 600, color: 'var(--text2)' }}>No data yet</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Upload question papers to see analysis charts</p>
    </div>
  )
}

export function TrendChart({ delay = 0 }) {
  const { trendData } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!trendData.length) return <EmptyState />
  if (!mounted) return <div style={{ height: 280 }} />

  const subjects = Object.keys(trendData[0] || {}).filter(k => k !== 'year')

  return (
    <motion.div className="card card-p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>Year-wise Trends & Frequency</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Track exactly how often topics bounce back</p>
        </div>
        <span className="badge badge-info shadow-glow">Premium Insight</span>
      </div>
      <div style={{ height: 320, width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {subjects.map((sub, i) => (
                <linearGradient key={sub} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.3} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={16} fontSize={13} fontWeight={600} />
            <YAxis tickLine={false} axisLine={false} tickMargin={16} fontSize={13} fontWeight={600} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.1 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 20, fontWeight: 600 }} />
            {subjects.map((sub, i) => (
              <Area
                key={sub} type="natural" dataKey={sub}
                stroke={COLORS[i % COLORS.length]} strokeWidth={4}
                fill={`url(#grad-${i})`}
                dot={{ fill: 'var(--card)', r: 5, strokeWidth: 3, stroke: COLORS[i % COLORS.length] }}
                activeDot={{ r: 8, strokeWidth: 0, fill: COLORS[i % COLORS.length], filter: `drop-shadow(0px 0px 8px ${COLORS[i % COLORS.length]})` }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export function SubjectDistribution({ delay = 0 }) {
  const { questions } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!questions.length) return null
  if (!mounted) return <div style={{ height: 200 }} />

  const counts = {}
  questions.forEach(q => counts[q.subject] = (counts[q.subject] || 0) + 1)
  const data = Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  return (
    <motion.div className="card card-p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>Subject Composition</h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Historical distribution inside the papers</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, flex: 1 }}>
        <div style={{ height: 240, width: '100%' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={6}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ filter: `drop-shadow(0px 8px 16px ${COLORS[i % COLORS.length]}55)` }} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.slice(0, 4).map((d, i) => {
            const pct = Math.round((d.value / questions.length) * 100)
            return (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '4px', background: COLORS[i % COLORS.length], boxShadow: `0 2px 8px ${COLORS[i % COLORS.length]}88` }} />
                    <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                      {d.name.length > 22 ? d.name.substring(0, 22) + '…' : d.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{pct}%</span>
                </div>
                <div className="prog-bar" style={{ height: 6, background: 'var(--bg)' }}>
                  <motion.div className="prog-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: .8, delay: delay + i * .15 }} style={{ background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export function DifficultyChart({ delay = 0 }) {
  const { questions } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!questions.length) return null
  if (!mounted) return <div style={{ height: 220 }} />

  const bySubj = {}
  questions.forEach(q => {
    if (!bySubj[q.subject]) bySubj[q.subject] = { easy: 0, medium: 0, hard: 0 }
    bySubj[q.subject][q.difficulty]++
  })

  const data = Object.entries(bySubj).map(([name, v]) => ({
    name: name.length > 10 ? name.substring(0, 10) + '…' : name,
    Easy: v.easy, Medium: v.medium, Hard: v.hard
  }))

  return (
    <motion.div className="card card-p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>Difficulty Distribution</h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Complexity breakdown mapping</p>
      </div>
      <div style={{ height: 350, width: '100%', flex: 1 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.3} stroke="var(--border)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={16} fontSize={13} angle={-35} textAnchor="end" fontWeight={600} />
            <YAxis tickLine={false} axisLine={false} tickMargin={16} fontSize={13} fontWeight={600} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.15, radius: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 30, fontWeight: 600 }} />
            <Bar dataKey="Easy" stackId="a" fill="var(--green)" radius={[4, 4, 4, 4]} barSize={28} />
            <Bar dataKey="Medium" stackId="a" fill="var(--amber)" radius={[4, 4, 4, 4]} />
            <Bar dataKey="Hard" stackId="a" fill="var(--red)" radius={[8, 8, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default function ChartsContainer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TrendChart delay={0} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <SubjectDistribution delay={0.1} />
        <DifficultyChart delay={0.2} />
      </div>
    </div>
  )
}
