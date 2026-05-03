import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Data ───────────────────────────────────────────────────────────
      questions: [],
      topics: [],
      trendData: [],
      uploadedFiles: [],
      syllabusText: '',
      recommendations: '',
      smartReport: '',
      analysisComplete: false,

      setQuestions: (q) => set({ questions: q }),
      setTopics: (t) => set({ topics: t }),
      setTrendData: (d) => set({ trendData: d }),
      addUploadedFile: (name) => set((s) => ({ uploadedFiles: [...s.uploadedFiles, name] })),
      setSyllabusText: (t) => set({ syllabusText: t }),
      setRecommendations: (r) => set({ recommendations: r }),
      setSmartReport: (r) => set({ smartReport: r }),
      setAnalysisComplete: (v) => set({ analysisComplete: v }),

      // ─── Progress ────────────────────────────────────────────────────────
      toggleCovered: (id) =>
        set((s) => ({
          topics: s.topics.map((t) => (t.id === id ? { ...t, covered: !t.covered } : t)),
        })),

      // ─── Chat ─────────────────────────────────────────────────────────────
      chatMessages: [],
      addMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      // ─── Timetable ────────────────────────────────────────────────────────
      timetable: [],
      setTimetable: (t) => set({ timetable: t }),
      toggleDayDone: (idx) =>
        set((s) => ({
          timetable: s.timetable.map((d, i) => (i === idx ? { ...d, completed: !d.completed } : d)),
        })),

      // ─── User / Exam ──────────────────────────────────────────────────────
      examDate: '',
      examName: '',
      setExamDate: (d) => set({ examDate: d }),
      setExamName: (n) => set({ examName: n }),

      // ─── UI ───────────────────────────────────────────────────────────────
      theme: 'dark', // 'light' or 'dark'
      hasStarted: false,
      activeTab: 'dashboard',
      sidebarOpen: true,
      isAnalyzing: false,
      profileOpen: false,

      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setHasStarted: (v) => set({ hasStarted: v }),
      setActiveTab: (t) => set({ activeTab: t }),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setProfileOpen: (v) => set({ profileOpen: v }),

      // ─── Helpers ─────────────────────────────────────────────────────────
      getHighPriority: () => get().topics.filter((t) => t.priority === 'high'),
      getCoveredPct: () => {
        const { topics } = get()
        if (!topics.length) return 0
        return Math.round((topics.filter((t) => t.covered).length / topics.length) * 100)
      },
      getDaysLeft: () => {
        const { examDate } = get()
        if (!examDate) return null
        const diff = new Date(examDate) - new Date()
        return Math.max(0, Math.ceil(diff / 86400000))
      },
    }),
    {
      name: 'syllabusiq',
      partialize: (s) => ({
        theme: s.theme,
        hasStarted: s.hasStarted,
        questions: s.questions,
        topics: s.topics,
        trendData: s.trendData,
        uploadedFiles: s.uploadedFiles,
        syllabusText: s.syllabusText,
        recommendations: s.recommendations,
        analysisComplete: s.analysisComplete,
        chatMessages: s.chatMessages,
        timetable: s.timetable,
        examDate: s.examDate,
        sidebarOpen: s.sidebarOpen,
        isAnalyzing: s.isAnalyzing,
      }),
    }
  )
)
