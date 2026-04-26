'use client'

import { motion } from 'framer-motion'
import { getRatingStars } from '../../utils/helpers'

export default function EndingCard({ ending, onRestart, onSuKy }) {
  if (!ending) return null

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👑</div>
          <div className="text-tran-secondary text-2xl mb-1">
            {getRatingStars(ending.rating)}
          </div>
          <h1 className="text-tran-text font-serif text-2xl font-bold mt-3">
            {ending.title}
          </h1>
          <p className="text-tran-secondary text-sm mt-1 italic">{ending.subtitle}</p>
        </div>

        <div className="bg-tran-card border border-tran-border rounded-2xl p-4 mb-4">
          <p className="text-tran-text text-sm leading-relaxed">{ending.description}</p>
        </div>

        <div className="bg-tran-card border border-yellow-900/40 rounded-xl p-3 mb-6">
          <div className="flex gap-2">
            <span className="text-yellow-500">📜</span>
            <p className="text-tran-textMuted text-xs leading-relaxed">
              {ending.historicalNote}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl border border-tran-border text-tran-text text-sm hover:bg-tran-card transition-colors"
          >
            Chơi Lại
          </button>
          {onSuKy && (
            <button
              onClick={onSuKy}
              className="flex-1 py-3 rounded-xl bg-tran-secondary/20 border border-tran-secondary/40 text-tran-secondary text-sm hover:bg-tran-secondary/30 transition-colors"
            >
              Xem Sử Ký
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
