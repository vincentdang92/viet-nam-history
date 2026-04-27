'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { STAT_META } from '../../constants/gameConfig'

// Fake ad content cycles through to simulate "real" ad
const AD_FRAMES = ['🏰', '⚔️', '🐉', '🎖️', '🗺️']

export default function AdRescueScreen() {
  const { state, dispatch } = useGame()
  const { adRescue, gameOverReason } = state
  const { duration, bonus, triggerStat } = adRescue

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
  const meta = STAT_META[triggerStat]

  return (
    <motion.div
      className="min-h-screen bg-black flex flex-col items-center justify-center p-5 max-w-sm mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top bar — ad label + progress */}
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
        {/* Animated noise / scan-line effect */}
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
          <div className="text-6xl mb-2">
            {AD_FRAMES[frameIdx]}
          </div>
          <p className="text-white/60 text-xs">Minh Chủ — Game Lịch Sử</p>
          <p className="text-white/30 text-[10px] mt-0.5">Phiên bản giới hạn</p>
        </motion.div>

        {/* Corner volume / mute icon */}
        <div className="absolute bottom-2 right-2 text-white/30 text-xs">🔇</div>
      </div>

      {/* Rescue info */}
      <div
        className="w-full rounded-xl p-4 mb-4 border"
        style={{ background: 'rgba(30,20,14,0.9)', borderColor: 'rgba(90,48,32,0.5)' }}
      >
        <p className="text-gray-400 text-xs mb-1 leading-snug">{gameOverReason}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base">{meta.icon}</span>
          <span className="text-[11px]" style={{ color: meta.color }}>
            {meta.label} sẽ được phục hồi
          </span>
          <span className="ml-auto font-bold text-sm" style={{ color: meta.color }}>
            +{bonus}
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full space-y-2">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.button
              key="claim"
              onClick={() => dispatch({ type: 'AD_RESCUE_COMPLETE' })}
              className="w-full py-4 rounded-xl font-bold text-sm"
              style={{ background: meta.color, color: '#1A0F0A', minHeight: 56 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              whileTap={{ scale: 0.96 }}
            >
              ✓ Nhận +{bonus} {meta.label} &amp; Tiếp Tục
            </motion.button>
          ) : (
            <motion.div
              key="waiting"
              className="w-full py-4 rounded-xl text-sm text-center font-medium"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                onClick={() => dispatch({ type: 'AD_RESCUE_SKIP' })}
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
