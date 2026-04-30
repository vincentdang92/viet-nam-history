'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { STAT_META, STAT_KEYS } from '../../constants/gameConfig'
import { trackAdRescueWatched, trackAdRescueSkipped } from '../../lib/analytics'

export default function AdRescueScreen() {
  const { state, dispatch } = useGame()
  const { adRescue, gameOverReason } = state
  if (!adRescue) return null          // guard against null (e.g. stale render)
  const { duration, bonus, triggerStat } = adRescue

  const [showSkipConfirm, setShowSkipConfirm] = useState(false)

  // Determine which stat caused the game over to highlight it
  const targetKey = triggerStat ? triggerStat.split('_')[0] : null

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-5 max-w-sm mx-auto"
      style={{ background: '#110a08' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">⏳</span>
        <h2 className="text-xl font-serif font-bold text-tran-secondary uppercase tracking-wider mb-2">
          Dòng thời gian chao đảo
        </h2>
        <p className="text-tran-textMuted text-xs leading-relaxed max-w-[280px] mx-auto">
          Triều đại của ngài đang đứng bên bờ vực thẳm. Ngài có muốn sử dụng đặc quyền để quay ngược thời gian và cứu vãn tình thế?
        </p>
      </div>

      {/* Rescue info */}
      <div
        className="w-full rounded-xl p-4 mb-6 border"
        style={{ background: 'rgba(30,20,14,0.9)', borderColor: 'rgba(90,48,32,0.5)' }}
      >
        <p className="text-[#FF6B6B] text-sm mb-4 leading-snug font-medium border-b border-[#FF6B6B]/20 pb-3">
          {gameOverReason}
        </p>
        <p className="text-[10px] text-tran-textMuted uppercase tracking-widest mb-3">Hiệu ứng phục hồi</p>
        <div className="space-y-2.5">
          {STAT_KEYS.map(key => {
            const meta = STAT_META[key]
            const before = adRescue.pendingState?.stats?.[key] ?? state.stats[key]
            const after  = adRescue.rescuedStats?.[key] ?? before
            const isTarget = before !== after || key === targetKey

            return (
              <div 
                key={key} 
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${isTarget ? 'bg-white/5' : 'opacity-50'}`}
              >
                <span className="text-base">{meta.icon}</span>
                <span className="text-xs flex-1 truncate font-medium" style={{ color: meta.color }}>
                  {meta.label}
                </span>
                <span className="text-xs tabular-nums text-tran-textMuted">{before}</span>
                {isTarget ? (
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#4CAF50' }}>
                    → {after}
                  </span>
                ) : (
                  <span className="text-xs tabular-nums text-tran-textMuted">
                    → {after}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full space-y-3">
        <motion.button
          onClick={() => {
            trackAdRescueWatched({ duration, bonus })
            dispatch({ type: 'AD_RESCUE_COMPLETE' })
          }}
          className="w-full py-4 rounded-xl font-bold text-sm shadow-lg flex flex-col items-center justify-center gap-1"
          style={{
            background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
            color: '#F5E6D0',
            minHeight: 60,
          }}
          whileTap={{ scale: 0.96 }}
        >
          <span>✓ Khôi Phục Cơ Đồ (Miễn Phí)</span>
          <span className="text-[10px] text-[#F5E6D0]/60 font-normal">Bỏ qua xem Ads - Fun First, Learn Always!</span>
        </motion.button>

        {!showSkipConfirm ? (
          <button
            onClick={() => setShowSkipConfirm(true)}
            className="w-full py-3 text-xs text-tran-textMuted active:text-tran-text transition-colors"
            style={{ minHeight: 44 }}
          >
            Từ chối phục hồi → Nhận lấy Game Over
          </button>
        ) : (
          <motion.div
            className="rounded-xl border border-red-900/40 p-4 space-y-3"
            style={{ background: 'rgba(139,26,26,0.1)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[11px] text-center" style={{ color: 'rgba(255,160,160,0.8)' }}>
              Từ chối sẽ lập tức kết thúc game. Ngài có chắc chắn muốn buông xuôi giang sơn?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-400 active:opacity-70"
                style={{ minHeight: 44 }}
              >
                Hủy, tôi muốn cứu!
              </button>
              <button
                onClick={() => {
                  trackAdRescueSkipped({ remaining: 0 })
                  dispatch({ type: 'AD_RESCUE_SKIP' })
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-red-900/60 text-red-400 active:opacity-70 bg-red-900/20"
                style={{ minHeight: 44 }}
              >
                Kết thúc game
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
