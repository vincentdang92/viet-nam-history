'use client'

import { motion } from 'framer-motion'
import CharacterPortrait from './CharacterPortrait'

const TYPE_BADGE = {
  battle:     { label: '⚔️ Trận Chiến',        cls: 'bg-red-900/70 text-red-200 border border-red-700/50' },
  cinematic:  { label: '✨ Sự Kiện Trọng Đại',  cls: 'bg-yellow-900/70 text-yellow-200 border border-yellow-700/50' },
  historical: { label: '📜 Lịch Sử',            cls: 'bg-purple-900/60 text-purple-200' },
  event:      { label: '🎭 Sự Kiện',            cls: 'bg-blue-900/60 text-blue-200' },
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  },
}

export default function CardDisplay({ event }) {
  if (!event) return null

  const badge   = TYPE_BADGE[event.type] ?? TYPE_BADGE.event
  const isBig   = event.type === 'battle' || event.isCinematic

  return (
    <motion.div
      className="flex flex-col gap-3 p-4"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Header row */}
      <motion.div variants={stagger.item} className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.cls}`}>
          {badge.label}
        </span>
        <span className="text-tran-textMuted text-xs font-mono">{event.year}</span>
      </motion.div>

      {/* Portrait */}
      <motion.div variants={stagger.item}>
        <CharacterPortrait characterId={event.character} isCinematic={isBig} />
      </motion.div>

      {/* Title + quote */}
      <motion.div variants={stagger.item} className="text-center">
        <h2
          className={`text-tran-text font-serif font-bold leading-snug
            ${isBig ? 'text-2xl' : 'text-xl'}`}
        >
          {event.title}
        </h2>
        {event.quote && (
          <p className="text-tran-secondary italic text-sm mt-1.5 leading-snug">
            &ldquo;{event.quote}&rdquo;
          </p>
        )}
      </motion.div>

      {/* Context */}
      <motion.p
        variants={stagger.item}
        className="text-tran-text/80 text-sm leading-relaxed text-center pb-1"
      >
        {event.context}
      </motion.p>
    </motion.div>
  )
}
