'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Building, Input, Camera, Save, Target } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Profile() {
  const { theme } = useStore()
  const [formData, setFormData] = useState({
    name: 'Student User',
    email: 'student@exam.ai',
    university: 'Stanford University',
    major: 'Computer Science',
    semester: '6th Semester'
  })
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert('Profile updated successfully!')
    }, 800)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      {/* Header Profile Card */}
      <motion.div className="card card-p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(99,102,241,0.1), transparent 50%)', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', border: '4px solid var(--bg)', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}>
          <img src="https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff&size=150" alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--indigo)', color: '#fff', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Camera size={14} />
          </button>
        </div>
        
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{formData.name}</h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', marginTop: 4 }}>{formData.email}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <span className="badge" style={{ background: 'var(--bg2)', color: 'var(--text2)' }}>{formData.major}</span>
            <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green)' }}>Active Student</span>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <motion.div className="card card-p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <User size={18} color="var(--indigo)" /> Personal Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Full Name</label>
            <input className="inp" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'var(--bg2)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Email Address</label>
            <input className="inp" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ background: 'var(--bg2)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>University / College</label>
            <input className="inp" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} style={{ background: 'var(--bg2)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Academic Major</label>
            <input className="inp" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} style={{ background: 'var(--bg2)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Current Semester</label>
            <input className="inp" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} style={{ background: 'var(--bg2)' }} />
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '12px 30px', fontSize: 14 }}>
            {saving ? 'Saving...' : 'Save Changes'} <Save size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
