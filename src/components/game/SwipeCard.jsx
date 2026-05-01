'use client'

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import CardDisplay from './CardDisplay'

const SWIPE_THRESHOLD = 80

export default function SwipeCard({ id, event, choices, onChoiceA, onChoiceB, cardKey, showTutorial }) {
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
    <div id={id || `event-wrapper-${event?.id}`} className="relative select-none w-full h-full flex flex-col">
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
        className={`relative w-full h-full flex flex-col shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing rounded-none ${isBattle ? 'bg-red-950/80' : 'bg-tran-card'}`}
        whileDrag={{ scale: 1.02 }}
      >
        {/* Drag tints */}
        <motion.div className="absolute inset-0 bg-tran-secondary/20 rounded-2xl pointer-events-none z-10" style={{ opacity: rightTint }} />
        <motion.div className="absolute inset-0 bg-red-800/20 rounded-2xl pointer-events-none z-10" style={{ opacity: leftTint }} />

        {/* Right overlay (choice A) */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ opacity: rightOpacity, scale: rightScale }}>
          <div className="border-[6px] border-double border-amber-500 text-amber-500 bg-black/60 backdrop-blur-sm font-serif font-black uppercase text-lg sm:text-xl px-6 py-4 rotate-[-12deg] shadow-[0_0_30px_rgba(245,158,11,0.4)] text-center max-w-[85%] leading-snug tracking-wider rounded-sm mix-blend-hard-light">
            {choices[0]?.text}
          </div>
        </motion.div>

        {/* Left overlay (choice B) */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ opacity: leftOpacity, scale: leftScale }}>
          <div className="border-[6px] border-double border-red-600 text-red-500 bg-black/60 backdrop-blur-sm font-serif font-black uppercase text-lg sm:text-xl px-6 py-4 rotate-[12deg] shadow-[0_0_30px_rgba(220,38,38,0.4)] text-center max-w-[85%] leading-snug tracking-wider rounded-sm mix-blend-hard-light">
            {choices[1]?.text}
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
