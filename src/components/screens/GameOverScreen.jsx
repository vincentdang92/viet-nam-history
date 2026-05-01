'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  },
}

export default function GameOverScreen() {
  const { state, dispatch } = useGame()

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden bg-tran-bg flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Red vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139,26,26,0.35) 100%)' }}
      />

      <div className="relative w-full max-w-md text-center">
        {/* Skull */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
          className="text-7xl mb-4"
        >
          💀
        </motion.div>

        <motion.variants
          variants={stagger.container}
          initial="initial"
          animate="animate"
        />

        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            variants={stagger.item}
            className="text-tran-primary font-serif text-3xl font-bold mb-1"
          >
            Triều Đại Sụp Đổ
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-tran-textMuted text-sm mb-4"
          >
            Trị vì {state.yearsReigned} năm &middot; Năm {state.currentYear}
          </motion.p>

          <motion.div
            variants={stagger.item}
            className="bg-tran-card border border-red-900/40 rounded-2xl p-4 mb-6 text-left"
          >
            <p className="text-tran-text text-sm leading-relaxed">{state.gameOverReason}</p>
          </motion.div>

          <motion.div variants={stagger.item} className="flex flex-col gap-3">
            {state.checkpoint && (
              <button
                onClick={() => dispatch({ type: 'RESTART_CHAPTER' })}
                className="w-full py-3.5 rounded-xl bg-tran-primary border border-tran-primary/50 text-tran-text text-sm font-bold shadow-lg hover:bg-tran-primary/80 active:scale-95 transition-all"
              >
                Làm Lại Chương {state.currentArc} ↺
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => dispatch({ type: 'START_GAME' })}
                className="flex-1 py-3 rounded-xl border border-red-900/40 bg-tran-card text-tran-text text-sm hover:bg-tran-card/80 active:scale-95 transition-all"
              >
                Chơi Lại Từ Đầu
              </button>
              <button
                onClick={() => dispatch({ type: 'RESTART' })}
                className="flex-1 py-3 rounded-xl border border-tran-border text-tran-text text-sm hover:bg-tran-card/80 active:scale-95 transition-all"
              >
                Trang Chủ
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
