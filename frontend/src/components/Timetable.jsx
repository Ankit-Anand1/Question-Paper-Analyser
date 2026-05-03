'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, Target, Calendar as CalendarIcon, Clock, ChevronRight, Zap, RotateCcw, AlertTriangle, ChevronLeft, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'

function generateTimetableLogic(topics, examDate, dailyHrs) {
  const exam = new Date(examDate)
  const today = new Date()
  const days = Math.max(1, Math.ceil((exam - today) / 86400000))

  const prio = [...topics].sort((a, b) => b.priorityScore - a.priorityScore)
  const res = []
  let tidx = 0

  for (let i = 0; i < Math.min(days, 45); i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)

    const dayTop = []
    const tPerDay = Math.floor(dailyHrs / 2)
    for (let j = 0; j < tPerDay && tidx < prio.length; j++) {
      dayTop.push({ name: prio[tidx].name, subject: prio[tidx].subject })
      tidx++
    }
    if (tidx >= prio.length) tidx = 0

    res.push({
      date: d.toISOString().split('T')[0],
      topics: dayTop,
      hours: dailyHrs,
      completed: false
    })
  }
  return res
}

export default function Timetable() {
  const { topics, timetable, setTimetable, examDate, setExamDate, getDaysLeft, toggleDayDone } = useStore()
  const [hrs, setHrs] = useState(6)
  const [calOpen, setCalOpen] = useState(false)
  const [currMonth, setCurrMonth] = useState(new Date())

  const formatDate = (dStr) => {
    if (!dStr) return 'Select Date'
    return new Date(dStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay()

  const renderCal = () => {
    const y = currMonth.getFullYear()
    const m = currMonth.getMonth()
    const days = getDaysInMonth(y, m)
    const firstDay = getFirstDay(y, m)
    const today = new Date()
    today.setHours(0,0,0,0)

    const grid = []
    for (let i = 0; i < firstDay; i++) grid.push(<div key={`e-${i}`} />)
    
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d)
      const isPast = dt < today
      const isSel = examDate === dt.toISOString().split('T')[0]
      grid.push(
        <button 
          key={d} 
          disabled={isPast}
          onClick={() => { setExamDate(dt.toISOString().split('T')[0]); setCalOpen(false) }}
          style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: isSel ? 'var(--indigo)' : 'transparent', color: isSel ? '#fff' : isPast ? 'var(--muted)' : 'var(--text)', cursor: isPast ? 'not-allowed' : 'pointer', border: 'none', transition: 'all .2s' }}
          onMouseEnter={e => !isPast && !isSel && (e.currentTarget.style.background = 'var(--bg2)')}
          onMouseLeave={e => !isPast && !isSel && (e.currentTarget.style.background = 'transparent')}
        >
          {d}
        </button>
      )
    }
    return grid
  }

  const hasPlan = timetable.length > 0
  const daysLeft = getDaysLeft()
  const hasTopics = topics.length > 0

  const generate = () => {
    if (!examDate || !topics.length) return
    const plan = generateTimetableLogic(topics, examDate, hrs)
    setTimetable(plan)
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 100 }}>
      {/* Configuration Card */}
      <motion.div className="card card-p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--indigo-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} color="var(--indigo)" />
          </div>
          Study Plan Configuration
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Target Exam Date</label>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setCalOpen(!calOpen)}
                className="inp"
                style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', cursor: 'pointer', color: examDate ? 'var(--text)' : 'var(--muted)', fontWeight: 700 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarIcon size={16} /> {formatDate(examDate)}
                </div>
                <ChevronDown size={16} style={{ color: 'var(--muted)' }} />
              </button>

              <AnimatePresence>
                {calOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .15 }}
                    style={{ position: 'absolute', top: 50, left: 0, width: 280, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, zIndex: 50, boxShadow: 'var(--shadow-lg)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <button onClick={() => setCurrMonth(new Date(currMonth.setMonth(currMonth.getMonth() - 1)))} style={{ background: 'var(--bg2)', border: 'none', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={16} color="var(--text)" /></button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {currMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={() => setCurrMonth(new Date(currMonth.setMonth(currMonth.getMonth() + 1)))} style={{ background: 'var(--bg2)', border: 'none', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={16} color="var(--text)" /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 8 }}>
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>{d}</span>)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, justifyItems: 'center' }}>
                      {renderCal()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>Daily Study Capacity</label>
              <span className="badge badge-info">{hrs} Hours</span>
            </div>
            <div style={{ paddingTop: 8 }}>
              <input 
                type="range" min={2} max={14} value={hrs} 
                onChange={e => setHrs(+e.target.value)} 
                style={{ width: '100%', accentColor: 'var(--indigo)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
                <span>Light (2h)</span>
                <span>Intense (14h)</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 24, gap: 16 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {examDate && (
              <>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <CalendarIcon size={12}/> Days Left
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{daysLeft}</span>
                </div>
                <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <Clock size={12}/> Total Prep
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--indigo)' }}>{daysLeft * hrs} Hrs</span>
                </div>
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {hasPlan && (
              <button onClick={() => setTimetable([])} className="btn btn-ghost" style={{ padding: '10px 20px' }}>
                <RotateCcw size={16} /> Reset
              </button>
            )}
            <button 
              onClick={generate} 
              disabled={!examDate || !hasTopics}
              className={`btn btn-primary ${(!examDate || !hasTopics) ? 'disabled' : ''}`}
            >
              <Zap size={16} /> 
              {hasPlan ? 'Regenerate Plan' : 'Generate Plan'}
            </button>
          </div>
        </div>
        
        {!hasTopics && (
          <div style={{ marginTop: 20, padding: 12, borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>
            <AlertTriangle size={16} />
            <span>AI needs extracted topics from your past papers before generating a schedule.</span>
          </div>
        )}
      </motion.div>

      {/* Plan Display */}
      {hasPlan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Progress Bar */}
          <div className="card card-p" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={22} color="var(--green)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Mastery Progress</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>
                  {Math.round((timetable.filter(t => t.completed).length / timetable.length) * 100) || 0}% Complete
                </span>
              </div>
              <div className="prog-bar" style={{ height: 6 }}>
                <motion.div 
                  className="prog-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(timetable.filter(t => t.completed).length / timetable.length) * 100}%` }} 
                  style={{ background: 'var(--green)' }}
                />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {timetable.map((day, i) => {
              const d = new Date(day.date)
              const today = new Date().toDateString() === d.toDateString()
              const past = d < new Date() && !today
              
              let cardStyle = { background: 'var(--card)', border: '1px solid var(--border)', opacity: past ? 0.6 : 1 }
              let dateColor = 'var(--text)'
              let iconColor = 'var(--border-hover)'

              if (day.completed) {
                cardStyle.background = 'rgba(16, 185, 129, 0.05)'
                cardStyle.borderColor = 'rgba(16, 185, 129, 0.2)'
                dateColor = 'var(--green)'
                iconColor = 'var(--green)'
              } else if (today) {
                cardStyle.background = 'var(--bg2)'
                cardStyle.borderColor = 'var(--indigo)'
                dateColor = 'var(--indigo)'
                iconColor = 'var(--indigo)'
                cardStyle.boxShadow = 'var(--shadow-md)'
              }

              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * .02, .5) }}
                  onClick={() => toggleDayDone(i)}
                  className="card"
                  style={{ ...cardStyle, padding: 20, cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: dateColor, marginBottom: 4 }}>
                        {today ? '📅 TODAY' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={12}/> {day.hours}h Focus Block
                      </p>
                    </div>
                    {day.completed ? (
                      <CheckCircle size={22} color={iconColor} strokeWidth={2.5} />
                    ) : (
                      <Circle size={22} color={iconColor} />
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {day.topics.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, opacity: day.completed ? 0.5 : 1 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, textDecoration: day.completed ? 'line-through' : 'none' }}>
                          {t.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
