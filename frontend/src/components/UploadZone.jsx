'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Zap, Sparkles, CheckCircle, Loader2, AlertCircle, BookOpen } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function UploadZone({ onDone }) {
  const [paperFiles, setPaperFiles] = useState([])
  const [syllabusFiles, setSyllabusFiles] = useState([])
  const [status, setStatus] = useState('idle')
  const [msg, setMsg] = useState('')
  const paperRef = useRef(null)
  const syllabusRef = useRef(null)

  const { setQuestions, setTopics, setTrendData, addUploadedFile, setAnalysisComplete, setIsAnalyzing, setRecommendations } = useStore()

  const addPaperFiles = (fileList) => {
    const valid = Array.from(fileList).filter(f => f.name.match(/\.(pdf|txt)$/i))
    setPaperFiles(p => [...p, ...valid])
  }

  const addSyllabusFiles = (fileList) => {
    const valid = Array.from(fileList).filter(f => f.name.match(/\.(pdf|txt)$/i))
    setSyllabusFiles(p => [...p, ...valid])
  }

  const doAnalyze = async (sample = false) => {
    setStatus('loading'); setIsAnalyzing(true)
    setMsg(sample ? 'Loading demo data…' : 'Extracting & AI Analyzing…')

    try {
      if (sample) {
        setTimeout(() => {
          setTopics([
            { id: 1, name: 'Normalization & 3NF', subject: 'DBMS', priority: 'high', frequency: 12, priorityScore: 94, module: 'Module 1: Database Design' },
            { id: 2, name: 'Deadlock Detection', subject: 'OS', priority: 'high', frequency: 9, priorityScore: 88, module: 'Module 3: Process Management' },
            { id: 3, name: 'TCP/IP & Routing', subject: 'CN', priority: 'high', frequency: 7, priorityScore: 82, module: 'Module 2: Network Layer' },
            { id: 4, name: 'B+ Tree Indexing', subject: 'DBMS', priority: 'medium', frequency: 4, priorityScore: 60, module: 'Module 1: Database Design' },
            { id: 5, name: 'Page Replacement', subject: 'OS', priority: 'medium', frequency: 3, priorityScore: 50, module: 'Module 3: Process Management' },
          ])
          setQuestions([
            { text: "Explain 3NF normalization with an example.", subject: "DBMS", frequency: 5 },
            { text: "What is the Dining Philosophers problem and how to solve it?", subject: "OS", frequency: 4 },
            { text: "Difference between TCP and UDP with use cases.", subject: "CN", frequency: 4 },
            { text: "Explain B+ Tree with insertion and deletion.", subject: "DBMS", frequency: 3 },
            { text: "Compare LRU, FIFO and Optimal page replacement.", subject: "OS", frequency: 3 },
          ])
          setRecommendations("### 🔥 AI Study Strategy\n\n1. **DBMS Normalization (Must Do)**: Appears in 12/15 papers. Cover 1NF, 2NF, 3NF, BCNF with examples.\n\n2. **OS Deadlock (Must Do)**: High frequency. Study Banker's Algorithm + Dining Philosophers in depth.\n\n3. **CN TCP/IP (High Priority)**: Cover IP addressing, subnetting, and transport layer protocols.\n\n4. **B+ Tree**: Medium priority — at least 1 question per paper. Practice insertion.\n\n5. **Skip Low Priority**: Virtual memory advanced topics — very rare in papers.")
          setAnalysisComplete(true)
          setStatus('done')
          setMsg('✅ Demo Loaded — Navigate to Dashboard')
          setTimeout(() => onDone?.(), 1500)
          setIsAnalyzing(false)
        }, 1500)
        return
      }

      if (!paperFiles.length) {
        setStatus('error')
        setMsg('Please add at least one Question Paper (PDF/TXT)')
        setIsAnalyzing(false)
        return
      }

      const formData = new FormData()
      paperFiles.forEach(f => formData.append("papers", f))
      syllabusFiles.forEach(f => formData.append("syllabus", f))

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Analysis Failed. Please try again.')

      setQuestions(data.questions || [])
      setTopics(data.topics || [])
      setRecommendations(data.recommendations || "")
      setTrendData(data.trendData || [
        { year: '2022', count: 12 }, { year: '2023', count: 18 },
        { year: '2024', count: data.topics?.length * 2 || 20 }
      ])
      paperFiles.forEach(f => addUploadedFile(f.name))
      setAnalysisComplete(true)
      setStatus('done')
      setMsg('✅ AI Analysis Complete — Check Dashboard')
      setTimeout(() => onDone?.(), 1500)

    } catch (e) {
      console.error(e)
      setStatus('error')
      setMsg(e.message || 'Something went wrong. Please try again.')
    } finally {
      if (!sample) setIsAnalyzing(false)
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Info Banner */}
      <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Sparkles size={20} color="var(--indigo)" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>How it works</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Upload your Question Papers + Syllabus PDF → AI analyzes trends, maps topics to syllabus modules, and generates a study roadmap.</p>
        </div>
      </div>

      {/* Upload Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        {/* Question Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={14} color="var(--indigo)" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Question Papers</span>
          </div>

          <motion.div
            onClick={() => paperRef.current?.click()}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            style={{ border: '2px dashed rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)', borderRadius: 20, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all .2s', minHeight: 160 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
          >
            <input ref={paperRef} type="file" multiple accept=".pdf,.txt" style={{ display: 'none' }} onChange={e => addPaperFiles(e.target.files)} />
            <Upload size={28} color="var(--indigo)" style={{ opacity: 0.7 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Click to upload papers</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>PDF or TXT • Multiple years = better analysis</p>
          </motion.div>

          {paperFiles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {paperFiles.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <FileText size={13} color="var(--indigo)" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button onClick={() => setPaperFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Syllabus */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={14} color="var(--violet)" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Course Syllabus</span>
          </div>

          <motion.div
            onClick={() => syllabusRef.current?.click()}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            style={{ border: '2px dashed rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.04)', borderRadius: 20, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all .2s', minHeight: 160 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.background = 'rgba(139,92,246,0.04)' }}
          >
            <input ref={syllabusRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={e => addSyllabusFiles(e.target.files)} />
            <Sparkles size={28} color="var(--violet)" style={{ opacity: 0.7 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Click to upload syllabus</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Helps AI categorize by module & subject</p>
          </motion.div>

          {syllabusFiles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {syllabusFiles.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12 }}>
                  <CheckCircle size={13} color="var(--green)" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓ Ready</span>
                  <button onClick={() => setSyllabusFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {syllabusFiles.length === 0 && (
            <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>⚡ Optional but Recommended</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Upload your university syllabus so AI can map questions to exact modules</p>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 14, fontSize: 14, fontWeight: 600,
              background: status === 'done' ? 'rgba(16,185,129,0.1)' : status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${status === 'done' ? 'rgba(16,185,129,0.3)' : status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
              color: status === 'done' ? 'var(--green)' : status === 'error' ? 'var(--red)' : 'var(--indigo)'
            }}>
            {status === 'loading' && <Loader2 size={16} className="spin-anim" />}
            {status === 'done' && <CheckCircle size={16} />}
            {status === 'error' && <AlertCircle size={16} />}
            <span>{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className="btn btn-primary"
          onClick={() => doAnalyze(false)}
          disabled={status === 'loading'}
          style={{ flex: 1, height: 52, fontSize: 15, borderRadius: 14 }}
        >
          {status === 'loading'
            ? <><Loader2 size={18} className="spin-anim" /> Analyzing…</>
            : <><Zap size={18} /> Analyze Papers</>
          }
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => doAnalyze(true)}
          disabled={status === 'loading'}
          style={{ height: 52, padding: '0 24px', borderRadius: 14, whiteSpace: 'nowrap' }}
        >
          <Sparkles size={16} /> Load Demo
        </button>
      </div>
    </div>
  )
}
