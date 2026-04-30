'use client'

import { motion } from 'framer-motion'
import { STAT_META } from '../../constants/gameConfig'

function EffectPills({ effects }) {
  if (!effects) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {Object.entries(effects).map(([key, val]) => {
        if (val === 0) return null
        const meta = STAT_META[key]
        const positive = val > 0
        return (
          <span
            key={key}
            className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{
              backgroundColor: (positive ? meta.color : '#C0392B') + '2A',
              color: positive ? meta.color : '#FF6B6B',
            }}
          >
            {meta.icon} {positive ? '+' : ''}{val}
          </span>
        )
      })}
    </div>
  )
}

// index 0 = swipe right (✓), index 1 = swipe left (✗)
const SIDE_CUE = ['← swipe phải', 'swipe trái →']
const SIDE_COLOR = ['text-tran-secondary', 'text-red-400']

export default function ChoiceButton({ choice, index, onClick, hovered, onHover, onLeave }) {
  return (
    <motion.button
      className={`w-full rounded-xl border p-3 text-left transition-colors duration-150
        ${hovered
          ? index === 0
            ? 'border-tran-secondary bg-tran-secondary/10'
            : 'border-red-600/60 bg-red-900/10'
          : 'border-tran-border bg-tran-card/80 hover:border-tran-border/80'
        }`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={onLeave}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-tran-text text-sm font-medium leading-snug flex-1">{choice.text}</p>
        <span className={`text-[10px] shrink-0 mt-0.5 ${SIDE_COLOR[index] ?? 'text-tran-textMuted'}`}>
          {SIDE_CUE[index]}
        </span>
      </div>
      <EffectPills effects={choice.effects} />
    </motion.button>
  )
}
