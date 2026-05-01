'use client'

import { motion } from 'framer-motion'
import { getRatingStars } from '../../utils/helpers'

export default function EndingCard({ ending, onRestart, onRestartChapter, onSuKy, onContinue, onResurrect, debugInfo }) {
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

        {debugInfo && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-3 mb-6 text-left">
            <p className="text-red-300 text-xs font-bold mb-1">🛠 DEBUG INFO</p>
            {debugInfo.isGameOver ? (
              <>
                <p className="text-red-200 text-xs">Trạng thái: <strong>Game Over (Chết)</strong></p>
                <p className="text-red-200 text-xs">Nguyên nhân: {debugInfo.reason}</p>
                <p className="text-red-200 text-xs italic mt-1 opacity-80">Lý do hiện Ending: Thỏa mãn điều kiện Good Ending trước khi chết.</p>
              </>
            ) : (
              <p className="text-red-200 text-xs">Trạng thái: <strong>Kết Thúc Chương Bình Thường</strong></p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {onContinue ? (
            <button
              onClick={onContinue}
              className="w-full py-3.5 rounded-xl bg-tran-primary text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
            >
              Tiếp Tục Thời Kỳ Tiếp Theo
            </button>
          ) : (
            <>
              {onRestartChapter && (
                <button
                  onClick={onRestartChapter}
                  className="w-full py-3.5 rounded-xl bg-tran-primary text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
                >
                  Làm Lại Chương Này ↺
                </button>
              )}
              {onResurrect && process.env.NODE_ENV === 'development' && (
                <button
                  onClick={onResurrect}
                  className="w-full py-3 rounded-xl bg-purple-700 text-white text-sm font-medium shadow-lg hover:bg-purple-600 transition-colors"
                >
                  Phục Sinh & Đi Tiếp (Debug)
                </button>
              )}
            </>
          )}

          <div className="flex gap-3 mt-2">
            {!onContinue && (
              <button
                onClick={onRestart}
                className="flex-1 py-3 rounded-xl border border-red-900/40 bg-tran-card text-tran-text text-sm hover:bg-tran-card/80 transition-colors"
              >
                Chơi Lại Từ Đầu
              </button>
            )}
            {onSuKy && (
              <button
                onClick={onSuKy}
                className="flex-1 py-3 rounded-xl bg-tran-secondary/20 border border-tran-secondary/40 text-tran-secondary text-sm hover:bg-tran-secondary/30 transition-colors"
              >
                Xem Sử Ký
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
