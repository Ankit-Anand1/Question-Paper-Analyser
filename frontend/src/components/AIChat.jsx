'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Target, Loader2, Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const PROMPTS = [
  "What should I study today?",
  "Which topics are most important?",
  "What topics can I skip?",
  "Predict exam topics",
  "Give me a study strategy",
]

export default function AIChat() {
  const { chatMessages, addMessage, topics, recommendations } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  const send = async (txt = input) => {
    if (!txt.trim() || loading) return
    setInput('')
    
    addMessage({ id: Date.now(), role: 'user', content: txt })
    setLoading(true)

    try {
      const res = await fetch(`/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: txt, topics, recommendations })
      })
      const data = await res.json()
      addMessage({ id: Date.now()+1, role: 'ai', content: data.answer || "I couldn't generate a response. Please try again." })
    } catch (e) {
      addMessage({ id: Date.now()+1, role: 'ai', content: "Network error! Please check your connection." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: 500 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={18} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>SyllabusIQ Assistant</p>
          <p style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display:'inline-block' }} /> AI-Powered • Backend Secured
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {chatMessages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 320 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Sparkles size={28} color="var(--indigo)" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Ask about your exams</p>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6 }}>
              I have context about your uploaded papers. Ask me anything about study strategy, topic priorities, or what to skip.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ padding: '10px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, color: 'var(--text2)', cursor: 'pointer', transition: 'all .2s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--indigo)'; e.currentTarget.style.background = 'var(--bg2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: m.role === 'user' ? 'rgba(99,102,241,.18)' : 'var(--card)', border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,.3)' : 'var(--border)'}` }}>
              {m.role === 'user' ? <User size={13} color="var(--indigo)" /> : <Bot size={13} color="var(--text2)" />}
            </div>
            <div className={`bubble-${m.role}`} style={{ padding: '12px 16px', maxWidth: '85%', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', ...(m.role === 'ai' ? {background: 'transparent', border: 'none', padding: 0} : {}) }}>
              {m.role === 'ai' ? (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({node, ...props}) => <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12, marginTop: 0 }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: 'var(--text)', fontWeight: 800 }} {...props} />,
                      li: ({node, ...props}) => <li style={{ fontSize: 14, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5, display: 'flex', gap: 8 }}><span style={{color:'var(--green)'}}>•</span> <div>{props.children}</div></li>,
                      ul: ({node, ...props}) => <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 12px 0' }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ paddingLeft: 16, margin: '0 0 12px 0', color: 'var(--text)' }} {...props} />,
                      h1: ({node, ...props}) => <div style={{display:'none'}} />,
                      h2: ({node, ...props}) => <div style={{display:'none'}} />,
                      h3: ({node, ...props}) => <div style={{display:'none'}} />,
                      h4: ({node, ...props}) => <div style={{display:'none'}} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Bot size={13} color="var(--text2)" />
            </div>
            <div className="bubble-ai" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={14} className="spin-anim" color="var(--indigo)" />
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts when in conversation */}
      {chatMessages.length > 0 && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 20px', overflowX: 'auto', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          {PROMPTS.slice(0,3).map(p => (
            <button key={p} onClick={() => send(p)}
              style={{ whiteSpace: 'nowrap', padding: '8px 14px', background: 'var(--bg2)', border: '1px solid transparent', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--card-hover)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'transparent' }}
            >{p}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          className="inp"
          placeholder="Ask about topics, study plans, predictions..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={() => send()} disabled={!input.trim() || loading} style={{ padding: '0 18px', flexShrink: 0 }}>
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
