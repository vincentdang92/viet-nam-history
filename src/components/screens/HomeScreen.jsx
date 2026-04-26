'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import chapters from '../../data/chapters.json'

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  },
}

export default function HomeScreen() {
  const { dispatch } = useGame()

  return (
    <motion.div
      className="min-h-screen bg-tran-bg flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,26,26,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            🏯
          </motion.div>
          <h1 className="text-tran-secondary font-serif text-4xl font-bold tracking-widest">
            MINH CHỦ
          </h1>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="h-px flex-1 bg-tran-border" />
            <p className="text-tran-textMuted text-xs px-2">Game Lịch Sử Việt Nam</p>
            <div className="h-px flex-1 bg-tran-border" />
          </div>
        </motion.div>

        {/* Chapter list */}
        <motion.div
          className="space-y-3 mb-8"
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          {chapters.map((ch) => (
            <motion.div key={ch.id} variants={stagger.item}>
              <motion.button
                className={`w-full p-4 rounded-xl border text-left
                  ${ch.available
                    ? 'border-tran-secondary/40 bg-tran-card hover:bg-tran-secondary/5'
                    : 'border-tran-border/20 bg-tran-card/30 cursor-not-allowed opacity-40'
                  }`}
                onClick={() => ch.available && dispatch({ type: 'START_GAME' })}
                disabled={!ch.available}
                whileTap={ch.available ? { scale: 0.98 } : {}}
                whileHover={ch.available ? { borderColor: 'rgba(212,160,23,0.7)' } : {}}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-tran-text font-serif font-bold">{ch.title}</h3>
                      {ch.available && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tran-secondary/20 text-tran-secondary font-medium">
                          MỞ
                        </span>
                      )}
                    </div>
                    <p className="text-tran-secondary text-xs">{ch.subtitle}</p>
                    <p className="text-tran-textMuted text-xs mt-1 leading-snug">{ch.description}</p>
                  </div>
                  <span className="text-tran-textMuted text-lg shrink-0 mt-1">
                    {ch.available ? '▶' : '🔒'}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer hint */}
        <motion.div
          className="text-center text-tran-textMuted text-xs space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Kéo thẻ trái / phải hoặc nhấn nút để chọn</p>
          <p className="opacity-50">✨ Fun First, Learn Always</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
