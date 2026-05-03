'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Upload, Target, BarChart2, Brain,
  Calendar, MessageSquare, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useStore } from '@/store/useStore'

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'upload',      label: 'Upload Papers',    icon: Upload },
  { id: 'topics',      label: 'Priority Topics',  icon: Target },
  { id: 'trends',      label: 'Trend Analysis',   icon: BarChart2 },
  { id: 'predictions', label: 'Predictions',      icon: Brain },
  { id: 'report',      label: 'Smart Report',     icon: BookOpen },
  { id: 'timetable',   label: 'Timetable',        icon: Calendar },
  { id: 'chat',        label: 'AI Assistant',     icon: MessageSquare },
]

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, analysisComplete, profileOpen, setProfileOpen } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const open = sidebarOpen

  return (
    <motion.aside
      animate={{ width: open ? 230 : 60 }}
      transition={{ duration: .22, ease: 'easeInOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40,
        background: 'var(--card)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={() => setSidebarOpen(!open)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, flexShrink: 0, transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--indigo)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
          <Brain size={20} color={open ? 'var(--text)' : 'var(--indigo)'} />
        </button>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 14, fontWeight: 800 }} className="grad-text">SyllabusIQ</p>
            <p style={{ fontSize: 11, color: 'var(--muted)' }}>Exam Intelligence</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {open && <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', padding: '4px 8px 10px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Navigation</p>}
        {NAV.map(({ id, label, icon: Icon }) => {
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={!open ? label : undefined}
              className={`nav-link ${activeTab === id ? 'active' : ''}`}
              style={{
                justifyContent: open ? 'flex-start' : 'center',
                cursor: 'pointer',
                marginBottom: 2,
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {open && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Profile Section & Collapse */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', padding: open ? '16px 14px' : '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div 
          onClick={() => open && setProfileOpen(!profileOpen)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: open ? '8px' : 0, borderRadius: 12, cursor: open ? 'pointer' : 'default', transition: 'background .2s' }}
          onMouseEnter={e => open && (e.currentTarget.style.background = 'var(--bg2)')}
          onMouseLeave={e => open && (e.currentTarget.style.background = 'transparent')}
        >
          <img src="https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff" alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
          {open && (
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Student</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>student@exam.ai</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
