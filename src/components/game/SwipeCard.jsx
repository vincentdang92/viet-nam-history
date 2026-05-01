'use client'

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import CardDisplay from './CardDisplay'

const SWIPE_THRESHOLD = 80

export default function SwipeCard({ event, choices, onChoiceA, onChoiceB, cardKey, showTutorial }) {
  const x      = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-14, 14])

  const rightOpacity = useTransform(x, [20, 90], [0, 1])
  const rightScale   = useTransform(x, [20, 90], [0.85, 1])
  const leftOpacity  = useTransform(x, [-90, -20], [1, 0])
  const leftScale    = useTransform(x, [-90, -20], [1, 0.85])
  const rightTint    = useTransform(x, [0, SWIPE_THRESHOLD], [0, 0.15])
  const leftTint     = useTransform(x, [-SWIPE_THRESHOLD, 0], [0.15, 0])

  const handleDragEnd = (_, info) => {
    // For normal gameplay
    if (info.offset.x >  SWIPE_THRESHOLD && choices[0]) {
      if (onChoiceA) onChoiceA()
    }
    else if (info.offset.x < -SWIPE_THRESHOLD && choices[1]) {
      if (onChoiceB) onChoiceB()
    }
  }

  const isBattle = event?.type === 'battle' || event?.isCinematic || event?.type === 'campaign' || event?.type === 'combat_card'

  return (
    <div className="relative select-none w-full h-full flex flex-col">
      <motion.div
        key={cardKey}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        dragMomentum={false}
        style={{ x, rotate, touchAction: 'none' }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: -24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className={`relative w-full h-full flex flex-col rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing
          ${isBattle
            ? 'border-2 border-red-700/60 bg-gradient-to-b from-red-950/80 to-tran-card'
            : 'border border-tran-border bg-tran-card'
          }`}
        whileDrag={{ scale: 1.02 }}
      >
        {/* Drag tints */}
        <motion.div className="absolute inset-0 bg-tran-secondary/20 rounded-2xl pointer-events-none z-10" style={{ opacity: rightTint }} />
        <motion.div className="absolute inset-0 bg-red-800/20 rounded-2xl pointer-events-none z-10" style={{ opacity: leftTint }} />

        {/* Right overlay (choice A) */}
        <motion.div className="absolute inset-0 flex items-center justify-start pl-3 sm:pl-4 z-20 pointer-events-none" style={{ opacity: rightOpacity, scale: rightScale }}>
          <div className="bg-tran-secondary/90 text-tran-bg text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl max-w-[45%] leading-snug">
            ✓ {choices[0]?.text}
          </div>
        </motion.div>

        {/* Left overlay (choice B) */}
        <motion.div className="absolute inset-0 flex items-center justify-end pr-3 sm:pr-4 z-20 pointer-events-none" style={{ opacity: leftOpacity, scale: leftScale }}>
          <div className="bg-red-700/90 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl max-w-[45%] leading-snug text-right">
            ✗ {choices[1]?.text}
          </div>
        </motion.div>

        {/* Battle glow */}
        {isBattle && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: '0 0 32px rgba(185,28,28,0.4)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <CardDisplay event={event} />
      </motion.div>

      {/* Tutorial hint — only on first card */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            className="absolute -bottom-8 inset-x-0 flex items-center justify-center gap-3 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.span
              className="text-tran-secondary text-xs"
              animate={{ x: [-4, 0, -4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ← kéo
            </motion.span>
            <span className="text-tran-textMuted text-[10px]">hoặc nhấn nút bên dưới</span>
            <motion.span
              className="text-red-400 text-xs"
              animate={{ x: [4, 0, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              kéo →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
