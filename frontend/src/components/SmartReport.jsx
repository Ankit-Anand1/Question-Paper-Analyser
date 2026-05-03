'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertTriangle, Sparkles, Download, Copy, Share } from 'lucide-react'
import { useStore } from '@/store/useStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function SmartReport() {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { questions, smartReport, setSmartReport, recommendations } = useStore()

  useEffect(() => {
    // If questions exist but the report hasn't been generated yet, fetch it.
    if (questions.length > 0 && !smartReport && !loading) {
      setLoading(true)
      fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions })
      })
        .then(res => res.json())
        .then(data => {
          setSmartReport(data.report)
          setLoading(false)
        })
        .catch(err => {
          setSmartReport("Failed to generate report. Please try again.")
          setLoading(false)
        })
    }
  }, [questions, smartReport, setSmartReport, loading])

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(smartReport)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Failed to copy', e)
    }
  }

  const downloadPDF = async () => {
    try {
      const element = document.getElementById("report-pdf-target")
      if (!element) return
      
      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: 0.5,
        filename: 'Exam-Strategy-Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
    } catch (e) {
      console.error('Failed to generate PDF', e)
    }
  }

  if (questions.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 0' }}>
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <AlertTriangle size={28} className="text-slate-400" />
        </div>
        <p className="text-[15px] text-slate-800 font-bold">No Analysis Data Found</p>
        <p className="text-[13px] text-slate-500">Upload your question papers first to generate the Report.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-32">
      
      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>AI Master Strategy</h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', mt: 4 }}>Complete tactical breakdown from syllabus trends.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={copyReport} disabled={loading || !smartReport} className="btn btn-ghost" style={{ padding: '10px 20px' }}>
              {copied ? <Sparkles size={16} color="var(--green)" /> : <Copy size={16} />} 
              {copied ? "Copied" : "Copy Content"}
            </button>
            <button onClick={downloadPDF} disabled={loading || !smartReport} className="btn btn-primary">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Container */}
      <AnimatePresence mode="wait">
        {(loading || !smartReport) ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-base font-bold text-slate-800">Drafting Intelligent Strategy...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="report"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            id="report-pdf-target"
            className="card card-p"
            style={{ marginBottom: 60, overflow: 'hidden' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({node, ...props}) => (
                  <h1 style={{ fontSize: 28, fontWeight: 900, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }} {...props} />
                ),
                h2: ({node, ...props}) => (
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 40, marginBottom: 16 }} {...props} />
                ),
                h3: ({node, ...props}) => (
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginTop: 32, marginBottom: 12 }} {...props} />
                ),
                p: ({node, ...props}) => (
                  <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }} {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul style={{ paddingLeft: 24, color: 'var(--text2)', marginBottom: 24, listStyleType: 'square' }} {...props} />
                ),
                li: ({node, ...props}) => (
                  <li style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 8, lineHeight: 1.6 }} {...props} />
                ),
                table: ({node, ...props}) => (
                  <div style={{ overflowX: 'auto', width: '100%', margin: '24px 0', border: '1px solid var(--border)', borderRadius: 16 }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }} {...props} />
                  </div>
                ),
                th: ({node, ...props}) => (
                  <th style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '12px 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }} {...props} />
                ),
                td: ({node, ...props}) => (
                  <td style={{ borderBottom: '1px solid var(--border)', padding: '12px 16px', fontSize: 15, color: 'var(--text2)' }} {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong style={{ color: 'var(--text)', fontWeight: 800 }} {...props} />
                ),
                a: ({node, ...props}) => (
                  <a style={{ color: 'var(--cyan)', fontWeight: 700, textDecoration: 'none' }} target="_blank" rel="noreferrer" {...props} />
                ),
              }}
            >
              {smartReport}
            </ReactMarkdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
