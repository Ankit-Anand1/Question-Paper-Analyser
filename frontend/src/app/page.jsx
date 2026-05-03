'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import UploadZone from '@/components/UploadZone'
import TopicList from '@/components/TopicList'
import ChartsContainer from '@/components/Charts'
import Timetable from '@/components/Timetable'
import AIChat from '@/components/AIChat'
import SmartReport from '@/components/SmartReport'
import Profile from '@/components/Profile'
import { useStore } from '@/store/useStore'
import { Target, Brain, Trash2, Star, Zap, Sparkles, MoveRight, Layers, Award, FileText, ChevronRight, BarChart3, Clock, CheckCircle, Menu, X, Sun, Moon } from 'lucide-react'

// Map of components for tabs
const TABS = {
  dashboard: { header: 'Dashboard', El: Dashboard },
  upload: { header: 'Upload Papers', El: UploadZone },
  topics: { header: 'Priority Topic Engine', El: TopicList },
  trends: { header: 'Trend Analysis', El: ChartsContainer },
  predictions: { header: 'AI Predictions', El: null }, // Handled via special card
  report: { header: 'Smart Report', El: SmartReport },
  timetable: { header: 'Study Schedule', El: Timetable },
  chat: { header: 'Study Assistant', El: AIChat },
  profile: { header: 'Account Settings', El: Profile },
}

function LandingPage({ onStart }) {
  const { theme, toggleTheme } = useStore()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden', position: 'relative', color: 'var(--text)' }}>

      {/* ─── Premium Ambient Background ──────── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0, pointerEvents: 'none', background: 'var(--bg)' }}>
        {theme === 'dark' ? (
          <>
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.1) 0%, rgba(139,92,246,0.1) 20%, rgba(3,7,18,0) 60%)', filter: 'blur(60px)' }} />
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: -200, left: -100, width: 800, height: 800, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(100px)' }} />
            <motion.div animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{ position: 'absolute', bottom: -300, right: -100, width: 900, height: 900, background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', filter: 'blur(120px)' }} />
            {/* Grid Pattern */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.2) 0%, rgba(139,92,246,0.15) 30%, rgba(248,250,252,0) 60%)', filter: 'blur(60px)' }} />
            {/* Grid Pattern */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }} />
          </>
        )}
      </div>

      {/* ─── Top Navbar ──────── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 1100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 20, padding: '12px 24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <Brain size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text)' }}>Syllabus<span className="grad-text">IQ</span></h1>
          </div>

          <nav style={{ display: 'none', gap: 32, '@media(minWidth: 768px)': { display: 'flex' } }}>
            {['Features', 'How it Works', 'Pricing', 'FAQs'].map(Item => (
              <a key={Item} href="#" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>{Item}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex', padding: 4 }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onStart} className="btn btn-ghost" style={{ borderRadius: 30, padding: '8px 20px', fontSize: 14 }}>
              Login
            </button>
            <button onClick={onStart} className="btn" style={{ background: 'var(--text)', color: 'var(--bg)', borderRadius: 30, padding: '8px 20px', fontSize: 14 }}>
              Get Started <MoveRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ──────── */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, paddingTop: 160 }}>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 16px', background: 'var(--card)', border: '1px solid var(--indigo-muted)', color: 'var(--indigo)', borderRadius: 30, fontSize: 13, fontWeight: 600, marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
              <Sparkles size={14} style={{ marginRight: 8 }} />
              Welcome to the future of Exam Prep
            </span>

            <h2 style={{ fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 28, letterSpacing: '-2px', color: 'var(--text)' }}>
              Stop Guessing.<br />
              <span className="grad-text" style={{ paddingBottom: 10 }}>
                Study What Matters.
              </span>
            </h2>

            <p style={{ fontSize: 'clamp(17px, 2vw, 21px)', color: 'var(--text2)', maxWidth: 650, margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 400 }}>
              Upload your past college question papers. SyllabusIQ uses advanced AI to instantly spot patterns, rank topics by priority, and predict exactly what will appear in your next exam.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={onStart} className="btn" style={{ background: 'var(--text)', color: 'var(--bg)', padding: '16px 40px', fontSize: 17, borderRadius: 30, fontWeight: 700, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                Start Engine <MoveRight size={18} />
              </button>
              <button className="btn btn-ghost" style={{ padding: '16px 40px', fontSize: 17, borderRadius: 30, background: 'var(--card)' }}>
                View Live Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* ─── Abstract UI Mockup ──────── */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: '90%', maxWidth: 1100, height: 400, margin: '80px auto 100px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px 24px 0 0', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>

          {/* Mockup Header */}
          <div style={{ height: 60, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--red)' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--amber)' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--green)' }} />
            <div style={{ marginLeft: 20, width: 200, height: 16, borderRadius: 8, background: 'var(--bg2)' }} />
          </div>

          {/* Mockup Body Content */}
          <div style={{ padding: 32, display: 'flex', gap: 24, height: '100%' }}>
            {/* Mock Sidebar */}
            <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ height: 28, borderRadius: 8, background: i === 1 ? 'var(--bg2)' : 'transparent', border: i === 1 ? '1px solid var(--border)' : 'none', opacity: i === 1 ? 1 : 0.5 }} />)}
            </div>

            {/* Mock Main Dashboard */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[1, 2, 3].map(i => <div key={i} style={{ height: 100, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--indigo-muted)' }} />
                  <div style={{ width: '60%', height: 12, borderRadius: 6, background: 'var(--border)' }} />
                </div>)}
              </div>
              <div style={{ flex: 1, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', background: 'var(--grad)', opacity: 0.1, filter: 'blur(20px)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '70%', background: 'var(--card)', borderTop: '2px solid var(--cyan)', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
                  <div style={{ width: '40%', height: 12, borderRadius: 6, background: 'var(--text)' }} />
                  <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--border)' }} />
                  <div style={{ width: '80%', height: 8, borderRadius: 4, background: 'var(--border)' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)', pointerEvents: 'none' }} />
        </motion.div>

        {/* ─── Detailed Features Section ──────── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h3 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>Everything you need to top your class.</h3>
            <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 600, margin: '0 auto' }}>SyllabusIQ parses thousands of lines of text from PDFs to deliver crystal clear insights.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {[
              { title: 'AI File Analyzer', desc: 'Drag and drop PDFs of past exam papers. Our OCR + AI engine seamlessly extracts, cleans, and categorizes every single question.', icon: FileText, c: 'var(--cyan)' },
              { title: 'Priority Scoring Engine', desc: 'Not all topics are equal. We calculate a precise 0-100 probability score based on historical frequency and recent 3-year growth trends.', icon: Target, c: 'var(--indigo)' },
              { title: 'Predictive Timetables', desc: 'Tell us your exam date and daily study hours. We generate a day-by-day roadmap pushing high-priority topics first.', icon: Clock, c: 'var(--amber)' },
              { title: 'Visual Trend Graphs', desc: 'See exactly which subjects are rising in importance through interactive Recharts area graphs and deep difficulty breakdowns.', icon: BarChart3, c: 'var(--violet)' },
              { title: 'Interactive Syllabus Tracker', desc: 'Mark topics as "Covered" to see your completion progress bar rise. A psychological boost validating your hard work.', icon: CheckCircle, c: 'var(--green)' },
              { title: 'Personal AI Assistant', desc: 'Chat directly with your exam data. Ask "What should I skip?" or "Give me a revision plan" and get a custom generated response.', icon: Brain, c: 'var(--cyan)' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card card-p" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <f.icon size={24} color={f.c} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{f.title}</h4>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Bottom CTA ──────── */}
        <div style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>Ready to outsmart your exams?</h2>
          <p style={{ fontSize: 18, color: 'var(--text2)', marginBottom: 32 }}>Join thousands of students saving entirely useless study hours.</p>
          <button onClick={onStart} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 17, borderRadius: 30, fontWeight: 700 }}>
            Start Engine Now
          </button>
        </div>
      </main>

      {/* ─── Footer ──────── */}
      <footer style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', background: 'var(--bg)', color: 'var(--text2)', fontSize: 14 }}>
        <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact</span>
        </div>
        <p>© {new Date().getFullYear()} SyllabusIQ. Crafted for excellence.</p>
      </footer>
    </div>
  )
}

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [starred, setStarred] = useState(false)
  const { theme, toggleTheme, hasStarted, setHasStarted, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, topics, profileOpen, setProfileOpen } = useStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme Side Effect
  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  if (!mounted) return <div style={{ background: 'var(--bg)', height: '100vh' }}></div>

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />
  }

  const TabData = TABS[activeTab] || TABS['dashboard']
  const Comp = TabData.El

  const resetAll = async () => {
    if (window.confirm("This will completely wipe all data and reset the dashboard. Are you sure?")) {
      try {
        await fetch('/api/questions', { method: 'DELETE' })
      } catch (e) {}
      localStorage.removeItem('syllabusiq')
      // Aggressively clear Zustand state before reload
      useStore.setState({ questions: [], topics: [], timetable: [], examDate: '', examName: '', smartReport: '', analysisComplete: false, chatMessages: [] })
      window.location.reload()
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? 230 : 60,
        transition: 'margin-left .22s ease',
        display: 'flex', flexDirection: 'column',
        position: 'relative'
      }}>

        {/* Top Navbar */}
        <header style={{ height: 64, borderBottom: '1px solid var(--border)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-ghost mobile-menu-btn"
              style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
              {TabData.header}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleTheme} className="btn-ghost" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setStarred(!starred)} className="btn-ghost" style={{ padding: '8px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600, border: 'none', background: 'transparent' }}>
              <Star size={14} fill={starred ? 'var(--amber)' : 'none'} color={starred ? 'var(--amber)' : 'currentColor'} /> {starred ? 'Starred!' : 'Star'}
            </button>
            {topics.length > 0 && (
              <button onClick={resetAll} style={{ background: 'var(--bg2)', padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border)' }} title="Clear Data">
                <Trash2 size={14} /> Clear
              </button>
            )}
            <img src="https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff" alt="Avatar" onClick={() => setProfileOpen(!profileOpen)} style={{ width: 36, height: 36, borderRadius: '50%', marginLeft: 8, cursor: 'pointer', border: '2px solid var(--border)' }} />
          </div>
        </header>

        {/* Profile Modal */}
        <AnimatePresence>
          {profileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} />
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="card" style={{ position: 'absolute', top: 70, right: 24, width: 300, zIndex: 100, padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <img src="https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff" alt="Avatar" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.2px' }}>Student User</p>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>student@exam.ai</p>
                  </div>
                </div>
                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button className="nav-link" onClick={() => { setActiveTab('profile'); setProfileOpen(false); }} style={{ padding: '10px 12px', borderRadius: 8 }}>Account Settings</button>
                  <button className="nav-link" onClick={toggleTheme} style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', borderRadius: 8 }}>
                    Dark Mode 
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', background: 'var(--bg2)', borderRadius: 6, color: 'var(--text)' }}>{theme === 'dark' ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <button className="nav-link" style={{ color: 'var(--red)', padding: '10px 12px', borderRadius: 8 }} onClick={() => { setHasStarted(false); setProfileOpen(false); }}>Sign Out</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px 32px 64px 32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'upload' ? (
                <UploadZone onDone={() => setActiveTab('topics')} />
              ) : activeTab === 'predictions' ? (
                // Special Predictions view
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                  <div className="card card-p" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: 24, background: 'linear-gradient(180deg, rgba(14,165,233,0.08) 0%, rgba(14,165,233,0.02) 100%)', borderColor: 'rgba(14,165,233,.2)' }}>
                    <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 40px rgba(14,165,233,0.2)' }}>
                      <Brain size={42} color="var(--cyan)" />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>AI Prediction Engine</h2>
                    <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>Our algorithm calculates probability scores based on historical frequency, recent appearances, and 3-year growth trends.</p>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={16} color="var(--indigo)" /> Top Highly Probable Topics
                  </h3>

                  {topics.length === 0 ? (
                    <div className="card card-p" style={{ textAlign: 'center', padding: 40 }}>
                      <p style={{ color: 'var(--muted)' }}>Upload papers to unlock predictions.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {topics.filter(t => t.priority === 'high' || t.trend === 'rising').slice(0, 6).map((t, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={t.id} className="card card-p" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{t.name}</p>
                            <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{t.subject} • {t.frequency} instances</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 22, fontWeight: 900, color: t.priority === 'high' ? 'var(--red)' : 'var(--green)' }}>{t.priorityScore}%</p>
                            <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800, letterSpacing: 0.5 }}>Probability</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                Comp && <Comp onTabChange={setActiveTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
