'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { FileText, Target, TrendingUp, Clock, Upload, Sparkles, BarChart2, CheckCircle, MessageSquare, PlayCircle, BookOpen, Layers } from 'lucide-react'
import { SubjectDistribution, DifficultyChart } from './Charts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  // Use a softer variation of the provided color mapping to build native beautiful gradients
  const glowHex = color.includes('indigo') ? '99,102,241' : color.includes('violet') ? '139,92,246' : color.includes('red') ? '239,68,68' : '16,185,129'

  return (
    <motion.div className="card card-p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', transition: 'transform .2s' }}
      whileHover={{ y: -4, boxShadow: `0 10px 40px rgba(${glowHex}, 0.15)` }}
    >
      <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '150%', height: '150%', background: `radial-gradient(circle at top right, rgba(${glowHex}, 0.1) 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '100%', height: '100%', background: `radial-gradient(circle at bottom left, rgba(${glowHex}, 0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${glowHex}, 0.1)`, border: `1px solid rgba(${glowHex}, 0.2)`, boxShadow: `0 4px 14px rgba(${glowHex}, 0.2)` }}>
          <Icon size={20} color={color} />
        </div>
        {sub && <span className="badge" style={{ background: `rgba(${glowHex}, 0.1)`, color: color, pointerEvents: 'none', border: `1px solid rgba(${glowHex}, 0.2)` }}>{sub}</span>}
      </div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-1px' }}>{value}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', marginTop: 8 }}>{label}</p>
      </div>
    </motion.div>
  )
}

function Countdown() {
  const { examDate, examName, setExamDate } = useStore()
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!examDate || !running) return
    const tick = () => {
      const diff = new Date(examDate) - new Date()
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [examDate, running])

  if (!examDate) return null

  return (
    <motion.div className="card card-p" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden'
      }}>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--bg2)', padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)' }}>
              <Clock size={16} color="var(--indigo)" />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{examName || 'Upcoming Exam'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setRunning(!running)} style={{ background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--indigo)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
              {running ? 'Stop Countdown' : 'Resume'}
            </button>
            <button onClick={() => setExamDate(null)} style={{ background: 'transparent', color: 'var(--muted)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }} onMouseEnter={e=>(e.currentTarget.style.color='var(--red)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--muted)')}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {[['DAYS', time.days], ['HOURS', time.hours], ['MINUTES', time.mins], ['SECONDS', time.secs]].map(([label, val]) => (
            <div key={label} style={{ flex: 1, background: 'var(--bg2)', borderRadius: 16, padding: '20px 10px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 900, lineHeight: 1, color: 'var(--text)', letterSpacing: '-1px' }}>{String(val).padStart(2, '0')}</h2>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginTop: 8, letterSpacing: 1 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function RecommendationCard({ topic, rank }) {
  const colors = ['var(--red)', 'var(--amber)', 'var(--indigo)']
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: rank * .07 }}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 12, transition: 'transform 0.2s, background 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.background = 'var(--card)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'var(--bg2)' }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: `${colors[Math.min(rank, 2)]}15`, border: `1px solid ${colors[Math.min(rank, 2)]}25` }}>
        <Target size={20} color={colors[Math.min(rank, 2)]} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic.name}</p>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{topic.subject}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span className={`badge badge-${topic.priority}`}>{topic.priority}</span>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontWeight: 600 }}>{topic.frequency}x asked</p>
      </div>
    </motion.div>
  )
}

export default function Dashboard({ onTabChange }) {
  const { questions, setQuestions, topics, setTopics, examDate, setExamDate, setExamName, examName, getCoveredPct, setActiveTab, recommendations } = useStore()
  const [localExam, setLocalExam] = useState(examName)
  const [localDate, setLocalDate] = useState(examDate || new Date().toISOString().split('T')[0])

  useEffect(() => {
    // Only fetch from DB if no data is already in the store (fresh page load)
    // Don't overwrite demo data that was just loaded
    if (topics.length === 0) {
      fetch('/api/questions')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.questions?.length > 0) {
            setQuestions(data.questions);
          }
        }).catch(() => { });
    }
  }, []) // intentionally empty deps — only run once on mount


  const highPriority = topics.filter(t => t.priority === 'high').length > 0
    ? topics.filter(t => t.priority === 'high')
    : [...topics].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))

  const coveredPct = getCoveredPct()

  const saveExam = () => { setExamName(localExam); setExamDate(localDate) }

  // Dummy trend data since MongoDB schema lacks historical tracking right now
  const miniChartData = [
    { name: '2019', val: 12 }, { name: '2020', val: 19 }, { name: '2021', val: 15 },
    { name: '2022', val: 28 }, { name: '2023', val: 22 }, { name: '2024', val: topics.length * 4 }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* ── Top Countdown or Exam Setup ── */}
      {examDate ? <Countdown /> : (
        <motion.div className="card card-p" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,165,233,0.05) 100%)',
            borderColor: 'rgba(99,102,241,0.2)', display: 'flex', flexDirection: 'column', gap: 20
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <Clock size={24} color="var(--indigo)" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Set Target Exam Date</p>
              <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Add your exam details to enable the predictive timetable.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', backgroundColor: 'var(--card)', padding: 20, borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Exam Name</label>
              <input className="inp" placeholder="e.g. Midterms, Final Exam" value={localExam} onChange={e => setLocalExam(e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Calendar Date</label>
              <input className="inp" type="date" value={localDate} onChange={e => setLocalDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', minWidth: 140 }}>
              <button className="btn btn-primary" onClick={saveExam} style={{ height: 46, width: '100%' }}>Proceed</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <StatCard icon={FileText} label="Questions Analyzed" value={questions.length || '—'} color="var(--indigo)" delay={0} />
        <StatCard icon={Layers} label="Topics Identified" value={topics.length || '—'} color="var(--violet)" delay={.05} />
        <StatCard icon={TrendingUp} label="High Priority" value={highPriority.length || '—'} color="var(--red)" sub="CRITICAL" delay={.1} />
        <StatCard icon={CheckCircle} label="Syllabus Progress" value={`${coveredPct}%`} color="var(--green)" delay={.15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>

        {/* ── Syllabus Progress & Charts ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen size={18} color="var(--indigo)" /> Content Mastery
              </h3>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--indigo)', background: 'var(--indigo-muted)', padding: '4px 10px', borderRadius: 8 }}>{coveredPct}%</span>
            </div>

            <div className="prog-bar" style={{ height: 12, borderRadius: 6 }}>
              <motion.div className="prog-fill" initial={{ width: 0 }} animate={{ width: `${coveredPct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
              {topics.filter(t => t.covered).length} of {topics.length} core topics marked complete
            </p>
          </motion.div>

          <SubjectDistribution delay={0.25} />
        </div>

        {/* ── Top Recommendations & Difficulty ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* AI Recommendations */}
            <motion.div className="card card-p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'var(--card)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Sparkles size={16} color="var(--green)" />
                </div>
                AI Study Strategy Extract
              </h3>
              <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8 }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({node, ...props}) => <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }} {...props} />,
                    strong: ({node, ...props}) => <strong style={{ color: 'var(--text)', fontWeight: 800 }} {...props} />,
                    li: ({node, ...props}) => <li style={{ fontSize: 14, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5, display: 'flex', gap: 8 }}><span style={{color:'var(--green)'}}>•</span> <span>{props.children}</span></li>,
                    ul: ({node, ...props}) => <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }} {...props} />,
                    h1: ({node, ...props}) => <div style={{display:'none'}} />,
                    h2: ({node, ...props}) => <div style={{display:'none'}} />,
                    h3: ({node, ...props}) => <div style={{display:'none'}} />,
                    h4: ({node, ...props}) => <div style={{display:'none'}} />,
                  }}
                >
                  {recommendations}
                </ReactMarkdown>
              </div>
            </motion.div>

          <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Target size={18} color="var(--cyan)" /> Priority Study Focus
              </h3>
              <button onClick={() => setActiveTab('topics')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo)', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {highPriority.length > 0
                ? highPriority.slice(0, 4).map((t, i) => <RecommendationCard key={t.id} topic={t} rank={i} />)
                : <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={28} color="var(--muted)" />
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>Upload papers to unlock insights</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('upload')}>Go to Upload</button>
                </div>
              }
            </div>
          </motion.div>

          <DifficultyChart delay={0.35} />
        </div>

      </div>

      {/* ── Repeated Questions Section ── */}
      {questions.length > 0 && (
        <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Layers size={18} color="var(--violet)" /> Frequently Repeated Questions
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {questions.slice(0, 6).map((q, i) => (
              <div key={i} style={{ padding: 16, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, lineHeight: 1.5, flex: 1, marginRight: 12 }}>{q.text}</p>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="badge badge-high" style={{ fontSize: 10 }}>{q.frequency}x Asked</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── YouTube / Study Resources Section ── */}
      <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <PlayCircle size={18} color="var(--indigo)" /> Recommended Video Lectures
          </h3>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Click any card to watch on YouTube</span>
        </div>

        {highPriority.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Upload an exam to see personalized lecture recommendations.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {highPriority.slice(0, 4).map((topic, index) => {
              const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.name + ' ' + topic.subject + ' lecture explained')}`
              return (
                <a key={index} href={ytUrl} target="_blank" rel="noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--card)', transition: 'all .2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'radial-gradient(circle at center, rgba(99,102,241,0.15), rgba(14,165,233,0.1))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99,102,241,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                      <PlayCircle size={24} color="#fff" />
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <span className="badge badge-high" style={{ fontSize: 10, background: 'var(--bg2)' }}>{topic.frequency}× asked</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{topic.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text2)' }}>{topic.subject} • {topic.module || 'Priority Topic'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: 'var(--indigo)', fontSize: 12, fontWeight: 700 }}>
                      <PlayCircle size={13} />
                      Watch on YouTube
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </motion.div>


    </div>
  )
}
