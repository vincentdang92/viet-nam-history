'use client'

import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { getArcIntro } from '../../engine/eventResolver'

const ARC_META = {
  1: { label: 'Chương I',   title: 'Lập Quốc',            icon: '🏯', years: '1225–1257' },
  2: { label: 'Chương II',  title: 'Ba Lần Kháng Nguyên', icon: '⚔️', years: '1257–1288' },
  3: { label: 'Chương III', title: 'Thịnh Rồi Suy',       icon: '🌅', years: '1288–1400' },
  4: { label: 'Chương IV',  title: 'Nhà Hồ & Thuộc Minh', icon: '🔥', years: '1400–1418' },
  5: { label: 'Chương V',   title: 'Lam Sơn Khởi Nghĩa',  icon: '⚡', years: '1418–1428' },
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  },
}

export default function ArcTransitionScreen() {
  const { state, dispatch } = useGame()
  const arcId = state.currentArc
  const meta  = ARC_META[arcId] ?? ARC_META[1]
  const intro = getArcIntro(arcId)

  return (
    <motion.div
      className="h-[100dvh] overflow-hidden bg-tran-bg flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient gold glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,160,23,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-5"
        >
          {/* Chapter number */}
          <motion.div variants={stagger.item} className="text-center">
            <span className="text-tran-textMuted text-xs uppercase tracking-[0.25em] font-medium">
              Nhà Trần
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            variants={stagger.item}
            className="text-6xl"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {meta.icon}
          </motion.div>

          {/* Arc title */}
          <motion.div variants={stagger.item} className="text-center">
            <p className="text-tran-secondary text-sm font-medium tracking-widest uppercase mb-1">
              {meta.label}
            </p>
            <h1 className="text-tran-text font-serif text-3xl font-bold">
              {meta.title}
            </h1>
            <p className="text-tran-textMuted text-sm mt-1">{meta.years}</p>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={stagger.item}
            className="w-16 h-px bg-tran-secondary/40"
          />

          {/* Intro text */}
          <motion.p
            variants={stagger.item}
            className="text-tran-text/80 text-sm leading-relaxed text-center"
          >
            {intro}
          </motion.p>

          {/* CTA */}
          <motion.button
            variants={stagger.item}
            onClick={() => dispatch({ type: 'START_ARC' })}
            className="mt-2 w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
              color: '#F5E6D0',
              boxShadow: '0 4px 24px rgba(139,26,26,0.4)',
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ boxShadow: '0 6px 32px rgba(139,26,26,0.55)' }}
          >
            Bắt Đầu {meta.label} →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
