'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, CheckCircle, Circle, TrendingUp, TrendingDown, Minus, ChevronDown, Eye, Flame, Star, BarChart2, Layers } from 'lucide-react'
import { useStore } from '@/store/useStore'

const PRIO_CFG = {
  high:   { emoji: '🔥', label: 'High',   cls: 'badge-high'   },
  medium: { emoji: '⚡', label: 'Medium', cls: 'badge-medium' },
  low:    { emoji: '📘', label: 'Low',    cls: 'badge-low'    },
}

function TrendIcon({ trend }) {
  if (trend === 'rising')   return <TrendingUp   size={12} color="var(--green)" />
  if (trend === 'declining') return <TrendingDown size={12} color="var(--red)"   />
  return <Minus size={12} color="var(--amber)" />
}

function TopicCard({ topic, idx }) {
  const [expanded, setExpanded] = useState(false)
  const { toggleCovered } = useStore()
  const cfg = PRIO_CFG[topic.priority]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(idx * .025, .4) }}
      style={{ borderBottom: '1px solid var(--border)', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 8px', cursor: 'pointer', transition: 'background .2s', borderRadius: 8 }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {/* Toggle covered */}
        <button onClick={e => { e.stopPropagation(); toggleCovered(topic.id) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'transform .2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {topic.covered
            ? <CheckCircle size={18} color="var(--green)" />
            : <Circle size={18} color="var(--muted)" />}
        </button>

        {/* Score ring */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, flexShrink: 0,
          background: topic.priority === 'high' ? 'rgba(239,68,68,.14)' : topic.priority === 'medium' ? 'rgba(245,158,11,.14)' : 'rgba(16,185,129,.14)',
          border: `2px solid ${topic.priority === 'high' ? 'rgba(239,68,68,.3)' : topic.priority === 'medium' ? 'rgba(245,158,11,.3)' : 'rgba(16,185,129,.3)'}`,
          color: topic.priority === 'high' ? 'var(--red)' : topic.priority === 'medium' ? 'var(--amber)' : 'var(--green)',
        }}>
          {topic.priorityScore}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: topic.covered ? 'line-through' : 'none', opacity: topic.covered ? .5 : 1 }}>
              {cfg.emoji} {topic.name}
            </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{topic.subject}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>•</span>
            <TrendIcon trend={topic.trend} />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{topic.trend}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>•</span>
            <Eye size={10} color="var(--muted)" />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{topic.frequency}×</span>
          </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: topic.covered ? .3 : 1 }}>
              <span className={`badge ${cfg.cls}`} style={{ background: 'transparent' }}>{cfg.label} Pri</span>
            </div>
            <ChevronDown size={14} color="var(--muted)" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }} />
          </div>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2 }}
            style={{ borderTop: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,.04)', fontSize: 12, color: 'var(--text2)' }}>
                <b style={{ color: 'var(--text)' }}>Score:</b> {topic.priorityScore}/100
              </div>
              <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,.04)', fontSize: 12, color: 'var(--text2)' }}>
                <b style={{ color: 'var(--text)' }}>Years:</b> {topic.years?.join(', ')}
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Exam Probability</p>
            <div className="prog-bar" style={{ height: 6 }}>
              <motion.div className="prog-fill" initial={{ width: 0 }} animate={{ width: `${topic.priorityScore}%` }} transition={{ duration: .5 }}
                style={{ background: topic.priority === 'high' ? 'var(--red)' : topic.priority === 'medium' ? 'var(--amber)' : 'var(--green)' }} />
            </div>
            {topic.priority === 'high' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(239,68,68,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={12} color="var(--red)" />
                </div>
                Highly likely to appear — prioritize this topic!
              </div>
            )}
            {topic.trend === 'rising' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.15)', fontSize: 12, color: 'var(--green)' }}>
                <Star size={12} /> Rising trend — increasing importance in recent years
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TopicList() {
  const { topics, getCoveredPct } = useStore()
  const [search, setSearch] = useState('')
  const [prio, setPrio]     = useState('all')
  const [subj, setSubj]     = useState('all')
  const [showFilter, setShowFilter] = useState(false)

  const subjects = ['all', ...Array.from(new Set(topics.map(t => t.subject)))]
  const filtered = topics.filter(t => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
    return ms && (prio === 'all' || t.priority === prio) && (subj === 'all' || t.subject === subj)
  })

  if (!topics.length) return (
    <div className="card card-p" style={{ textAlign: 'center', padding: 60 }}>
      <BarChart2 size={44} color="var(--indigo)" style={{ margin: '0 auto 12px', opacity: .3 }} />
      <p style={{ fontWeight: 600, color: 'var(--text2)' }}>No topics yet</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Upload question papers to see priority rankings</p>
    </div>
  )

  const pct = getCoveredPct()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Coverage */}
      <div className="card card-p">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Syllabus Coverage</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--indigo)' }}>{pct}%</span>
        </div>
        <div className="prog-bar">
          <motion.div className="prog-fill" animate={{ width: `${pct}%` }} transition={{ duration: .6 }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
          {topics.filter(t => t.covered).length}/{topics.length} topics covered — click any topic to mark it done
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="inp" placeholder="Search topics or subjects…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowFilter(!showFilter)}>
          <Filter size={13} /> Filter
        </button>
      </div>

      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['all','high','medium','low'].map(p => (
              <button key={p} onClick={() => setPrio(p)} className="btn btn-sm"
                style={{ background: prio === p ? 'rgba(99,102,241,.2)' : 'var(--card)', border: `1px solid ${prio === p ? 'rgba(99,102,241,.4)' : 'var(--border)'}`, color: prio === p ? 'var(--indigo)' : 'var(--text2)', cursor: 'pointer' }}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
            <select className="inp btn-sm" style={{ width: 'auto', height: 'auto', cursor: 'pointer' }} value={subj} onChange={e => setSubj(e.target.value)}>
              {subjects.map(s => <option key={s} value={s} style={{ background: '#090e1d' }}>{s === 'all' ? 'All Subjects' : s}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ fontSize: 12, color: 'var(--muted)' }}>Showing {filtered.length} of {topics.length} topics</p>

      {/* List */}
      <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {Object.entries(
          filtered.reduce((acc, t) => {
            const mod = t.module || 'Uncategorized';
            if (!acc[mod]) acc[mod] = [];
            acc[mod].push(t);
            return acc;
          }, {})
        ).map(([moduleName, moduleTopics], modIdx) => (
          <div key={moduleName} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 8, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={16} color="var(--indigo)" />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{moduleName}</h4>
              <span className="badge" style={{ background: 'var(--bg2)', color: 'var(--muted)', fontSize: 10 }}>{moduleTopics.length} Topics</span>
            </div>
            <div style={{ padding: '0 8px', marginBottom: 16 }}>
              {moduleTopics.map((t, i) => <TopicCard key={t.id} topic={t} idx={i} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
