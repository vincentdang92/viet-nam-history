'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useSuKy } from '../../hooks/useSuKy'
import SuKyCard from '../ui/SuKyCard'

export default function SuKyScreen({ onBack }) {
  const { unlocked, total } = useSuKy()

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col max-w-sm mx-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={onBack}
          className="text-tran-textMuted hover:text-tran-text transition-colors"
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

      <div className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
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
    </motion.div>
  )
}
