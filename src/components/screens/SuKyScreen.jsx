'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSuKy } from '../../hooks/useSuKy'
import SuKyCard from '../ui/SuKyCard'
import TimelineView from '../ui/TimelineView'

export default function SuKyScreen({ onBack }) {
  const { unlocked, total } = useSuKy()
  const [tab, setTab] = useState('suky')

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-tran-bg flex flex-col w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-3 shrink-0">
        <button
          onClick={onBack}
          className="text-tran-textMuted"
          style={{ minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center' }}
        >
          ← Quay lại
        </button>
        <div className="flex-1">
          <h1 className="text-tran-text font-serif font-bold text-lg">Sử Ký</h1>
          <p className="text-tran-textMuted text-xs">
            {unlocked.length}/{total} mục đã mở khóa
          </p>
        </div>
        <span className="text-2xl">📖</span>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-1 pb-3 shrink-0">
        <button
          onClick={() => setTab('suky')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'suky'
              ? 'bg-tran-secondary text-tran-bg'
              : 'bg-tran-card text-tran-textMuted border border-tran-border'
          }`}
          style={{ minHeight: 44 }}
        >
          Sử Ký
        </button>
        <button
          onClick={() => setTab('timeline')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'timeline'
              ? 'bg-tran-secondary text-tran-bg'
              : 'bg-tran-card text-tran-textMuted border border-tran-border'
          }`}
          style={{ minHeight: 44 }}
        >
          Niên Biểu
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'suky' ? (
          <div className="px-4 pb-6 space-y-2">
            {unlocked.length === 0 ? (
              <div className="text-center py-12 text-tran-textMuted">
                <p className="text-4xl mb-3">📜</p>
                <p className="text-sm">Chưa có mục nào được mở khóa.</p>
                <p className="text-xs mt-1">Chơi game để khám phá lịch sử!</p>
              </div>
            ) : (
              unlocked.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <SuKyCard entry={entry} />
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <TimelineView />
        )}
      </div>
    </motion.div>
  )
}
