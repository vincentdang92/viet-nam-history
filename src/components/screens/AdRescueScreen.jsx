'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { STAT_META, STAT_KEYS } from '../../constants/gameConfig'
import { trackAdRescueWatched, trackAdRescueSkipped } from '../../lib/analytics'

const AD_FRAMES = ['🏰', '⚔️', '🐉', '🎖️', '🗺️']

export default function AdRescueScreen() {
  const { state, dispatch } = useGame()
  const { adRescue, gameOverReason } = state
  if (!adRescue) return null          // guard against null (e.g. stale render)
  const { duration, bonus } = adRescue

  const [remaining, setRemaining] = useState(duration)
  const [frameIdx, setFrameIdx] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setCompleted(true)
          return 0
        }
        return r - 1
      })
      setFrameIdx(i => (i + 1) % AD_FRAMES.length)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const progress = ((duration - remaining) / duration) * 100

  return (
    <motion.div
      className="min-h-screen bg-black flex flex-col items-center justify-center p-5 max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top bar — ad label + countdown */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Quảng Cáo</span>
          {!completed ? (
            <span className="text-[10px] text-gray-500">{remaining}s</span>
          ) : (
            <motion.span
              className="text-[10px] text-green-400 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Xong!
            </motion.span>
          )}
        </div>
        <div className="w-full h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gray-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Fake ad "video" */}
      <div
        className="w-full rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          aspectRatio: '16/9',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)',
          }}
        />
        <motion.div
          className="text-center select-none"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-6xl mb-2">{AD_FRAMES[frameIdx]}</div>
          <p className="text-white/60 text-xs">Minh Chủ — Game Lịch Sử</p>
          <p className="text-white/30 text-[10px] mt-0.5">Phiên bản giới hạn</p>
        </motion.div>
        <div className="absolute bottom-2 right-2 text-white/30 text-xs">🔇</div>
      </div>

      {/* Rescue info — show ALL 4 stats */}
      <div
        className="w-full rounded-xl p-4 mb-4 border"
        style={{ background: 'rgba(30,20,14,0.9)', borderColor: 'rgba(90,48,32,0.5)' }}
      >
        <p className="text-gray-400 text-xs mb-3 leading-snug">{gameOverReason}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Phục hồi tất cả chỉ số</p>
        <div className="grid grid-cols-2 gap-2">
          {STAT_KEYS.map(key => {
            const meta = STAT_META[key]
            const before = adRescue.pendingState?.stats?.[key] ?? state.stats[key]
            const after  = adRescue.rescuedStats?.[key] ?? Math.min(100, before + bonus)
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-sm">{meta.icon}</span>
                <span className="text-[11px] flex-1 truncate" style={{ color: meta.color }}>
                  {meta.label}
                </span>
                <span className="text-[11px] tabular-nums text-tran-textMuted">{before}</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: '#4CAF50' }}>
                  →{after}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full space-y-2">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.button
              key="claim"
              onClick={() => {
                trackAdRescueWatched({ duration, bonus })
                dispatch({ type: 'AD_RESCUE_COMPLETE' })
              }}
              className="w-full py-4 rounded-xl font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
                color: '#F5E6D0',
                minHeight: 56,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              whileTap={{ scale: 0.96 }}
            >
              ✓ Nhận +{bonus} mọi chỉ số &amp; Tiếp Tục
            </motion.button>
          ) : (
            <motion.div
              key="waiting"
              className="w-full py-4 rounded-xl text-sm text-center font-medium"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.3)',
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Đang xem quảng cáo... ({remaining}s)
            </motion.div>
          )}
        </AnimatePresence>

        {!showSkipConfirm ? (
          <button
            onClick={() => setShowSkipConfirm(true)}
            className="w-full py-2.5 text-xs text-gray-600 active:text-gray-400 transition-colors"
            style={{ minHeight: 44 }}
          >
            Bỏ qua → Kết thúc game
          </button>
        ) : (
          <motion.div
            className="rounded-xl border border-red-900/40 p-3 space-y-2"
            style={{ background: 'rgba(139,26,26,0.1)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[11px] text-center" style={{ color: 'rgba(255,160,160,0.8)' }}>
              Bỏ qua sẽ kết thúc game — không còn cơ hội phục hồi.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs border border-gray-700 text-gray-400 active:opacity-70"
                style={{ minHeight: 44 }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  trackAdRescueSkipped({ remaining })
                  dispatch({ type: 'AD_RESCUE_SKIP' })
                }}
                className="flex-1 py-2 rounded-lg text-xs border border-red-900/60 text-red-400 active:opacity-70"
                style={{ minHeight: 44 }}
              >
                Xác nhận kết thúc
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
